import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'
import graph from 'watch-dependency-graph'
import exit from 'exit'

import { debug } from './lib/debug'
import { isStaticallyExportable } from './lib/isStaticallyExportable'
import { getValidFilesArray } from './lib/getValidFilesArray'
import { createEntries } from './lib/createEntries'
import * as fileHash from './lib/fileHash'
import { pathnameToHtmlFile } from './lib/pathnameToHtmlFile'
import { log } from './lib/log'

export async function renderEntries (entries, options, cb) {
  const { output, watch = false } = options

  debug('render', entries)

  const queue = new PQueue({ concurrency: 10 })
  queue.on('idle', cb || (() => {}))

  await Promise.all(
    entries.map(async entry => {
      // TODO do this elsewhere
      // was previously configured, remove so that it can re-render if reconfigured
      if (!isStaticallyExportable(entry.generatedFile)) {
        fileHash.remove(entry.id)
        return
      }

      // really jusst used for prev paths now
      const fileFromHash = fileHash.get(entry.id)

      const { getPaths, render, createDocument } = require(entry.generatedFile)

      const allPages = await getPaths()

      // remove non-existant paths
      if (fileFromHash) {
        fileFromHash.pages
          .filter(p => !allPages.includes(p))
          .forEach(page => {
            debug(`unused path, removing ${page}`)
            fs.remove(path.join(output, pathnameToHtmlFile(page)))
          })
      }

      allPages.forEach(pathname => {
        queue.add(async () => {
          try {
            const st = Date.now()
            const result = await render({ pathname })

            fs.outputFileSync(
              path.join(output, pathnameToHtmlFile(pathname)),
              createDocument(result),
              'utf-8'
            )

            log(`  ${c.gray(Date.now() - st + 'ms')}\t${pathname}`)

            delete require.cache[entry.generatedFile]
          } catch (e) {
            if (watch) {
              log(
                `\n  ${c.red('error')}  ${pathname}\n  > ${e.stack ||
                  e}\n\n${c.gray(`  errors detected, pausing...`)}\n`
              )

              // important, reset this for next pass
              queue.clear()
            } else {
              log(`\n  ${c.red('error')}  ${pathname}\n  > ${e.stack || e}\n`)
            }
          }
        })
      })
    })
  ).catch(e => {
    log(`\n  render error\n  > ${e.stack || e}\n`)
  })
}

export async function watch (config) {
  function init () {
    let filesArray = getValidFilesArray(config.input)
    let entries = createEntries({
      filesArray,
      baseDir: config.baseDir,
      configFilepath: config.configFilepath,
      runtimeFilepath: config.runtimeFilepath
    })
    debug('entries', entries)

    const instance = graph(config.input)

    instance.on('update', ids => {
      debug('watch-dependency-graph', ids)

      const entriesToUpdate = []

      for (const id of ids) {
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

    instance.on('remove', () => {
      instance.close()
      init()
    })
  }

  init()
}

export async function build (config, options = {}) {
  const filesArray = getValidFilesArray(config.input)
  const entries = createEntries({
    filesArray,
    baseDir: config.baseDir,
    configFilepath: config.configFilepath,
    runtimeFilepath: config.runtimeFilepath
  })
  debug('entries', entries)

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
      options.onRenderEnd()
    }
  )
}
