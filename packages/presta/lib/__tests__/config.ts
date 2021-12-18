import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { createConfig, removeConfigValues, getConfigFile, _clearCurrentConfig } from '../config'
import { Env } from '../constants'

const test = suite('presta - config')

test('config - defaults', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    cli: {
      files: 'app/*.js',
      output: 'dist',
    },
  })

  assert.equal(config.env, Env.PRODUCTION)
  assert.ok(!!config.configFilepath)

  assert.ok(path.isAbsolute(config.files[0]))

  assert.ok(path.isAbsolute(config.files[0]))
  assert.ok(path.isAbsolute(config.output))
  assert.ok(path.isAbsolute(config.assets))

  assert.ok(config.output.includes('dist'))
})

test('config - no files', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    cli: {},
  })

  assert.equal(config.files, [])
})

test('config - output', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    cli: {
      files: 'app/*.js',
      output: 'dist',
    },
  })

  assert.ok(path.isAbsolute(config.output))
  assert.ok(config.output.includes('dist'))
})

test('config - assets', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    cli: {
      files: 'app/*.js',
      assets: 'assets',
    },
  })

  assert.ok(path.isAbsolute(config.assets))
  assert.ok(config.assets.includes('assets'))
})

test('config - staticOutputDir', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    cli: {
      files: 'app/*.js',
      assets: 'assets',
    },
  })

  assert.ok(path.isAbsolute(config.staticOutputDir))
})

test('config - getConfigFile no config, no log or exit', async () => {
  const { getConfigFile } = require('proxyquire')('../config', {
    './log': {
      error() {
        throw new Error('fail')
      },
    },
  })

  const configFile = getConfigFile()

  assert.equal(configFile, {})
})

test('config - getConfigFile exists', async () => {
  const fixture = afix({
    config: ['presta.config.js', `export const files = 'path/to/*.js'`],
  })

  const configFile = getConfigFile(fixture.files.config.path)

  assert.ok(configFile.files)
})

test('config - getConfigFile throws, syntax error', async () => {
  let called = false

  const { getConfigFile } = require('proxyquire')('../config', {
    './log': {
      error() {
        called = true
      },
    },
  })

  const fixture = afix({
    config: ['presta.config.js', `export const files = 'path/to/*.js`], // syntax error
  })

  const configFile = getConfigFile(fixture.files.config.path)

  assert.equal(configFile, {})
  assert.ok(called)
})

test('config - getConfigFile throws and exits', async () => {
  const fixture = afix({
    config: ['presta.config.js', `export const files = 'path/to/*.js`], // syntax error
  })

  const exit = process.exit
  let plan = 0

  // @ts-ignore
  process.exit = (code: int) => {
    assert.equal(code, 1)
    plan++
  }

  getConfigFile(fixture.files.config.path, true)

  // @ts-ignore
  process.exit = exit

  assert.equal(plan, 1)
})

test('config - getConfigFile throws and does not exit with no file', async () => {
  const configFile = getConfigFile(undefined, true)
  assert.equal(configFile, {})
})

test('config - picks up default file if present', async () => {
  _clearCurrentConfig()

  const file = 'file.js'
  const output = 'output'

  const fixture = afix({
    config: [
      'presta.config.js',
      `const files = '${file}'; const output = '${output}'; module.exports = { files, output }`,
    ],
  })

  const configFile = getConfigFile(fixture.files.config.path)
  const config = await createConfig({
    config: configFile,
    cli: {},
  })

  assert.ok(config.files[0].includes(file))
  assert.ok(config.output.includes(output))
})

test('config - overriden by CLI args', async () => {
  _clearCurrentConfig()

  const fixture = afix({
    config: [
      'presta.config.js',
      `const files = 'file.js'; const output = 'output'; module.exports = { files, output }`,
    ],
  })

  const configFile = getConfigFile(fixture.files.config.path)
  const config = await createConfig({
    config: configFile,
    cli: {
      files: 'foo.js',
      output: 'out',
    },
  })

  assert.ok(config.files[0].includes('foo.js'))
  assert.ok(config.output.includes('out'))
})

test('config - file is merged with internal config', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    config: {
      output: 'out',
    },
  })

  assert.ok(config.output.includes('out'))
})

test('config - merging updates', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    config: {
      output: 'output',
    },
  })

  assert.ok(config.output.includes('output'))

  const merged = await createConfig({
    config: {
      output: 'output',
      assets: 'assets',
    },
  })

  assert.ok(merged.assets.includes('assets'))
})

test('config - removeConfigValues', async () => {
  _clearCurrentConfig()

  const config = await createConfig({
    config: {
      output: 'output',
    },
  })

  assert.ok(config.output.includes('output'))

  const unmerged = await removeConfigValues()

  assert.ok(unmerged.output.includes('build'))
})

test('config - hooks', async () => {
  _clearCurrentConfig()

  const config = await createConfig({})
  let plan = 0

  config.hooks.onPostBuild(() => {
    plan++
  })

  // @ts-expect-error
  config.hooks.emitPostBuild()

  assert.equal(plan, 1)
})

test('config - plugins', async () => {
  _clearCurrentConfig()

  let plan = 0

  await createConfig({
    config: {
      plugins: [
        () => {
          plan++
        },
      ],
    },
  })

  assert.equal(plan, 1)
})

test('config - plugin error', async () => {
  _clearCurrentConfig()

  let called = false

  const { createConfig } = require('proxyquire')('../config', {
    './log': {
      error() {
        called = true
      },
    },
  })

  await createConfig({
    config: {
      plugins: [
        () => {
          throw Error()
        },
      ],
    },
  })

  assert.ok(called)
})

test.run()
