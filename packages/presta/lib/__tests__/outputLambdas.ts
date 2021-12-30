import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { create } from '../config'
import { outputLambdas } from '../outputLambdas'
import { Env } from '../constants'

const test = suite('presta - outputLambdas')

test('outputLambdas', async () => {
  const fixture = afix({
    slug: ['slug.js', `module.exports = { route: '/:slug' }`],
    fallback: ['fallback.js', `module.exports = { route: '/:slug?' }`],
  })

  const config = create(
    Env.DEVELOPMENT,
    {
      _: [path.join(fixture.root, '*.js')],
      output: path.join(fixture.root, 'output'),
    },
    {}
  )

  const [slug, fallback] = outputLambdas([fixture.files.slug.path, fixture.files.fallback.path], config)

  assert.equal(slug[0], `/:slug`)
  assert.ok(slug[1].includes(`slug.js`))

  assert.equal(fallback[0], `/:slug?`)
  assert.ok(fallback[1].includes(`fallback.js`))

  const manifest = require(config.functionsManifest)

  assert.equal(manifest[slug[0]], slug[1])
  assert.equal(manifest[fallback[0]], fallback[1])
})

test.run()
