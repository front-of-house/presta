import fs from 'fs-extra'
import path from 'path'
import mime from 'mime-types'

import * as logger from './log'
import { timer } from './timer'
import { getRouteParams } from './getRouteParams'
import { normalizeResponse } from './normalizeResponse'
import { createLiveReloadScript } from './liveReloadScript'
import { Env } from './constants'
import { Config } from './config'

export type StaticFilesMap = { [filename: string]: string[] }

export function pathnameToFile(pathname: string, ext = 'html') {
  return !!path.extname(pathname)
    ? pathname // if path has extension, use it
    : ext === 'html'
    ? `${pathname}/index.html` // if HTML is inferred, create index
    : `${pathname}.${ext}` // anything but HTML will need an extension, otherwise browsers will render as text
}

export async function removeBuiltStaticFile(file: string) {
  logger.debug({
    label: 'debug',
    message: `removing old static file ${file}`,
  })

  return fs.remove(file)
}

export async function removeBuiltFiles(files: string[]) {
  return Promise.all(files.map(removeBuiltStaticFile))
}

export async function buildStaticFile(file: string, output: string, { footer }: { footer: string }) {
  const lambda = require(file)
  const paths = await lambda.getStaticPaths()

  const builtFiles: string[] = []

  if (!paths || !paths.length) return builtFiles

  for (const url of paths) {
    const time = timer()

    const event = {
      path: url,
      pathParameters: lambda.route ? getRouteParams(url, lambda.route) : {},
    }

    const response = normalizeResponse(await lambda.handler(event, {}))
    const type = response.headers ? response.headers['Content-Type'] : ''
    const ext = type ? mime.extension(type as string) || 'html' : 'html'
    const filename = pathnameToFile(url, ext)
    const html = response.body + footer

    fs.outputFileSync(path.join(output, filename), html, 'utf-8')

    logger.info({
      label: 'built',
      message: url,
      duration: time(),
    })

    builtFiles.push(filename)
  }

  return builtFiles
}

export async function buildStaticFiles(files: string[], config: Config, staticFilesMap: StaticFilesMap = {}) {
  const isDev = config.env === Env.DEVELOPMENT
  const output = config.staticOutputDir
  const footer = isDev ? createLiveReloadScript({ port: config.port }) : ''

  for (const file of files) {
    try {
      const filename = file.replace(process.cwd(), '')
      const prevBuiltFiles = staticFilesMap[file] || []
      const builtFiles = await buildStaticFile(file, output, { footer })

      if (!builtFiles || !builtFiles.length) {
        logger.warn({
          label: 'paths',
          message: `${filename} - no paths to render`,
        })

        removeBuiltFiles(prevBuiltFiles.map((file) => path.join(output, file)))

        continue
      }

      // diff and remove files
      for (const file of prevBuiltFiles) {
        if (!builtFiles.includes(file)) {
          removeBuiltStaticFile(path.join(output, file))
        }
      }

      staticFilesMap[file] = builtFiles
    } catch (e) {
      logger.error({ label: 'error', error: e as Error })

      // exit loop on any error
      break
    }
  }

  return {
    staticFilesMap,
  }
}
