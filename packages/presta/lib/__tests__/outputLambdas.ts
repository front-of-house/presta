import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { createConfig } from '../config'
import { outputLambda, outputLambdas } from '../outputLambdas'
import { Env } from '../constants'

const test = suite('presta - outputLambdas')

test('outputLambda', async () => {
  const fixture = afix({
    lambda: ['lambda.min.js', `module.exports = { route: '*' }`],
  })

  const config = await createConfig({
    env: Env.DEVELOPMENT,
    cli: {
      files: path.join(fixture.root, '*.js'),
      output: path.join(fixture.root, 'output'),
    },
  })

  const [route, filename] = outputLambda(fixture.files.lambda.path, config)
  const lambda = fs.readFileSync(filename, 'utf8')

  assert.ok(filename.includes(`lambda.min.js`))
  assert.ok(lambda.includes(fixture.files.lambda.path))
  assert.equal(route, '*')
})

test('outputLambdas', async () => {
  const fixture = afix({
    slug: ['slug.js', `module.exports = { route: '/:slug' }`],
    fallback: ['fallback.js', `module.exports = { route: '/:slug?' }`],
  })

  const config = await createConfig({
    env: Env.DEVELOPMENT,
    cli: {
      files: path.join(fixture.root, '*.js'),
      output: path.join(fixture.root, 'output'),
    },
  })

  const [slug, fallback] = outputLambdas([fixture.files.slug.path, path.join(fixture.root, 'fallback.js')], config)

  assert.equal(slug[0], `/:slug`)
  assert.ok(slug[1].includes(`slug.js`))

  assert.equal(fallback[0], `/:slug?`)
  assert.ok(fallback[1].includes(`fallback.js`))

  const manifest = require(config.functionsManifest)

  assert.equal(manifest[slug[0]], slug[1])
  assert.equal(manifest[fallback[0]], fallback[1])
})

test.run()
