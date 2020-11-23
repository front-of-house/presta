import path from 'path'

import * as fixtures from './fixtures'
import { create } from '../lib/config'

const pages = 'app/**/*.js'
const output = 'output'
const assets = 'assets'
const c = 'presta.config.js'

export default async function (test, assert) {
  test('config - requires pages', async () => {
    try {
      create({})
      throw new Error('should not execute')
    } catch (e) {
      assert(true)
    }
  })

  test('config - defaults', async () => {
    const config = create({
      pages
    })

    assert(config.pages.includes(pages))
    assert(path.isAbsolute(config.output))
    assert(config.cwd === fixtures.getRoot())
  })

  test('config - output', async () => {
    const config = create({
      pages,
      output
    })

    assert(/\/output/.test(config.output))
    assert(path.isAbsolute(config.output))
  })

  test('config - assets', async () => {
    const config = create({
      pages,
      output,
      assets
    })

    assert(/\/assets/.test(config.assets))
    assert(path.isAbsolute(config.assets))
  })

  test('config - picks up default file if present', async () => {
    const pages = './pages/*.js'
    const output = 'output'
    const files = {
      config: {
        url: 'presta.config.js',
        content: `export const pages = '${pages}'; export const output = '${output}'`
      }
    }
    const fsx = fixtures.create(files)

    const config = create({})

    assert(/presta\.config/.test(config.configFilepath))
    assert(path.isAbsolute(config.configFilepath))
    assert(config.pages.includes(pages))
    assert(config.output.includes(output))

    fsx.cleanup()
  })

  test('config - picks up custom file if present', async () => {
    const pages = './pages/*.js'
    const output = 'output'
    const files = {
      config: {
        url: 'presta-config.js',
        content: `export const pages = '${pages}'; export const output = '${output}'`
      }
    }
    const fsx = fixtures.create(files)

    const config = create({
      config: files.config.url
    })

    assert(/presta-config/.test(config.configFilepath))
    assert(path.isAbsolute(config.configFilepath))
    assert(config.pages.includes(pages))
    assert(config.output.includes(output))

    fsx.cleanup()
  })

  test('config - overriden by CLI args', async () => {
    const files = {
      config: {
        url: 'presta.config.js',
        content: `export const pages = './pages/*.js'; export const output = './output'`
      }
    }
    const fsx = fixtures.create(files)

    const config = create({
      pages: 'foo',
      output: 'dist'
    })

    assert(config.pages.includes('foo'))
    assert(config.output.includes('dist'))

    fsx.cleanup()
  })
}
