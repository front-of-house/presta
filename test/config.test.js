import path from 'path'

import { create, get } from '../lib/config'

const pages = 'app/**/*.js'
const output = 'output'
const c = 'presta.config.js'

export default async function (test, assert) {
  test('createConfigFromCLI - requires pages', async () => {
    try {
      create({})
      throw new Error('should not execute')
    } catch (e) {
      assert(e.message.includes('please provide'))
    }
  })

  test('createConfigFromCLI - defaults', async () => {
    const config = create({
      pages
    })

    assert(config.pages.includes(pages))
    assert(path.isAbsolute(config.output))
    assert(config.configFilepath === null)
  })

  test('createConfigFromCLI - output', async () => {
    const config = create({
      pages,
      output
    })
    assert(/\/output/.test(config.output))
    assert(path.isAbsolute(config.output))
  })

  test('createConfigFromCLI - config', async () => {
    const config = create({
      pages: './pages/**/*.js',
      config: c
    })

    assert(!!config.configFilepath)
    assert(path.isAbsolute(config.configFilepath))
  })

  test('createConfigFromCLI - config file', async () => {
    const config = create({
      config: c
    })

    assert(!!config.pages)
    assert(!!config.output)
    assert(/dist/.test(config.output)) // from fixtures
    assert(path.isAbsolute(config.output))
  })

  test('config - get', () => {
    create({
      pages: './pages/**/*.js'
    })
    const config = get()

    assert(config.pages.includes('./pages/**/*.js'))
  })
}