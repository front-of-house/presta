import path from 'path'
import c from 'ansi-colors'

import { CONFIG_DEFAULT, OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { debug } from './debug'
import { log } from './log'

const actualCwd = process.cwd()

function makeConfigPathsAbsolute (config, cwd) {
  if (config.pages)
    config.pages = [].concat(config.pages).map(p => path.resolve(cwd, p))
  if (config.output) config.output = path.resolve(cwd, config.output)
  if (config.assets) config.assets = path.resolve(cwd, config.assets)

  return config
}

/*
 * Don't write to these internal properties:
 *    _cli - the raw CLI args
 *    _config - the full config file, if present
 */
export function create (cliArgs) {
  const cwd = cliArgs.cwd ? path.resolve(actualCwd, cliArgs.cwd) : actualCwd

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
      _cli: cliArgs,
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
export function merge (prev, next) {
  const output =
    prev._cli.output || next.output || path.resolve(prev.cwd, 'build')
  const config = {
    ...prev,
    ...next,
    _config: makeConfigPathsAbsolute(next, prev.cwd),
    pages: [].concat(prev._cli.pages || []).concat(next.pages || []),
    output,
    assets: prev._cli.assets || next.assets || path.resolve(prev.cwd, 'public'),
    dynamicEntryFilepath: path.join(output, OUTPUT_DYNAMIC_PAGES_ENTRY)
  }

  return makeConfigPathsAbsolute(config, prev.cwd)
}

/*
 * Clean previous presta.config.js values from the active
 * internal config object
 */
export function unmerge (active) {
  const output = active._cli.output || path.resolve(active.cwd, 'build')

  const config = {
    ...active,
    _config: {},
    pages: active.pages.filter(
      p => ![].concat(active._config.pages || []).find(pp => pp === p)
    ),
    output,
    assets: active._cli.assets || path.resolve(active.cwd, 'public'),
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
export function serialize (config) {
  return JSON.stringify({
    cwd: config.cwd,
    pages: config.pages,
    output: config.output,
    assets: config.assets
  })
}
