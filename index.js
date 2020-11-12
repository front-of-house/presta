import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'
import graph from 'watch-dependency-graph'
import exit from 'exit'

import { debug } from './lib/debug'
import {
  CWD,
  PRESTA_CONFIG_DEFAULT,
  PRESTA_CONFIGS_WITH_EXTENSIONS
} from './lib/constants'
import { createStaticEntries, createDynamicEntry } from './lib/createEntries'
import { pathnameToHtmlFile } from './lib/pathnameToHtmlFile'
import { log } from './lib/log'
import { timer } from './lib/timer'
import { getFiles } from './lib/getFiles'
import { safeRequire } from './lib/safeRequire'
import { clearMemoryCache } from './load'

const cwd = process.cwd()

export async function prepareEntry (entry) {
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
        onError(e, {
          location: entry.sourceFile.replace(cwd, '') + ' getPaths'
        })
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

  const staticEntries = createStaticEntries(config)

  // unused here, but output it every time
  createDynamicEntry(config)

  if (isRestart) {
    // rebuild these on every restart
    renderStaticEntries(staticEntries, {
      watch: true,
      output: config.output
    })

    // TODO emit update on restart
  }

  const configWatcher = graph(
    ...[config.configFilepath || PRESTA_CONFIGS_WITH_EXTENSIONS]
  )
  const staticWatcher = graph(staticEntries.map(e => e.entryFile))
  const dynamicWatcher = graph(path.join(CWD, config.pages))

  async function restart () {
    const configFile = safeRequire(
      config.configFilepath || PRESTA_CONFIG_DEFAULT,
      {}
    )

    await staticWatcher.close()
    await dynamicWatcher.close()
    await configWatcher.close()

    initWatch({ ...config, ...configFile }, true)
  }

  function writeDynamicEntry (ids) {
    debug('dynamic watcher updated', ids)

    const configFile = safeRequire(
      config.configFilepath || PRESTA_CONFIG_DEFAULT,
      {}
    )

    // write new entry and clear cache for server
    delete require.cache[createDynamicEntry({ ...config, ...configFile })]
  }

  configWatcher.on('update', restart)
  configWatcher.on('add', restart)
  configWatcher.on('remove', restart)

  staticWatcher.on('remove', restart)
  staticWatcher.on('add', restart)
  staticWatcher.on('update', async ids => {
    debug('static watcher update', ids)

    let staticEntriesToRender = []

    for (const id of ids) {
      for (const entry of staticEntries) {
        if (entry.entryFile === id) staticEntriesToRender.push(entry)
      }
    }

    if (staticEntriesToRender.length) {
      debug('static entries to render', staticEntriesToRender)

      renderStaticEntries(staticEntriesToRender, {
        watch: true,
        output: config.output
      })
    }
  })

  dynamicWatcher.on('update', writeDynamicEntry)
  dynamicWatcher.on('add', writeDynamicEntry)
  dynamicWatcher.on('remove', writeDynamicEntry)
}

export async function watch (initialConfig) {
  initWatch(initialConfig)
}

export async function build (config, options = {}) {
  const staticEntries = createStaticEntries(config)

  if (!staticEntries.length) {
    log(`  ${c.gray('nothing to build')}\n`)
    exit()
  }

  options.onRenderStart()

  const { allGeneratedFiles } = await renderStaticEntries(staticEntries, {
    output: config.output
  })

  options.onRenderEnd({ count: allGeneratedFiles.length })
}
