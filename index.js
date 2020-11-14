import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'
import graph from 'watch-dependency-graph'
import exit from 'exit'

import { debug } from './lib/debug'
import { CWD, CONFIG_DEFAULT } from './lib/constants'
import { createStaticEntry, createDynamicEntry } from './lib/createEntries'
import { pathnameToHtmlFile } from './lib/pathnameToHtmlFile'
import { log } from './lib/log'
import { timer } from './lib/timer'
import { getFiles, isStatic, isDynamic } from './lib/getFiles'
import { safeRequire } from './lib/safeRequire'
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
    debug('render', entries)

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
  const pageWatcher = graph(path.join(CWD, config.pages))

  pageWatcher.on('add', ids => {
    for (const id of ids) {
      const isStat = isStatic(id)
      const isDyn = isDynamic(id)

      if (isStat) {
        debug('add static file')

        staticIds.push(id)

        const entry = createStaticEntry(id, config)

        staticEntries.push(entry)

        renderStaticEntries([entry], {
          watch: true,
          output: config.output
        })
      }

      if (isDyn) {
        debug('reload dynamic file')

        dynamicIds.push(id)

        createDynamicEntry(dynamicIds, config)
      }
    }
  })

  pageWatcher.on('remove', ids => {
    for (const id of ids) {
      const wasStat = !!staticIds.find(e => e === id)
      const wasDyn = !!dynamicIds.find(e => e === id)

      if (wasStat) {
        debug('removed static file', id)

        staticIds.splice(staticIds.indexOf(id), 1)

        const index = staticEntries.findIndex(e => e.sourceFile === id)

        staticEntries.splice(index, 1)
      }

      if (wasDyn) {
        debug('removed dynamic file', id)

        dynamicIds.splice(dynamicIds.indexOf(id), 1)

        createDynamicEntry(dynamicIds, config)
      }
    }
  })

  pageWatcher.on('update', ids => {
    for (const id of ids) {
      const isStat = isStatic(id)
      const isDyn = isDynamic(id)
      const wasStat = !!staticIds.find(e => e === id)
      const wasDyn = !!dynamicIds.find(e => e === id)

      if (isStat && wasStat) {
        debug('render static file', id)

        const entry = staticEntries.find(e => e.sourceFile === id)

        renderStaticEntries([entry], {
          watch: true,
          output: config.output
        })
      } else if (!isStat && wasStat) {
        debug('remove static file', id)

        staticIds.splice(staticIds.indexOf(id), 1)

        const index = staticEntries.findIndex(e => e.sourceFile === id)

        staticEntries.splice(index, 1)
      } else if (isStat && !wasStat) {
        debug('add static file', id)

        staticIds.push(id)

        const entry = createStaticEntry(id, config)

        staticEntries.push(entry)

        renderStaticEntries([entry], {
          watch: true,
          output: config.output
        })
      }

      if (isDyn && wasDyn) {
        debug('reload dynamic file', id)
      } else if (!isDyn && wasDyn) {
        debug('remove dynamic file', id)

        dynamicIds.splice(dynamicIds.indexOf(id), 1)
      } else if (isDyn && !wasDyn) {
        debug('add dynamic file', id)

        dynamicIds.push(id)
      }
    }

    debug({ staticIds, dynamicIds, staticEntries })
  })

  const configWatcher = graph(
    config.configFilepath || path.join(CWD, CONFIG_DEFAULT)
  )

  async function handleConfigUpdate ([configFile]) {
    await pageWatcher.close()
    await configWatcher.close()

    const newConfig = safeRequire(configFile, {})

    initWatch({ ...config, ...configFile }, true)
  }

  configWatcher.on('add', handleConfigUpdate)
  configWatcher.on('remove', handleConfigUpdate)
  configWatcher.on('update', handleConfigUpdate)
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
