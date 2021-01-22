const fs = require('fs-extra')
const path = require('path')
const c = require('ansi-colors')
const PQueue = require('p-queue').default

const { debug } = require('./debug')
const { OUTPUT_STATIC_DIR } = require('./constants')
const { pathnameToHtmlFile } = require('./pathnameToHtmlFile')
const { log, formatLog } = require('./log')
const { timer } = require('./timer')
const { getRouteParams } = require('./getRouteParams')
const { defaultCreateContent } = require('./defaultCreateContent')
const { initPlugins } = require('./initPlugins')
const { createContext } = require('./createContext')

const { render, clearMemoryCache } = require('../load')

function renderStaticEntries (entries, config, options = {}) {
  return new Promise(async (y, n) => {
    debug('renderStaticEntries', entries)

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

      // after all are rendered, clear data to prevent memory leak
      clearMemoryCache()
    })

    for (const entry of entries) {
      queue.add(async () => {
        try {
          delete require.cache[entry]

          const source = require(entry)
          const paths = await source.getStaticPaths()

          // TODO init plugins here? or per path/render?

          for (const url of paths) {
            const time = timer()
            const context = createContext({
              path: url,
              params: source.route ? getRouteParams(url, source.route) : {}
            })

            /*
             * Create plugin instances
             */
            initPlugins(context, config)

            const result = await render(
              source.template,
              context,
              source.render || config.render
            )
            const filename = pathnameToHtmlFile(url)

            allGeneratedFiles.push(filename)

            fs.outputFileSync(
              path.join(config.output, OUTPUT_STATIC_DIR, filename),
              (
                source.createContent ||
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
          }
        } catch (e) {
          const location = entry.replace(config.cwd, '')

          onError(e, { location })
        }
      })
    }
  })
}

module.exports = { renderStaticEntries }
