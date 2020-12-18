import path from 'path'

import * as fixtures from './fixtures'
import { create, unmerge } from '../lib/config'

const pages = 'app/**/*.js'
const output = 'output'
const assets = 'assets'
const c = 'presta.config.js'

export default async function (test, assert) {
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

    // should merge pages
    assert(config.pages.includes('./pages/*.js'))

    fsx.cleanup()
  })

  test('config - file is merged with internal config', async () => {
    const files = {
      config: {
        url: 'presta.merged.config.js',
        content: `export function createContent(context) {}`
      }
    }
    const fsx = fixtures.create(files)

    const config = create({
      pages: 'foo',
      output: 'dist',
      config: 'presta.merged.config.js'
    })

    assert(!!config.createContent)

    fsx.cleanup()
  })

  test('config - unmerge', async () => {
    const files = {
      config: {
        url: 'presta.unmerged.config.js',
        content: `
          export const pages = 'foo'
          export const output = 'output'
          export function createContent(context) {}
        `
      }
    }
    const fsx = fixtures.create(files)

    const curr = create({
      pages: 'bar',
      config: 'presta.unmerged.config.js'
    })
    const prev = require(fsx.files.config)

    assert(curr.pages.length === 2)
    assert(curr.output.includes('output'))

    const unmerged = unmerge(curr, prev)

    assert(unmerged.pages.length === 1)
    assert(unmerged.output.includes('build'))

    fsx.cleanup()
  })
}
