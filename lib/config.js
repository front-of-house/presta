import path from 'path'
import c from 'ansi-colors'

import { CONFIG_DEFAULT } from './constants'
import { debug } from './debug'
import { log } from './log'

const actualCwd = process.cwd()

/*
 * Don't write to these internal properties:
 *    _cli - the raw CLI args
 *    _config - the full config file, if present
 */
export function create (cliArgs) {
  const cwd = cliArgs.cwd ? path.resolve(actualCwd, cliArgs.cwd) : actualCwd

  require('module-alias').addAliases({ '@': cwd })

  let configFile = {}
  let configFilepath = path.join(cwd, cliArgs.config || CONFIG_DEFAULT)

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

  const config = merge(
    {
      _cli: cliArgs,
      cwd,
      configFilepath
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
  return {
    ...prev,
    ...next,
    _config: next,
    pages: [].concat(prev._cli.pages || []).concat(next.pages || []),
    output: path.resolve(prev.cwd, prev._cli.output || next.output || 'build'),
    assets: path.resolve(prev.cwd, prev._cli.assets || next.assets || 'public')
  }
}

/*
 * Clean previous presta.config.js values from the active
 * internal config object
 */
export function unmerge (active) {
  const config = {
    ...active,
    _config: {},
    pages: active.pages.filter(
      p => ![].concat(active._config.pages || []).find(pp => pp === p)
    ),
    output: path.resolve(active.cwd, active._cli.output || 'build'),
    assets: path.resolve(active.cwd, active._cli.assets || 'public')
  }

  delete config.render
  delete config.createContent
  delete config.createResponse

  return config
}
