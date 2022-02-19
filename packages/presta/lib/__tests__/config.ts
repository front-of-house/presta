import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { Config, getConfigFile, create } from '../config'
import { Env } from '../constants'

const test = suite('presta - config')

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

test('create', async () => {
  const cli = {
    _: ['pages/*.js'],
    output: 'dist',
    assets: 'assets',
  }
  const file = {
    assets: 'static',
    files: ['test/*.js'],
    port: 4000,
  }

  const config = create(Env.PRODUCTION, cli, file)

  const output = path.join(process.cwd(), 'dist')
  const generated: Config = {
    env: Env.PRODUCTION,
    port: 4000,
    files: [path.join(process.cwd(), 'pages/*.js')],
    output,
    assets: path.join(process.cwd(), 'assets'),
    plugins: [],
    staticOutputDir: path.join(output, 'static'),
    functionsOutputDir: path.join(output, 'functions'),
    manifestFilepath: path.join(output, 'manifest.json'),
  }

  assert.equal(config, generated)
})

test.run()
