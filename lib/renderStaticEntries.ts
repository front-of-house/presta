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
import { normalizeResponse } from './normalizeResponse'
import { loadCache } from './load'
import { builtStaticFiles } from './builtStaticFiles'
import { removeBuiltStaticFile } from './removeBuiltStaticFile'

import type { Presta } from '../'

export function renderStaticEntries (entries: string[], config: Presta): Promise<{ allGeneratedFiles: string[] }> {
  return new Promise(async (y, n) => {
    debug('renderStaticEntries', entries)

    const allGeneratedFiles: string[] = []

    for (const entry of entries) {
      const location = entry.replace(config.cwd, '')

      try {
        delete require.cache[entry]

        const file = require(entry)
        const paths = await file.getStaticPaths()

        const prevFiles = (builtStaticFiles[entry] =
          builtStaticFiles[entry] || [])
        const nextFiles: string[] = []

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
          const event = {
            path: url,
            params: file.route ? getRouteParams(url, file.route) : {}
          }

          const response = normalizeResponse(await file.handler(event, {}))
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
