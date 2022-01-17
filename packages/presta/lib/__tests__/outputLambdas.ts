import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { create } from '../config'
import { Env } from '../constants'
import { hashContent } from '../utils'

import { outputLambdas, slugify } from '../outputLambdas'

const test = suite('presta - outputLambdas')

test('outputLambdas', async () => {
  const fixture = afix({
    slug: ['slug.js', `module.exports = { route: '/:slug' }`],
    fallback: ['fallback.js', `module.exports = { route: '/:slug?' }`],
    error: ['error.js', `module.exports = { route: '/:slug?'`],
  })

  const config = create(
    Env.DEVELOPMENT,
    {
      _: [path.join(fixture.root, '*.js')],
      output: path.join(fixture.root, 'output'),
    },
    {}
  )

  const [slug, fallback] = outputLambdas(
    [fixture.files.slug.path, fixture.files.fallback.path, fixture.files.error.path],
    config
  )

  assert.equal(slug[0], `/:slug`)
  assert.ok(slug[1].includes(`slug.js`))

  assert.equal(fallback[0], `/:slug?`)
  assert.ok(fallback[1].includes(`fallback.js`))

  const manifest = require(config.functionsManifest)

  assert.equal(manifest[slug[0]], slug[1])
  assert.equal(manifest[fallback[0]], fallback[1])
})

test('outputLambdas - hashed in prod', async () => {
  const fixture = afix({
    slug: ['slug.js', `module.exports = { route: '/:slug' }`],
  })

  const config = create(
    Env.PRODUCTION,
    {
      _: [path.join(fixture.root, '*.js')],
      output: path.join(fixture.root, 'output'),
    },
    {}
  )

  const [slug] = outputLambdas([fixture.files.slug.path], config)
  const hash = hashContent(fixture.files.slug.content)

  assert.equal(slug[0], `/:slug`)
  assert.ok(slug[1].includes(`slug-${hash}.js`))
  assert.ok(fs.existsSync(slug[1]))
})

test('slugify', async () => {
  const cwd = process.cwd()
  const fixture = afix({
    basic: ['file.js', ``],
    nested: ['pages/file.js', ``],
    complex: ['pages/file-something.page.js', ``],
  })

  process.chdir(fixture.root)

  assert.equal(slugify(fixture.files.basic.path), 'file')
  assert.equal(slugify(fixture.files.nested.path), 'pages-file')
  assert.equal(slugify(fixture.files.complex.path), 'pages-file-something-page')

  process.chdir(cwd)
})

test.run()
