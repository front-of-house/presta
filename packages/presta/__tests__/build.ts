import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'

import { createConfig, Env } from '../lib/config'
import { build } from '../lib/build'

tap.test('build - static files', async (t) => {
  t.testdir({
    'static.js': `
      export const getStaticPaths = () => ([ 'foo' ])
      export const handler = () => 'page'
    `,
  })

  const filepath = path.join(t.testdirName, 'static.js')
  const config = createConfig({
    cli: { files: filepath, output: t.testdirName },
  })

  await build(config)

  const contents = fs.readFileSync(path.join(config.staticOutputDir, 'foo/index.html'), 'utf8')

  t.equal(contents, 'page')
})

tap.test('build - dynamic files', async (t) => {
  t.testdir({
    'dynamic.js': `
      export const route = '*'
      export const handler = () => 'page'
    `,
  })

  const config = createConfig({
    cli: {
      files: path.join(t.testdirName, 'dynamic.js'),
      output: t.testdirName,
    },
  })

  let called = false

  const { build } = t.mock('../lib/build', {
    esbuild: {
      build() {
        called = true
      },
    },
  })

  await build(config)

  t.ok(called)
})
