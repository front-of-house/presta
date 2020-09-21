import { createConfigFromCLI } from '../lib/createConfigFromCLI'

const pages = 'app/**/*.js'
const output = 'output'
const c = 'presta.config.js'
const r = 'presta.runtime.js'

export default async function (test, assert) {
  test('createConfigFromCLI - requires input', async () => {
    try {
      createConfigFromCLI({})
      throw new Error('should not execute')
    } catch (e) {
      assert(e.message.includes('please provide'))
    }

    const config = createConfigFromCLI({ pages })
    assert(config.input.includes(pages))
  })

  test('createConfigFromCLI - output', async () => {
    const config = createConfigFromCLI({
      pages,
      output
    })
    assert(/\/output/.test(config.output))
  })

  test('createConfigFromCLI - no config', async () => {
    const config = createConfigFromCLI({
      pages: './pages/**/*.js'
    })
    assert(!config.configFilepath)
  })

  test('createConfigFromCLI - config', async () => {
    const config = createConfigFromCLI({
      pages: './pages/**/*.js',
      config: c
    })
    assert(!!config.configFilepath)
  })

  test('createConfigFromCLI - runtime', async () => {
    const config = createConfigFromCLI({
      pages: './pages/**/*.js',
      runtime: r
    })
    assert(!!config.runtimeFilepath)
  })

  test('createConfigFromCLI - config file', async () => {
    const config = createConfigFromCLI({
      config: c
    })
    assert(!!config.input)
    assert(!!config.output)
  })
}
