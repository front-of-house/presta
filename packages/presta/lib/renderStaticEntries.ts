import fs from 'fs-extra'
import path from 'path'
import mime from 'mime-types'

import * as logger from './log'
import { timer } from './timer'
import { getRouteParams } from './getRouteParams'
import { normalizeResponse } from './normalizeResponse'
import { builtStaticFiles } from './builtStaticFiles'
import { removeBuiltStaticFile } from './removeBuiltStaticFile'

import type { Presta } from '..'

export function pathnameToFile(pathname: string, ext = 'html') {
  return !!path.extname(pathname)
    ? pathname // if path has extension, use it
    : ext === 'html'
    ? `${pathname}/index.html` // if HTML is inferred, create index
    : `${pathname}.${ext}` // anything but HTML will need an extension, otherwise browsers will render as text
}

export function renderStaticEntries(entries: string[], config: Presta): Promise<{ allGeneratedFiles: string[] }> {
  return new Promise(async (y, n) => {
    logger.debug({
      label: 'debug',
      message: `rendering ${JSON.stringify(entries)}`,
    })

    const allGeneratedFiles: string[] = []

    for (const entry of entries) {
      const location = entry.replace(config.cwd, '')

      try {
        delete require.cache[entry]

        console.log('before')
        const file = require(entry)
        console.log('after')
        const paths = await file.getStaticPaths()

        const prevFiles = (builtStaticFiles[entry] = builtStaticFiles[entry] || [])
        const nextFiles: string[] = []

        if (!paths || !paths.length) {
          logger.warn({
            label: 'paths',
            message: `${location} - no paths to render`,
          })

          prevFiles.forEach((file) => removeBuiltStaticFile(file, config))

          continue
        }

        for (const url of paths) {
          const time = timer()
          const event = {
            path: url,
            params: file.route ? getRouteParams(url, file.route) : {},
          }

          const response = normalizeResponse(await file.handler(event, {}))
          const type = response.headers ? response.headers['Content-Type'] : ''
          const ext = type ? mime.extension(type as string) || 'html' : 'html'
          const filename = pathnameToFile(url, ext)

          allGeneratedFiles.push(filename)
          nextFiles.push(filename)

          fs.outputFileSync(path.join(config.staticOutputDir, filename), response.body, 'utf-8')

          logger.info({
            label: 'built',
            message: url,
            duration: time(),
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
          logger.error({
            label: 'error',
            message: 'errors detected, pausing...',
            error: e,
          })

          y({ allGeneratedFiles })
        } else {
          logger.error({
            label: 'error',
            error: e,
          })

          n(e)
        }

        // exit loop on any error
        break
      }
    }

    // clear to prevent memory leak
    // loadCache.clearAllMemory() // TODO probs can't — emit?

    y({ allGeneratedFiles })
  })
}
