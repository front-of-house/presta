const path = require('path')

const fixtures = require('./fixtures')
const {
  createConfig,
  removeConfigValues,
  getConfigFile,
  clearCurrentConfig
} = require('../lib/config')

const env = 'test'

module.exports = async function (test, assert) {
  test('config - defaults', async () => {
    clearCurrentConfig()

    const config = createConfig({
      env,
      cliArgs: {
        files: 'app/*.js',
        output: 'dist'
      }
    })

    assert.equal(config.env, env)
    assert(!!config.configFilepath)
    assert(!!config.dynamicEntryFilepath)

    assert.deepEqual(config.configFile, {})

    assert(path.isAbsolute(config.cliArgs.files[0]))

    assert(path.isAbsolute(config.merged.files[0]))
    assert(path.isAbsolute(config.merged.output))
    assert(path.isAbsolute(config.merged.assets))

    assert(config.merged.output.includes('dist'))
    assert(config.dynamicEntryFilepath.includes('dist'))
  })

  test('config - no files', async () => {
    clearCurrentConfig()

    const config = createConfig({
      env,
      cliArgs: {}
    })

    assert.deepEqual(config.merged.files, [])
  })

  test('config - output', async () => {
    clearCurrentConfig()

    const config = createConfig({
      env,
      cliArgs: {
        files: 'app/*.js',
        output: 'dist'
      }
    })

    assert(path.isAbsolute(config.merged.output))
    assert(config.merged.output.includes('dist'))
  })

  test('config - assets', async () => {
    clearCurrentConfig()

    const config = createConfig({
      env,
      cliArgs: {
        files: 'app/*.js',
        assets: 'assets'
      }
    })

    assert(path.isAbsolute(config.merged.assets))
    assert(config.merged.assets.includes('assets'))
  })

  test('config - picks up default file if present', async () => {
    clearCurrentConfig()

    const file = 'file.js'
    const output = 'output'
    const fsx = fixtures.create({
      config: {
        url: 'presta.config.js',
        content: `export const files = '${file}'; export const output = '${output}'`
      }
    })
    const configFile = getConfigFile(fsx.files.config)
    const config = createConfig({
      env,
      configFile,
      cliArgs: {}
    })

    assert(config.merged.files[0].includes(file))
    assert(config.merged.output.includes(output))

    fsx.cleanup()
  })

  test('config - overriden by CLI args', async () => {
    clearCurrentConfig()

    const fsx = fixtures.create({
      config: {
        url: 'presta.config.js',
        content: `export const files = 'file.js'; export const output = 'output'`
      }
    })
    const configFile = getConfigFile(fsx.files.config)
    const config = createConfig({
      env,
      configFile,
      cliArgs: {
        files: 'foo.js',
        output: 'out'
      }
    })

    assert(config.merged.files[0].includes('foo.js'))
    assert(config.merged.output.includes('out'))

    fsx.cleanup()
  })

  test('config - file is merged with internal config', async () => {
    clearCurrentConfig()

    const config = createConfig({
      configFile: {
        output: 'out'
      }
    })

    assert(config.merged.output.includes('out'))
    assert(config.dynamicEntryFilepath.includes('out'))
  })

  test('config - merging updates', async () => {
    clearCurrentConfig()

    const config = createConfig({
      configFile: {
        output: 'output'
      }
    })

    assert(config.merged.output.includes('output'))

    const merged = createConfig({
      configFile: {
        output: 'output',
        assets: 'assets'
      }
    })

    assert(merged.merged.assets.includes('assets'))
  })

  test('config - removeConfigValues', async () => {
    clearCurrentConfig()

    const config = createConfig({
      configFile: {
        output: 'output'
      }
    })

    assert(config.merged.output.includes('output'))

    const unmerged = removeConfigValues()

    assert(unmerged.merged.output.includes('build'))
  })
}
