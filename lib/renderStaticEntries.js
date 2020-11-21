import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'

import { debug } from './debug'
import { CWD } from './constants'
import { pathnameToHtmlFile } from './pathnameToHtmlFile'
import { log } from './log'
import { timer } from './timer'

import { clearMemoryCache } from '../load'

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
              path.join(options.output, 'static', filename),
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
