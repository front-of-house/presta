import fs from 'fs-extra'
import path from 'path'
import rsort from 'route-sort'

import { hashContent } from './utils'
import * as logger from './log'
import { Config } from './config'
import { Env } from './constants'

function slugify(filename: string) {
  return filename
    .replace(process.cwd(), '') // /pages/File.page.js
    .split('.') // [/pages/File, page, js]
    .reverse()
    .slice(1)
    .reverse()
    .join('-') // /pages/File.page
    .split('/')
    .filter(Boolean)
    .join('-') // pages-File-page
}

export function outputLambdas(inputs: string[], config: Config) {
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

        return [route, output]
      } catch (e) {
        logger.error({
          label: 'error',
          error: e as Error,
        })
      }
    })
    .filter(Boolean) as [string, string][]

  const sorted = rsort(lambdas.map((l) => l[0]))
  const manifest: { [route: string]: string } = {}

  for (const route of sorted) {
    const match = lambdas.find((l) => l[0] === route)

    if (match) {
      manifest[route] = match[1]
    }
  }

  fs.outputFileSync(config.functionsManifest, JSON.stringify(manifest))

  return lambdas
}
