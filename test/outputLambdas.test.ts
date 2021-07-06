import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { createConfig } from '../lib/config'
import { outputLambda } from '../lib/outputLambdas'

export default (test, assert) => {
  test('lambda', () => {
    const content = 'export const route = "*"'
    const fsx = fixtures.create({
      a: {
        url: './outputLambda/lambda.min.js',
        content,
      }
    })
    const config = createConfig({
      cli: {
        files: './outputLambda/*.js',
        output: path.join(fixtures.getRoot(), 'output')
      }
    })

    const [route, filename] = outputLambda(fsx.files.a, config)
    const lambda = fs.readFileSync(filename, 'utf8')

    assert(filename.includes(`lambda.min.js`))
    assert(lambda.includes(fsx.files.a))
    assert.equal(route, '*')

    fsx.cleanup()
    fs.removeSync(filename)
  })
}
