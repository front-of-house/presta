const fs = require('fs-extra')
const path = require('path')
const c = require('ansi-colors')
const mime = require('mime-types')

const { debug } = require('./debug')
const { OUTPUT_STATIC_DIR } = require('./constants')
const { pathnameToFile } = require('./pathnameToFile')
const { log, formatLog } = require('./log')
const { timer } = require('./timer')
const { getRouteParams } = require('./getRouteParams')
const { createContext } = require('./createContext')
const { normalizeResponse } = require('./normalizeResponse')
const { loadCache } = require('../load')

function renderStaticEntries (entries, config, options = {}) {
  return new Promise(async (y, n) => {
    debug('renderStaticEntries', entries)

    const allGeneratedFiles = []

    function onError (e, { location }) {
      if (options.watch) {
        log(
          `\n  ${c.red('error')} ${location}\n\n  > ${e.stack || e}\n\n${c.gray(
            `  errors detected, pausing...`
          )}\n`
        )
      } else {
        log(`\n  ${c.red('error')} ${location}\n\n  > ${e.stack || e}\n`)

        if (process.env.NODE_ENV === 'test') console.error(e)
      }

      y({ allGeneratedFiles })
    }

    for (const entry of entries) {
      try {
        delete require.cache[entry]

        const file = require(entry)
        const paths = await file.getStaticPaths()

        if (!paths || !paths.length) {
          formatLog({
            color: 'yellow',
            action: 'build',
            meta: ' ',
            description: `no paths to render`
          })

          continue
        }

        for (const url of paths) {
          const time = timer()
          const context = createContext({
            path: url,
            params: file.route ? getRouteParams(url, file.route) : {}
          })

          const response = normalizeResponse(await file.handler(context))
          const type = response.headers['Content-Type']
          const ext = type ? mime.extension(type) : 'html'
          const filename = pathnameToFile(url, ext)

          allGeneratedFiles.push(filename)

          fs.outputFileSync(
            path.join(config.merged.output, OUTPUT_STATIC_DIR, filename),
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

        n(e)

        break
      }
    }

    // clear to prevent memory leak
    loadCache.clearAllMemory()

    y({ allGeneratedFiles })
  })
}

module.exports = { renderStaticEntries }
