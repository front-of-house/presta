import fs from 'fs-extra'
import path from 'path'

import fixtures from './fixtures'

import { createConfig, Env } from '../lib/config'
import { build } from '../lib/build'

const outDir = path.join(fixtures.getRoot(), 'build/dist')

export default async (test, assert) => {
  test.only('build - static files', async () => {
    const fsx = fixtures.create({
      a: {
        url: './build/a.js',
        content: `
          export const getStaticPaths = () => ([ 'url' ])
          export const handler = () => 'page'
        `
      }
    })
    const config = createConfig({
      cliArgs: {
        files: fsx.files.a,
        output: path.join(fixtures.getRoot(), 'build/static-files')
      }
    })

    await build(config)

    const contents = fs.readFileSync(
      path.join(config.staticOutputDir, 'url/index.html'),
      'utf8'
    )

    assert(contents === 'page')
  })

  test.only('build - dynamic files', async () => {
    const fsx = fixtures.create({
      dynamic: {
        url: './build/dynamic.js',
        content: `
          export const route = '*'
          export const handler = () => 'page'
        `
      }
    })
    const config = createConfig({
      env: Env.TEST,
      cliArgs: {
        files: fsx.files.dynamic,
        output: path.join(fixtures.getRoot(), 'build/dynamic-files')
      }
    })

    let called = false

    const { build } = require('proxyquire')('../lib/build', {
      './compile': {
        compile () {
          called = true
        }
      }
    })

    await build(config)

    assert(called)
  })
}
