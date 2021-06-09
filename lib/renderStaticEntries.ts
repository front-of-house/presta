import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import mime from 'mime-types'

import { debug } from './debug'
import { OUTPUT_STATIC_DIR } from './constants'
import { pathnameToFile } from './pathnameToFile'
import { log, formatLog } from './log'
import { timer } from './timer'
import { getRouteParams } from './getRouteParams'
import { createContext } from './createContext'
import { normalizeResponse } from './normalizeResponse'
import { loadCache } from '../load'
import config from './types/config'

export const renderStaticEntries = (entries: string[], config: config, options: any = {}) => {
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
          const ext = type ? mime.extension(type) as string : 'html'
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
