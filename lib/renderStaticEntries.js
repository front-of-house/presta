import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import PQueue from 'p-queue'

import { debug } from './debug'
import { OUTPUT_STATIC_DIR } from './constants'
import { pathnameToHtmlFile } from './pathnameToHtmlFile'
import { log, formatLog } from './log'
import { timer } from './timer'
import { getRouteParams } from './getRouteParams'
import { defaultCreateContent } from './defaultCreateContent'
import { initPlugins } from './initPlugins'
import { createContext } from './createContext'

import { render, clearMemoryCache } from '../load'

export function renderStaticEntries (entries, config, options = {}) {
  return new Promise(async (y, n) => {
    debug('renderStaticEntries', entries)

    const decoratedEntries = []
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

        if (process.env.NODE_ENV === 'test') console.error(e)
      }

      y({ allGeneratedFiles })
    }

    queue.on('idle', () => {
      y({ allGeneratedFiles })
      clearMemoryCache()
    })

    for (const entry of entries) {
      try {
        delete require.cache[entry]

        const source = require(entry)

        decoratedEntries.push([source, await source.getStaticPaths()])
      } catch (e) {
        const location = entry.replace(config.cwd, '')

        onError(e, { location })
      }
    }

    for (const [entry, paths] of decoratedEntries) {
      for (const url of paths) {
        queue.add(async () => {
          try {
            const time = timer()
            const context = createContext({
              path: url,
              params: entry.route ? getRouteParams(url, entry.route) : {}
            })

            /*
             * Create plugin instances
             */
            initPlugins(context, config)

            const result = await render(
              entry.template,
              context,
              entry.render || config.render
            )
            const filename = pathnameToHtmlFile(url)

            allGeneratedFiles.push(filename)

            fs.outputFileSync(
              path.join(config.output, OUTPUT_STATIC_DIR, filename),
              (
                entry.createContent ||
                config.createContent ||
                defaultCreateContent
              )(result),
              'utf-8'
            )

            formatLog({
              color: 'green',
              action: 'build',
              meta: '• ' + time(),
              description: url
            })
          } catch (e) {
            onError(e, { location: url })
          }
        })
      }
    }
  })
}
