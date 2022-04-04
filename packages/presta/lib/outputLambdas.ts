import fs from 'fs-extra'
import path from 'path'
import rsort from 'route-sort'
import { hashContent } from '@presta/utils'

import * as logger from './log'
import { Config } from './config'
import { Env } from './constants'
import { ManifestDynamicFile } from './manifest'

export function slugify(filename: string) {
  return filename
    .replace(process.cwd(), '') // /pages/File.page.js
    .split('.') // extension, [/pages/File, page, js]
    .reverse()
    .slice(1)
    .reverse()
    .join('-') // /pages/File.page
    .split('/')
    .filter(Boolean)
    .join('-') // pages-File-page
}

export function outputLambdas(inputs: string[], config: Config, shouldThrow = false) {
  const lambdas = inputs
    .map((input) => {
      try {
        const { route } = require(input)
        const name = slugify(input)
        const output = path.join(
          config.functionsOutputDir,
          config.env === Env.PRODUCTION
            ? name + '-' + hashContent(fs.readFileSync(input, 'utf8')) + '.js'
            : name + '.js'
        )

        logger.debug({
          label: 'debug',
          message: `generating ${name} lambda`,
        })

        // important for watch task
        delete require.cache[input]
        delete require.cache[output]

        fs.outputFileSync(
          output,
          `import { wrapHandler } from 'presta/dist/wrapHandler';
      import * as file from '${input}';
      export const route = file.route
      export const handler = wrapHandler(file)`
        )

        return {
          type: 'dynamic',
          src: input,
          dest: output,
          route,
        }
      } catch (e) {
        if (shouldThrow) throw e

        logger.error({
          label: 'error',
          error: e as Error,
        })
      }
    })
    .filter(Boolean) as ManifestDynamicFile[]

  const sortedRoutes = rsort(lambdas.map((l) => l.route))
  const sortedFiles: ManifestDynamicFile[] = []

  for (const route of sortedRoutes) {
    const match = lambdas.find((l) => l.route === route)

    if (match) {
      sortedFiles.push(match)
    }
  }

  return sortedFiles
}
