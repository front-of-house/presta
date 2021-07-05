import path from 'path'
import c from 'ansi-colors'

import { debug } from './debug'
import { log } from './log'
import { createEmitter } from './createEmitter'

import { Presta, Config, CLI } from '../'

const cwd = process.cwd()
const defaultConfigFilepath = 'presta.config.js'

export enum Env {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test'
}

global.__presta__ =
  global.__presta__ ||
  ({
    pid: process.pid,
    cwd,
    env: Env.TEST,
  } as Presta)

function resolveAbsolutePaths (config: Config) {
  if (config.files)
    config.files = []
      .concat(config.files)
      .map(p => path.resolve(cwd, p))
  if (config.output)
    config.output = path.resolve(cwd, config.output)
  if (config.assets)
    config.assets = path.resolve(cwd, config.assets)
  return config
}

/**
 * @private
 */
export function _clearCurrentConfig () {
  // @ts-ignore
  global.__presta__ = {
    pid: process.pid,
    cwd,
    env: Env.TEST,
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
  global.__presta__ = createConfig({
    ...global.__presta__,
    config: {}
  })

  return global.__presta__
}

export function getCurrentConfig () {
  return global.__presta__
}

export function createConfig ({
  env = global.__presta__.env,
  config = {},
  cli = {}
}: {
  env?: Env
  config?: Partial<Config>
  cli?: Partial<CLI>
}) {
  config = resolveAbsolutePaths({ ...config }) // clone read-only obj
  cli = resolveAbsolutePaths({ ...cli })

  // combined config, preference to CLI args
  const merged = {
    output: cli.output || config.output || path.resolve('build'),
    assets: cli.assets || config.assets || path.resolve('public'),
    files:
      cli.files && cli.files.length
        ? cli.files
        : config.files
        ? [].concat(config.files)
        : []
  }

  // set instance
  global.__presta__ = {
    ...global.__presta__,
    ...merged, // overwrites every time
    env,
    configFilepath: path.resolve(cli.config || defaultConfigFilepath),
    functionsOutputDir: path.join(merged.output, 'functions'),
    staticOutputDir: path.join(merged.output, 'static'),
    routesManifest: path.join(merged.output, 'routes.json'),
    events: createEmitter()
  }

  debug('config created', global.__presta__)

  return global.__presta__
}
