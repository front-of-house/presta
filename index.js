import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'
import graph from 'watch-dependency-graph'
import exit from 'exit'

import { debug } from './lib/debug'
import { PRESTA_CONFIG_DEFAULT } from './lib/constants'
import { createEntries } from './lib/createEntries'
import * as fileHash from './lib/fileHash'
import { pathnameToHtmlFile } from './lib/pathnameToHtmlFile'
import { log } from './lib/log'

const queue = new PQueue({ concurrency: 10 })

let buildRenderCount = 0

async function renderEntry (entry, options) {
  // really jusst used for prev paths now
  const fileFromHash = fileHash.get(entry.id)

  try {
    delete require.cache[entry.generatedFile]
  } catch (e) {}
  const { getPaths, render, createDocument } = require(entry.generatedFile)

  // was previously configured, remove so that it can re-render if reconfigured
  if (!getPaths) {
    fileHash.remove(entry.id)
    return
  }

  const pages = await getPaths()

  // remove non-existant paths
  if (fileFromHash) {
    fileFromHash.pages
      .filter(p => !pages.includes(p))
      .forEach(page => {
        debug(`unused path, removing ${page}`)
        fs.remove(path.join(output, pathnameToHtmlFile(page)))
      })
  }

  buildRenderCount += pages.length

  for (const page of pages) {
    queue.add(async () => {
      try {
        const st = Date.now()
        const result = await render({ pathname: page })

        fs.outputFileSync(
          path.join(options.output, pathnameToHtmlFile(page)),
          createDocument(result),
          'utf-8'
        )

        log(`  ${c.gray(Date.now() - st + 'ms')}\t${page}`)
      } catch (e) {
        if (options.watch) {
          log(
            `\n  ${c.red('error')}  ${page}\n  > ${e.stack || e}\n\n${c.gray(
              `  errors detected, pausing...`
            )}\n`
          )

          // important, reset this for next pass
          queue.clear()
        } else {
          log(`\n  ${c.red('error')}  ${page}\n  > ${e.stack || e}\n`)
        }
      }
    })
  }
}

export async function renderEntries (entries, options, done) {
  debug('render', entries)

  queue.on('idle', done || (() => {}))

  for (const entry of entries) {
    try {
      renderEntry(entry, options)
    } catch (e) {
      log(`\n  render error\n  > ${e.stack || e}\n`)
    }
  }
}

export async function watch (initialConfig) {
  function init (config) {
    const entries = createEntries(config)

    const instance = graph(
      [config.pages].concat(config.configFilepath || PRESTA_CONFIG_DEFAULT)
    )

    instance.on('update', async ids => {
      debug('watch-dependency-graph', ids)

      let entriesToUpdate = []

      for (const id of ids) {
        // if config file is updated OR added
        if (
          id.includes(config.configFilepath) ||
          id.includes(PRESTA_CONFIG_DEFAULT) // in event of added
        ) {
          const configFile = require(config.configFilepath)

          if (
            configFile.pages !== config.pages ||
            configFile.output !== config.output
          ) {
            debug('config file updated, restarting')

            await instance.close()

            return init({
              ...config,
              pages: configFile.pages || config.pages,
              output: configFile.output || config.output
            })
          } else {
            debug('config file updated, rebuilding all pages')

            entriesToUpdate = entries // reset to avoid dupes

            break
          }
        }

        for (const entry of entries) {
          if (entry.sourceFile === id) entriesToUpdate.push(entry)
        }
      }

      if (!entriesToUpdate.length) return

      debug('entriesToUpdate', entriesToUpdate)

      renderEntries(entriesToUpdate, {
        watch: true,
        output: config.output
      })
    })

    async function reset () {
      await instance.close()
      init(config)
    }

    instance.on('remove', reset)
    instance.on('add', reset)
  }

  init(initialConfig)
}

export async function build (config, options = {}) {
  const entries = createEntries(config)

  if (!entries.length) {
    log(`  ${c.gray('nothing to build')}\n`)
    exit()
  }

  options.onRenderStart()

  await renderEntries(
    entries,
    {
      output: config.output
    },
    () => {
      options.onRenderEnd({ count: buildRenderCount })
    }
  )
}
