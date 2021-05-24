const path = require('path')
const c = require('ansi-colors')

const { CONFIG_DEFAULT, OUTPUT_DYNAMIC_PAGES_ENTRY } = require('./constants')
const { debug } = require('./debug')
const { log } = require('./log')
const { createEmitter } = require('./createEmitter')

const cwd = process.cwd()

global.__presta__ = global.__presta__ || {
  cliArgs: {},
  configFile: {},
  pid: process.pid
}

function resolvePaths (obj) {
  if (obj.files) obj.files = [].concat(obj.files).map(p => path.resolve(cwd, p))
  if (obj.output) obj.output = path.resolve(cwd, obj.output)
  if (obj.assets) obj.assets = path.resolve(cwd, obj.assets)
  return obj
}

function getConfigFile (filepath) {
  /*
   * Since we want to let the user know right away if their config has issues,
   * just try to require it right away
   */
  try {
    return require(path.resolve(filepath || CONFIG_DEFAULT))
  } catch (e) {
    // if user specified a file, must be a syntax error
    if (!!filepath) {
      log(`${c.red('~ error')} ${filepath}\n\n  > ${e.stack || e}\n`)
    }

    return {}
  }
}

function createConfig ({
  env = global.__presta__.env,
  configFile = global.__presta__.configFile,
  cliArgs = global.__presta__.cliArgs
}) {
  configFile = resolvePaths({ ...configFile }) // clone read-only obj
  cliArgs = resolvePaths(cliArgs)

  const merged = {
    output: cliArgs.output || configFile.output || path.resolve('build'),
    assets: cliArgs.assets || configFile.assets || path.resolve('public'),
    files:
      cliArgs.files && cliArgs.files.length
        ? cliArgs.files
        : configFile.files
        ? [].concat(configFile.files)
        : []
  }

  global.__presta__ = {
    ...global.__presta__,
    env,
    cwd,
    configFile,
    cliArgs,
    merged,
    configFilepath: path.resolve(cliArgs.config || CONFIG_DEFAULT),
    dynamicEntryFilepath: path.join(merged.output, OUTPUT_DYNAMIC_PAGES_ENTRY),
    emitter: createEmitter()
  }

  debug('config created', global.__presta__)

  return global.__presta__
}

function removeConfigValues () {
  global.__presta__ = createConfig({
    ...global.__presta__,
    configFile: {}
  })

  return global.__presta__
}

/*
 * Extract serialize-able props to merge with user config within generated
 * files
 */
function serialize (config) {
  return JSON.stringify({
    cwd: config.cwd,
    files: config.merged.files,
    output: config.merged.output,
    assets: config.merged.assets
  })
}

function getCurrentConfig () {
  return global.__presta__
}

function clearCurrentConfig () {
  global.__presta__ = { cliArgs: {}, configFile: {} }
}

module.exports = {
  getCurrentConfig,
  clearCurrentConfig,
  resolvePaths,
  getConfigFile,
  createConfig,
  removeConfigValues,
  serialize
}
