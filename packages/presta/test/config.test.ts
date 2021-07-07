import path from 'path'

import * as fixtures from './fixtures'
import { createConfig, removeConfigValues, getConfigFile, _clearCurrentConfig, Env } from '../lib/config'

const env = Env.TEST

export default async function (test, assert) {
  test('config - defaults', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      env,
      cli: {
        files: 'app/*.js',
        output: 'dist',
      },
    })

    assert.equal(config.env, env)
    assert(!!config.configFilepath)

    assert(path.isAbsolute(config.files[0]))

    assert(path.isAbsolute(config.files[0]))
    assert(path.isAbsolute(config.output))
    assert(path.isAbsolute(config.assets))

    assert(config.output.includes('dist'))
  })

  test('config - no files', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      env,
      cli: {},
    })

    assert.deepEqual(config.files, [])
  })

  test('config - output', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      env,
      cli: {
        files: 'app/*.js',
        output: 'dist',
      },
    })

    assert(path.isAbsolute(config.output))
    assert(config.output.includes('dist'))
  })

  test('config - assets', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      env,
      cli: {
        files: 'app/*.js',
        assets: 'assets',
      },
    })

    assert(path.isAbsolute(config.assets))
    assert(config.assets.includes('assets'))
  })

  test('config - staticOutputDir', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      env,
      cli: {
        files: 'app/*.js',
        assets: 'assets',
      },
    })

    assert(path.isAbsolute(config.staticOutputDir))
  })

  test('config - picks up default file if present', async () => {
    _clearCurrentConfig()

    const file = 'file.js'
    const output = 'output'
    const fsx = fixtures.create({
      config: {
        url: 'presta.config.js',
        content: `export const files = '${file}'; export const output = '${output}'`,
      },
    })
    const configFile = getConfigFile(fsx.files.config)
    const config = createConfig({
      env,
      config: configFile,
      cli: {},
    })

    assert(config.files[0].includes(file))
    assert(config.output.includes(output))

    fsx.cleanup()
  })

  test('config - overriden by CLI args', async () => {
    _clearCurrentConfig()

    const fsx = fixtures.create({
      config: {
        url: 'presta.config.js',
        content: `export const files = 'file.js'; export const output = 'output'`,
      },
    })
    const configFile = getConfigFile(fsx.files.config)
    const config = createConfig({
      env,
      config: configFile,
      cli: {
        files: 'foo.js',
        output: 'out',
      },
    })

    assert(config.files[0].includes('foo.js'))
    assert(config.output.includes('out'))

    fsx.cleanup()
  })

  test('config - file is merged with internal config', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      config: {
        output: 'out',
      },
    })

    assert(config.output.includes('out'))
  })

  test('config - merging updates', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      config: {
        output: 'output',
      },
    })

    assert(config.output.includes('output'))

    const merged = createConfig({
      config: {
        output: 'output',
        assets: 'assets',
      },
    })

    assert(merged.assets.includes('assets'))
  })

  test('config - removeConfigValues', async () => {
    _clearCurrentConfig()

    const config = createConfig({
      config: {
        output: 'output',
      },
    })

    assert(config.output.includes('output'))

    const unmerged = removeConfigValues()

    assert(unmerged.output.includes('build'))
  })
}
