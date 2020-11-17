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

export async function prepareEntry (entry) {
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
        const p = await prepareEntry(entry)
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

  const configPath = config.configFile || path.join(CWD, CONFIG_DEFAULT)

  let staticIds = getFiles(config.pages).filter(isStatic)
  let dynamicIds = getFiles(config.pages).filter(isDynamic)

  // create initial entries
  let staticEntries = staticIds.map(id => createStaticEntry(id, config))
  createDynamicEntry(dynamicIds, config)

  if (isRestart) {
    renderStaticEntries(staticEntries, {
      watch: true,
      output: config.output
    })
  }

  // setup watcher
  const staticWatcher = graph()
  const dynamicWatcher = graph()
  const configWatcher = chokidar.watch(configPath, {
    ignore: ignoredFilesArray,
    ignoreInitial: true
  })
  const entryWatcher = chokidar.watch(
    config.pages.map(p => path.resolve(CWD, p)).map(globParent),
    { ignore: ignoredFilesArray, ignoreInitial: true }
  )

  dynamicWatcher.on('remove', ([id]) => {
    debug('dynamicWatcher - removed dynamic file', id)

    dynamicIds.splice(dynamicIds.indexOf(id), 1)

    createDynamicEntry(dynamicIds, config)
  })

  dynamicWatcher.on('change', ([id]) => {
    debug('dynamicWatcher - reload dynamic file', id)

    const isDyn = isDynamic(id)
    const wasDyn = !!dynamicIds.find(i => i === id)

    if (isDyn && wasDyn) {
      debug('dynamicWatcher - reload dynamic file', id)
    } else if (!isDyn && wasDyn) {
      debug('dynamicWatcher - remove dynamic file', id)

      dynamicIds.splice(dynamicIds.indexOf(id), 1)

      createDynamicEntry(dynamicIds, config)
    } else if (isDyn && !wasDyn) {
      debug('dynamicWatcher - add dynamic file', id)

      dynamicIds.push(id)

      createDynamicEntry(dynamicIds, config)
    }
  })

  staticWatcher.on('remove', ids => {
    for (const id of ids) {
      debug('staticWatcher - removed static file', id)

      staticIds.splice(staticIds.indexOf(id), 1)

      const index = staticEntries.findIndex(e => e.sourceFile === id)

      staticEntries.splice(index, 1)
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

        staticIds.splice(staticIds.indexOf(id), 1)

        const index = staticEntries.findIndex(e => e.sourceFile === id)

        staticEntries.splice(index, 1)
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

  configWatcher.on('change', async file => {
    debug('configWatcher - config changed', configPath)

    staticWatcher.close()
    dynamicWatcher.close()
    configWatcher.close()

    // clear for re-require
    delete require.cache[configPath]

    const newConfig = safeRequire(configPath, {})
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

  staticWatcher.add(staticIds)
  dynamicWatcher.add(dynamicIds)
}

export async function watch (initialConfig) {
  initWatch(initialConfig)
}

export async function build (config, options = {}) {
  debug('watch initialized with config', config)

  let staticIds = getFiles(config.pages).filter(isStatic)
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
