import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { createConfig, Env } from '../lib/config'
import { outputLambda } from '../lib/outputLambdas'
import { hashContent } from '../lib/hashContent'

export default (test, assert) => {
  test('lambda', () => {
    const content = 'export const route = "*"'
    const hash = hashContent(content)
    const fsx = fixtures.create({
      a: {
        url: './outputLambda/lambda.min.js',
        content,
      }
    })
    const config = createConfig({
      env: Env.PRODUCTION,
      cli: {
        files: './outputLambda/*.js',
        output: path.join(fixtures.getRoot(), 'output')
      }
    })

    const [route, filename] = outputLambda(fsx.files.a, config)
    const lambda = fs.readFileSync(filename, 'utf8')

    assert(filename.includes(`lambda.min-${hash}.js`))
    assert(lambda.includes(fsx.files.a))
    assert.equal(route, '*')

    fsx.cleanup()
    fs.removeSync(filename)
  })
}
