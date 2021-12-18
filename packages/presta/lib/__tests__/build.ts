import fs from 'fs-extra'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
// @ts-ignore
import proxy from 'proxyquire'

import { createConfig } from '../config'
import { build } from '../build'

const test = suite('presta - build')

test('build - static files', async () => {
  const fixture = afix({
    static: [
      'static.js',
      `
      export const getStaticPaths = () => ([ 'foo' ])
      export const handler = () => 'page'
    `,
    ],
  })

  const filepath = fixture.files.static.path
  const config = await createConfig({
    cli: { files: filepath, output: fixture.root },
  })

  await build(config)

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

  const config = await createConfig({
    cli: {
      files: fixture.files.dynamic.path,
      output: fixture.root,
    },
  })

  let called = false

  const { build } = proxy('../build', {
    esbuild: {
      build() {
        called = true
      },
    },
  })

  await build(config)

  assert.ok(called)

  fixture.cleanup()
})

test.run()
