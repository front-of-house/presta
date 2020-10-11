import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'
import graph from 'watch-dependency-graph'
import exit from 'exit'

import { debug } from './lib/debug'
import { PRESTA_CONFIG_DEFAULT } from './lib/constants'
import { createEntries } from './lib/createEntries'
import { pathnameToHtmlFile } from './lib/pathnameToHtmlFile'
import { log } from './lib/log'

const queue = new PQueue({ concurrency: 10 })

let buildRenderCount = 0

async function renderEntry (entry, options) {
  try {
    delete require.cache[entry.generatedFile] // TODO requried?
  } catch (e) {}
  const { getPaths, render, createDocument } = require(entry.generatedFile)

  const pages = await getPaths()

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

    async function restart (c = config) {
      await instance.close()
      init(c)
    }

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
          const definesPages = configFile.pages !== undefined
          const definesOutput = configFile.output !== undefined
          const pagesMismatch =
            definesPages && configFile.pages !== config.pages
          const outputMismatch =
            definesOutput && configFile.output !== config.output

          if (pagesMismatch || outputMismatch) {
            debug('config file updated, restarting watch process')

            restart({
              ...config,
              pages: configFile.pages || config.pages,
              output: configFile.output || config.output
            })

            return
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

    instance.on('remove', restart)
    instance.on('add', restart)
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
