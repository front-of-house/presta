import fs from 'fs-extra'
import path from 'path'
import rsort from 'route-sort'

import { hashContent } from './hashContent'
import * as logger from './log'
import { Presta } from './types'
import { Env } from './constants'

export function outputLambda(input: string, config: Presta): [string, string] {
  const { route } = require(input)
  const name = path.basename(input).split('.').reverse().slice(1).reverse().join('.')
  const output = path.join(
    config.functionsOutputDir,
    config.env === Env.PRODUCTION ? name + '-' + hashContent(fs.readFileSync(input, 'utf8')) + '.js' : name + '.js'
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
    `import { wrapHandler } from 'presta';
import * as file from '${input}';
export const route = file.route
export const handler = wrapHandler(file)`
  )

  return [route, output]
}

export function outputLambdas(inputs: string[], config: Presta) {
  const lambdas = inputs
    .map((input) => {
      try {
        return outputLambda(input, config)
      } catch (e) {
        logger.error({
          label: 'error',
          error: e as Error,
        })
        return null
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
