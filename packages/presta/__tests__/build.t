import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'

import { createConfig, Env } from '../lib/config'
import { build } from '../lib/build'

tap.test('build - static files', async t => {
  t.testdir({
    'Static.js': `
      const getStaticPaths = () => ([ 'foo' ])
      const handler = () => 'page'
      module.exports = { getStaticPaths, handler }
    `
  })

  const filepath = path.join(t.testdirName, 'Static.js')
  const config = createConfig({
    cwd: t.testdirName,
    env: Env.TEST,
    cli: { files: filepath },
  })

  await build(config)

  const contents = fs.readFileSync(path.join(config.staticOutputDir, 'foo/index.html'), 'utf8')

  t.ok(contents === 'page')
})

/*
test('build - dynamic files', async () => {
  const fsx = fixtures.create({
    dynamic: {
      url: './build/dynamic.js',
      content: `
        export const route = '*'
        export const handler = () => 'page'
      `,
    },
  })
  const config = createConfig({
    env: Env.TEST,
    cli: {
      files: fsx.files.dynamic,
      output: path.join(fixtures.getRoot(), 'build/dynamic-files'),
    },
  })

  let called = false

  const { build } = require('proxyquire')('../lib/build', {
    esbuild: {
      build() {
        called = true
      },
    },
  })

  await build(config)

  assert(called)
})
*/
