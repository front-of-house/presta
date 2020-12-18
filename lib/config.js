import path from 'path'
import c from 'ansi-colors'

import { CONFIG_DEFAULT } from './constants'
import { debug } from './debug'
import { log } from './log'

const actualCwd = process.cwd()

export function create (cliArgs) {
  const cwd = cliArgs.cwd ? path.resolve(actualCwd, cliArgs.cwd) : actualCwd

  require('module-alias').addAliases({ '@': cwd })

  let configFile
  let configFilepath = path.join(cwd, cliArgs.config || CONFIG_DEFAULT)

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
      _base: {
        ...cliArgs,
        cwd,
        configFilepath
      },
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
    pages: [].concat(prev._base.pages || []).concat(next.pages || []),
    output: path.resolve(
      prev._base.cwd,
      prev._base.output || next.output || 'build'
    ),
    assets: path.resolve(
      prev._base.cwd,
      prev._base.assets || next.assets || 'public'
    )
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
    output: path.resolve(active._base.cwd, active._base.output || 'build'),
    assets: path.resolve(active._base.cwd, active._base.assets || 'public')
  }

  delete config.render
  delete config.createContent
  delete config.createResponse

  return config
}
