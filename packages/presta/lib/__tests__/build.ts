import fs from 'fs-extra'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
// @ts-ignore
import proxy from 'proxyquire'

import { create } from '../config'
import { build } from '../build'
import { Env } from '../constants'
import { createEmitter, createHooks } from '../createEmitter'

const test = suite('presta - build')

test('build - static files', async () => {
  const fixture = afix({
    static: [
      'static.js',
      `export const getStaticPaths = () => ([ 'foo' ])
      export const handler = () => 'page'`,
    ],
  })

  const config = create(
    Env.PRODUCTION,
    {
      _: [fixture.files.static.path],
      port: 4000,
      output: fixture.root,
    },
    {}
  )

  await build(config, createHooks(createEmitter()))

  const contents = fs.readFileSync(path.join(config.staticOutputDir, 'foo/index.html'), 'utf8')

  assert.equal(contents, 'page')

  fixture.cleanup()
})

test('build - dynamic files', async () => {
  const fixture = afix({
    dynamic: [
      'dynamic.js',
      `
      export const route = '*'
      export const handler = () => 'page'
    `,
    ],
  })

  const config = create(
    Env.DEVELOPMENT,
    {
      _: [fixture.files.dynamic.path],
      output: fixture.root,
      port: 4000,
    },
    {}
  )

  let called = false

  const { build } = proxy('../build', {
    esbuild: {
      build() {
        called = true
      },
    },
  })

  await build(config, createHooks(createEmitter()))

  assert.ok(called)

  fixture.cleanup()
})

test.run()
