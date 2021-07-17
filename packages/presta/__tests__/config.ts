import tap from 'tap'
import path from 'path'

import { createConfig, removeConfigValues, getConfigFile, _clearCurrentConfig, Env } from '../lib/config'

tap.test('config - defaults', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    cli: {
      files: 'app/*.js',
      output: 'dist',
    },
  })

  t.equal(config.env, Env.PRODUCTION)
  t.ok(!!config.configFilepath)

  t.ok(path.isAbsolute(config.files[0]))

  t.ok(path.isAbsolute(config.files[0]))
  t.ok(path.isAbsolute(config.output))
  t.ok(path.isAbsolute(config.assets))

  t.ok(config.output.includes('dist'))
})

tap.test('config - no files', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    cli: {},
  })

  t.same(config.files, [])
})

tap.test('config - output', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    cli: {
      files: 'app/*.js',
      output: 'dist',
    },
  })

  t.ok(path.isAbsolute(config.output))
  t.ok(config.output.includes('dist'))
})

tap.test('config - assets', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    cli: {
      files: 'app/*.js',
      assets: 'assets',
    },
  })

  t.ok(path.isAbsolute(config.assets))
  t.ok(config.assets.includes('assets'))
})

tap.test('config - staticOutputDir', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    cli: {
      files: 'app/*.js',
      assets: 'assets',
    },
  })

  t.ok(path.isAbsolute(config.staticOutputDir))
})

tap.test('config - picks up default file if present', async (t) => {
  _clearCurrentConfig()

  const file = 'file.js'
  const output = 'output'

  t.testdir({
    'presta.config.js': `const files = '${file}'; const output = '${output}'; module.exports = { files, output }`,
  })

  const configFilepath = path.join(t.testdirName, './presta.config.js')
  const configFile = getConfigFile(configFilepath)
  const config = createConfig({
    config: configFile,
    cli: {},
  })

  t.ok(config.files[0].includes(file))
  t.ok(config.output.includes(output))
})

tap.test('config - overriden by CLI args', async (t) => {
  _clearCurrentConfig()

  t.testdir({
    'presta.config.js': `const files = 'file.js'; const output = 'output'; module.exports = { files, output }`,
  })

  const configFilepath = path.join(t.testdirName, './presta.config.js')
  const configFile = getConfigFile(configFilepath)
  const config = createConfig({
    config: configFile,
    cli: {
      files: 'foo.js',
      output: 'out',
    },
  })

  t.ok(config.files[0].includes('foo.js'))
  t.ok(config.output.includes('out'))
})

tap.test('config - file is merged with internal config', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    config: {
      output: 'out',
    },
  })

  t.ok(config.output.includes('out'))
})

tap.test('config - merging updates', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    config: {
      output: 'output',
    },
  })

  t.ok(config.output.includes('output'))

  const merged = createConfig({
    config: {
      output: 'output',
      assets: 'assets',
    },
  })

  t.ok(merged.assets.includes('assets'))
})

tap.test('config - removeConfigValues', async (t) => {
  _clearCurrentConfig()

  const config = createConfig({
    config: {
      output: 'output',
    },
  })

  t.ok(config.output.includes('output'))

  const unmerged = removeConfigValues()

  t.ok(unmerged.output.includes('build'))
})
