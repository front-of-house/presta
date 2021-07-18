import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'

import { createConfig } from '../lib/config'
import { outputLambda, outputLambdas } from '../lib/outputLambdas'
import { Env } from '../lib/types'

tap.test('outputLambda', async (t) => {
  const content = `module.exports = { route: '*' }`

  t.testdir({
    'lambda.min.js': content,
  })
  const fixture = path.join(t.testdirName, 'lambda.min.js')

  const config = createConfig({
    env: Env.DEVELOPMENT,
    cli: {
      files: path.join(t.testdirName, '*.js'),
      output: path.join(t.testdirName, 'output'),
    },
  })

  const [route, filename] = outputLambda(fixture, config)
  const lambda = fs.readFileSync(filename, 'utf8')

  t.ok(filename.includes(`lambda.min.js`))
  t.ok(lambda.includes(fixture))
  t.equal(route, '*')
})

tap.test('outputLambdas', async (t) => {
  t.testdir({
    'slug.js': `module.exports = { route: '/:slug' }`,
    'fallback.js': `module.exports = { route: '/:slug?' }`,
  })

  const config = createConfig({
    env: Env.DEVELOPMENT,
    cli: {
      files: path.join(t.testdirName, '*.js'),
      output: path.join(t.testdirName, 'output'),
    },
  })

  const [slug, fallback] = outputLambdas(
    [path.join(t.testdirName, 'slug.js'), path.join(t.testdirName, 'fallback.js')],
    config
  )

  t.equal(slug[0], `/:slug`)
  t.ok(slug[1].includes(`slug.js`))

  t.equal(fallback[0], `/:slug?`)
  t.ok(fallback[1].includes(`fallback.js`))

  const manifest = require(config.functionsManifest)

  t.equal(manifest[slug[0]], slug[1])
  t.equal(manifest[fallback[0]], fallback[1])
})
