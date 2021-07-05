import fs from 'fs-extra'
import path from 'path'
import rsort from 'route-sort'

import { Env } from './config'
import { hashContent } from './hashContent'

import type { Presta } from '../'

export function outputLambda(input: string, config: Presta): [string, string] {
  const { route } = require(input)
  const name = path.basename(input).split('.').reverse().slice(1).reverse().join('.')
  const output = path.join(
    config.dynamicOutputDir,
    config.env === Env.PRODUCTION ? (
      name + '-' + hashContent(fs.readFileSync(input, 'utf8')) + '.js'
    ) : (
      name + '.js'
    )
  )

  fs.outputFileSync(output, `import { wrapHandler } from 'presta/utils';
import * as file from '${input}';
export const route = file.route
export const handler = wrapHandler(file)`)

  return [
    route,
    output,
  ]
}

export function outputLambdas (inputs: string[], config: Presta) {
  const lambdas = inputs.map(input => outputLambda(input, config))
  const sorted = rsort(lambdas.map(l => l[0]))
  const manifest = {}

  for (const route of sorted) {
    manifest[route] = lambdas.find(l => l[0] === route)[1]
  }

  fs.outputFileSync(config.routesManifest, JSON.stringify(manifest))

  return lambdas
}
