const path = require('path')
const c = require('ansi-colors')

const { CONFIG_DEFAULT, OUTPUT_DYNAMIC_PAGES_ENTRY } = require('./constants')
const { debug } = require('./debug')
const { log } = require('./log')
const { createEmitter } = require('./createEmitter')

const cwd = process.cwd()
const pid = process.pid
const manager = { [pid]: { cliArgs: {}, configFile: {} } }

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
  env = manager[pid].env,
  configFile = manager[pid].configFile,
  cliArgs = manager[pid].cliArgs
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

  manager[pid] = {
    env,
    cwd,
    configFile,
    cliArgs,
    merged,
    configFilepath: path.resolve(cliArgs.config || CONFIG_DEFAULT),
    dynamicEntryFilepath: path.join(merged.output, OUTPUT_DYNAMIC_PAGES_ENTRY),
    emitter: createEmitter()
  }

  return manager[pid]
}

function removeConfigValues () {
  manager[pid] = createConfig({
    ...manager[pid],
    configFile: {}
  })

  return manager[pid]
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
  return manager[pid]
}

function clearCurrentConfig () {
  manager[pid] = { cliArgs: {}, configFile: {} }
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
