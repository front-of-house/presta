import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'
import graph from 'watch-dependency-graph'
import exit from 'exit'
import globParent from 'glob-parent'
import chokidar from 'chokidar'

import { debug } from './lib/debug'
import { CWD, CONFIG_DEFAULT } from './lib/constants'
import { createStaticEntry, createDynamicEntry } from './lib/createEntries'
import { pathnameToHtmlFile } from './lib/pathnameToHtmlFile'
import { log } from './lib/log'
import { timer } from './lib/timer'
import { getFiles, isStatic, isDynamic } from './lib/getFiles'
import { safeRequire } from './lib/safeRequire'
import { ignoredFilesArray } from './lib/ignore'
import { clearMemoryCache } from './load'

export async function prepareStaticEntry (entry) {
  delete require.cache[entry.entryFile]

  const { getPaths, render, createDocument } = require(entry.entryFile)

  return {
    pages: await getPaths(),
    render,
    createDocument
  }
}

export function renderStaticEntries (entries, options, done) {
  return new Promise(async (y, n) => {
    debug('renderStaticEntries', entries)

    const preparedEntries = []
    const allGeneratedFiles = []
    const queue = new PQueue({ concurrency: 10 })

    function onError (e, { location }) {
      if (options.watch) {
        log(
          `\n  ${c.red('error')} ${location}\n\n  > ${e.stack || e}\n\n${c.gray(
            `  errors detected, pausing...`
          )}\n`
        )

        // IMPORTANT, reset this for next pass
        queue.clear()
      } else {
        log(`\n  ${c.red('error')} ${location}\n\n  > ${e.stack || e}\n`)
      }

      y({ allGeneratedFiles })
    }

    queue.on('idle', () => {
      y({ allGeneratedFiles })
      clearMemoryCache()
    })

    for (const entry of entries) {
      try {
        const p = await prepareStaticEntry(entry)
        preparedEntries.push(p)
      } catch (e) {
        const location = entry.sourceFile.replace(CWD, '')
        if (e.message.includes(`does not provide an export named 'getPaths'`)) {
          log(`\n  ${c.yellow('error')} ${location} missing getPaths export\n`)
        } else {
          onError(e, { location })
        }
      }
    }

    for (const { pages, render, createDocument } of preparedEntries) {
      for (const page of pages) {
        queue.add(async () => {
          try {
            const time = timer()
            const result = await render({ pathname: page })
            const filename = pathnameToHtmlFile(page)

            allGeneratedFiles.push(filename)

            fs.outputFileSync(
              path.join(options.output, filename),
              createDocument(result),
              'utf-8'
            )

            log(`  ${c.gray(time().padEnd(8))}${page}`)
          } catch (e) {
            onError(e, { location: page })
          }
        })
      }
    }
  })
}

