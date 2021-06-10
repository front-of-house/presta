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
const { builtStaticFiles } = require('./builtStaticFiles')
const { removeBuiltStaticFile } = require('./removeBuiltStaticFile')

function renderStaticEntries (entries, config, options = {}) {
  return new Promise(async (y, n) => {
    debug('renderStaticEntries', entries)

    const allGeneratedFiles = []

    for (const entry of entries) {
      const location = entry.replace(config.cwd, '')

      try {
        delete require.cache[entry]

        const file = require(entry)
        const paths = await file.getStaticPaths()

        const prevFiles = (builtStaticFiles[entry] =
          builtStaticFiles[entry] || [])
        const nextFiles = []

        if (!paths || !paths.length) {
          formatLog({
            color: 'yellow',
            action: 'build',
            meta: ' ',
            description: `${location} - no paths to render`
          })

          prevFiles.forEach(file => removeBuiltStaticFile(file, config))

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
          nextFiles.push(filename)

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

        // diff and remove files
        for (const file of prevFiles) {
          if (!nextFiles.includes(file)) {
            removeBuiltStaticFile(file, config)
          }
        }

        builtStaticFiles[entry] = nextFiles
      } catch (e) {
        if (config.env === 'development') {
          log(
            `\n  ${c.red('error')} ${location}\n\n  > ${e.stack ||
              e}\n\n${c.gray(`  errors detected, pausing...`)}\n`
          )

          y({ allGeneratedFiles })
        } else {
          log(`\n  ${c.red('error')} ${location}\n\n  > ${e.stack || e}\n`)

          n(e)
        }

        // exit loop on any error
        break
      }
    }

    // clear to prevent memory leak
    loadCache.clearAllMemory()

    y({ allGeneratedFiles })
  })
}

module.exports = { renderStaticEntries }
