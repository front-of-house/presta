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
const { initPlugins } = require('./initPlugins')
const { createContext } = require('./createContext')

const { clearMemoryCache } = require('../load')

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

          const file = require(entry)
          const paths = await file.getStaticPaths()

          for (const url of paths) {
            const time = timer()
            const context = createContext({
              path: url,
              params: file.route ? getRouteParams(url, file.route) : {}
            })

            /*
             * Create plugin instances
             */
            initPlugins(context, config)

            const response = file.handler(context)
            const filename = pathnameToHtmlFile(url)

            allGeneratedFiles.push(filename)

            fs.outputFileSync(
              path.join(config.output, OUTPUT_STATIC_DIR, filename),
              response.body,
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
