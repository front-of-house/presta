const path = require('path')
const c = require('ansi-colors')

const { CONFIG_DEFAULT, OUTPUT_DYNAMIC_PAGES_ENTRY } = require('./constants')
const { debug } = require('./debug')
const { log } = require('./log')

const cwd = process.cwd()

function makeConfigPathsAbsolute (config, cwd) {
  if (config.files)
    config.files = [].concat(config.files).map(p => path.resolve(cwd, p))
  if (config.output) config.output = path.resolve(cwd, config.output)
  if (config.assets) config.assets = path.resolve(cwd, config.assets)

  return config
}

/*
 * Don't write to these internal properties:
 *    cliArgs - the raw CLI args
 *    configFile - the full config file, if present
 */
function create (cliArgs) {
  // leave this here in case we want it to be user-configurable
  require('module-alias').addAliases({ '@': cwd })

  let configFile = {}
  let configFilepath = path.resolve(cwd, cliArgs.config || CONFIG_DEFAULT)

  /*
   * Since we want to let the user know right away if their config has issues,
   * just try to require it right away
   */
  try {
    configFile = require(configFilepath)
  } catch (e) {
    // if user specified a file, must be a syntax error
    if (cliArgs.config) {
      log(`${c.red('~ error')} ${configFilepath}\n\n  > ${e.stack || e}\n`)
    }

    configFile = {}
    configFilepath = undefined
  }

  cliArgs = makeConfigPathsAbsolute(cliArgs, cwd)
  configFile = makeConfigPathsAbsolute(configFile, cwd)

  const config = merge(
    {
      cliArgs: cliArgs,
      cwd,
      configFilepath,
      defaultConfigFilepath: path.join(cwd, CONFIG_DEFAULT)
    },
    configFile
  )

  debug('config', config)

  return config
}

/*
 * Merge a new presta.config.js file with the existing CLI args
 * and internal config
 */
function merge (prev, next) {
  const output =
    prev.cliArgs.output || next.output || path.resolve(prev.cwd, 'build')
  const config = {
    ...prev,
    ...next,
    configFile: makeConfigPathsAbsolute(next, prev.cwd),
    files: [].concat(prev.cliArgs.files || []).concat(next.files || []),
    output,
    assets:
      prev.cliArgs.assets || next.assets || path.resolve(prev.cwd, 'public'),
    dynamicEntryFilepath: path.join(output, OUTPUT_DYNAMIC_PAGES_ENTRY)
  }

  return makeConfigPathsAbsolute(config, prev.cwd)
}

/*
 * Clean previous presta.config.js values from the active
 * internal config object
 */
function unmerge (active) {
  const output = active.cliArgs.output || path.resolve(active.cwd, 'build')

  const config = {
    ...active,
    configFile: {},
    files: active.files.filter(
      p => ![].concat(active.configFile.files || []).find(pp => pp === p)
    ),
    output,
    assets: active.cliArgs.assets || path.resolve(active.cwd, 'public'),
    configFilepath: undefined,
    dynamicEntryFilepath: path.join(output, OUTPUT_DYNAMIC_PAGES_ENTRY)
  }

  delete config.render
  delete config.createContent
  delete config.createResponse

  return config
}

/*
 * Extract serialize-able props to merge with user config within generated
 * files
 */
function serialize (config) {
  return JSON.stringify({
    cwd: config.cwd,
    files: config.files,
    output: config.output,
    assets: config.assets
  })
}

module.exports = {
  create,
  merge,
  unmerge,
  serialize
}