function initWatch (config, isRestart) {
  debug('watch initialized with config', config)

  /*
   * Either the config the user specified, or the default path in case they
   * create a file
   */
  const configPath = config.configFile || path.join(CWD, CONFIG_DEFAULT)

  /*
   * Get files that match static/dynamic patters at startup
   */
  let staticIds = getFiles(config.pages).filter(isStatic)
  let dynamicIds = getFiles(config.pages).filter(isDynamic)

  /*
   * Create initial static and dynamic entries
   */
  let staticEntries = staticIds.map(id => createStaticEntry(id, config))
  createDynamicEntry(dynamicIds, config)

  /*
   * if the watch just restarted, rebuild everything
   *
   * TODO could avoid this by better confirWatcher
   */
  if (isRestart) {
    renderStaticEntries(staticEntries, {
      watch: true,
      output: config.output
    })
  }

  /*
   * Set up all watchers
   */
  const staticWatcher = graph() // static pages
  const dynamicWatcher = graph() // dynamic pages
  // config file watcher only
  const configWatcher = chokidar.watch(configPath, {
    ignore: ignoredFilesArray,
    ignoreInitial: true
  })
  // watcher for adding/removing of pages
  const entryWatcher = chokidar.watch(
    config.pages.map(p => path.resolve(CWD, p)).map(globParent),
    { ignore: ignoredFilesArray, ignoreInitial: true }
  )

  /*
   * dynamicWatcher monitors files that were determined to be dynamic at
   * startup. If a file is updated to remove the exported route, or the file is
   * deleted, the watcher stops watching the file and we remove it from the
   * server. Otherwise, just reload the page if needed.
   */
  dynamicWatcher.on('remove', ([id]) => {
    debug('dynamicWatcher - deleted dynamic file', id)

    // some duplicate events come through, don't want to splice(-1, 1)
    if (dynamicIds.includes(id)) {
      dynamicIds.splice(dynamicIds.indexOf(id), 1)

      createDynamicEntry(dynamicIds, config)
    }

    // dynamicWatcher automatically stops watching remove dfiles
  })
  dynamicWatcher.on('change', ([id]) => {
    const isDyn = isDynamic(id)
    const wasDyn = !!dynamicIds.find(i => i === id)

    if (isDyn && wasDyn) {
      debug('dynamicWatcher - reload dynamic file', id)
    } else if (!isDyn && wasDyn) {
      debug('dynamicWatcher - un-configured dynamic file', id)

      // some duplicate events come through, don't want to splice(-1, 1)
      if (dynamicIds.includes(id)) {
        dynamicIds.splice(dynamicIds.indexOf(id), 1)

        createDynamicEntry(dynamicIds, config)
      }

      dynamicWatcher.remove(id) // can be added back by entryWatcher
    } else if (isDyn && !wasDyn) {
      debug('dynamicWatcher - configured dynamic file', id)

      dynamicIds.push(id)

      createDynamicEntry(dynamicIds, config)
    }
  })

  /*
   * staticWatcher, again, monitors only files that matched the required static
   * exports as startup. Here they can be removed by deletion or un-configuring
   * the static exports. entryWatcher also manages adding them back when deleted.
   */
  staticWatcher.on('remove', ids => {
    for (const id of ids) {
      debug('staticWatcher - deleted static file', id)

      // some duplicate events come through, don't want to splice(-1, 1)
      if (staticIds.includes(id)) {
        staticIds.splice(staticIds.indexOf(id), 1)

        const index = staticEntries.findIndex(e => e.sourceFile === id)

        staticEntries.splice(index, 1)
      }
    }
  })
  staticWatcher.on('change', ids => {
    for (const id of ids) {
      const isStat = isStatic(id)
      const wasStat = !!staticIds.find(e => e === id)

      if (isStat && wasStat) {
        debug('staticWatcher - render static file', id)

        const entry = staticEntries.find(e => e.sourceFile === id)

        renderStaticEntries([entry], {
          watch: true,
          output: config.output
        })
      } else if (!isStat && wasStat) {
        debug('staticWatcher - remove static file', id)

        // some duplicate events come through, don't want to splice(-1, 1)
        if (staticIds.includes(id)) {
          staticIds.splice(staticIds.indexOf(id), 1)

          const index = staticEntries.findIndex(e => e.sourceFile === id)

          staticEntries.splice(index, 1)
        }

        staticWatcher.remove(id)
      } else if (isStat && !wasStat) {
        debug('staticWatcher - add static file', id)

        staticIds.push(id)

        const entry = createStaticEntry(id, config)

        staticEntries.push(entry)

        renderStaticEntries([entry], {
          watch: true,
          output: config.output
        })
      }
    }
  })

  /*
   * configWatcher for the moment is very naive. If it changes, we just restart
   * everything and rebuild all files (since their config might contain
   * templating).
   *
   * TODO In the future we could probably be smarter about this.
   */
  configWatcher.on('change', async file => {
    debug('configWatcher - config changed', configPath)

    staticWatcher.close()
    dynamicWatcher.close()
    configWatcher.close()

    // clear config file for re-require
    delete require.cache[configPath]

    // safe require in case it's been removed
    const newConfig = safeRequire(configPath, {})

    // just continually merge updates, in case a combo of CLI and config options
    const mergedConfig = {
      ...config,
      ...newConfig
    }

    initWatch(
      {
        ...mergedConfig,
        pages: [].concat(mergedConfig.pages) // always an array
      },
      true
    )
  })

  /*
   * entryWatcher watches the raw file globs passed to the CLI or as `pages` in
   * the config. If checks on add/change to see if a file should be upgraded to
   * a static/dynamic source file, and added to one of those specific
   * watchers.
   */
  entryWatcher.on('all', (event, file) => {
    if (!/add|change/.test(event)) return

    const isStat = isStatic(file)
    const isDyn = isDynamic(file)

    if (isStat) {
      if (staticIds.includes(file)) return

      debug('entryWatcher - add static file')

      staticIds.push(file)

      const entry = createStaticEntry(file, config)

      staticEntries.push(entry)

      renderStaticEntries([entry], {
        watch: true,
        output: config.output
      })

      staticWatcher.add(file)
    }

    if (isDyn) {
      if (dynamicIds.includes(file)) return

      debug('entryWatcher - add dynamic file')

      dynamicIds.push(file)

      createDynamicEntry(dynamicIds, config)

      dynamicWatcher.add(file)
    }
  })

  /**
   * Init watching after event subscriptions
   */
  staticWatcher.add(staticIds)
  dynamicWatcher.add(dynamicIds)
}

export async function watch (initialConfig) {
  initWatch(initialConfig)
}

export async function build (config, options = {}) {
  debug('watch initialized with config', config)

  const staticIds = getFiles(config.pages).filter(isStatic)
  let dynamicIds = getFiles(config.pages).filter(isDynamic)

  if (!staticIds.length && !dynamicIds.length) {
    log(`  ${c.gray('nothing to build')}\n`)
    exit()
  }

  // create initial entries
  let staticEntries = staticIds.map(id => createStaticEntry(id, config))

  createDynamicEntry(dynamicIds, config)

  options.onRenderStart()

  const { allGeneratedFiles } = await renderStaticEntries(staticEntries, {
    output: config.output
  })

  options.onRenderEnd({ count: allGeneratedFiles.length })
}
