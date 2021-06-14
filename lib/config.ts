import path from 'path'
import c from 'ansi-colors'

import { debug } from './debug'
import { log } from './log'
import { createEmitter } from './createEmitter'

const cwd = process.cwd()
const defaultConfigFilepath = 'presta.config.js'

export enum Env {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
}

export type Config = {
  files?: string[]
  output?: string
  assets?: string
}

export type Args = {
  files?: string[]
  output?: string
  assets?: string
  config?: string
}

export type Presta = {
  pid: number
  cwd: string
  env: Env
  cliArgs: Args
  configFile: Config
  merged: Config
  configFilepath: string
  dynamicEntryFilepath: string
  emitter: ReturnType<typeof createEmitter>
}

// @ts-ignore
let instance: Presta = (global.__presta__ =
  // @ts-ignore
  global.__presta__ ||
  ({
    pid: process.pid,
    cwd,
    env: Env.PRODUCTION,
    cliArgs: {},
    configFile: {}
  } as Presta))

function resolveAbsolutePaths (configFile: Config) {
  if (configFile.files)
    configFile.files = []
      .concat(configFile.files)
      .map(p => path.resolve(cwd, p))
  if (configFile.output)
    configFile.output = path.resolve(cwd, configFile.output)
  if (configFile.assets)
    configFile.assets = path.resolve(cwd, configFile.assets)
  return configFile
}

/**
 * @private
 */
export function _clearCurrentConfig () {
  // @ts-ignore
  instance = global.__presta__ = {
    pid: process.pid,
    cwd,
    env: Env.PRODUCTION,
    cliArgs: {},
    configFile: {}
  }
}

/**
 * Fetch a config file. If one was specified by the user, let them know if
 * anything goes wrong. Outside watch mode, this should exit(1) if the user
 * provided a config and there was an error
 */
export function getConfigFile (filepath: string, shouldExit: boolean = false) {
  try {
    return require(path.resolve(filepath || defaultConfigFilepath))
  } catch (e) {
    // if user specified a file, must be a syntax error
    if (!!filepath) {
      log(`${c.red('~ error')} ${filepath}\n\n  > ${e.stack || e}\n`)

      // we're not in watch mode, exit
      if (shouldExit) process.exit(1)
    }

    return {}
  }
}

/**
 * Creates a new instance _without_ any values provided by the config file.
 * This is used when the user deletes their config file.
 */
export function removeConfigValues () {
  // @ts-ignore
  instance = global.__presta__ = createConfig({
    ...instance,
    configFile: {}
  })

  return instance
}

/**
 * Extract serialize-able props to merge with user config within generated
 * files
 */
export function serialize (config: Presta) {
  return JSON.stringify({
    cwd: config.cwd,
    files: config.merged.files,
    output: config.merged.output,
    assets: config.merged.assets
  })
}

export function getCurrentConfig () {
  return instance
}

export function createConfig ({
  env = instance.env,
  configFile = instance.configFile,
  cliArgs = instance.cliArgs
}) {
  configFile = resolveAbsolutePaths({ ...configFile }) // clone read-only obj
  cliArgs = resolveAbsolutePaths({ ...cliArgs })

  // combined config, preference to CLI args
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

  // set instance
  // @ts-ignore
  instance = global.__presta__ = {
    ...instance,
    env,
    configFile,
    cliArgs,
    merged,
    configFilepath: path.resolve(cliArgs.config || defaultConfigFilepath),
    dynamicEntryFilepath: path.join(merged.output, 'functions/presta.js'),
    emitter: createEmitter()
  }

  debug('config created', instance)

  return instance
}
