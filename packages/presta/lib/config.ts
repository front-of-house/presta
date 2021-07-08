import path from 'path'

import * as logger from './log'
import { createEmitter } from './createEmitter'

import type { Presta, Config, CLI } from '..'

const defaultConfigFilepath = 'presta.config.js'

export enum Env {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

const defaultConfig = {
  pid: process.pid,
  cwd: process.cwd(),
  env: Env.TEST,
  debug: false,
} as Presta

function setCurrentConfig(config: Presta): Presta {
  // @ts-ignore
  global.__presta__ = config
  return config
}

export function getCurrentConfig(): Presta {
  // @ts-ignore
  if (!global.__presta__) {
    setCurrentConfig(defaultConfig)
  }

  // @ts-ignore
  return global.__presta__
}

function resolveAbsolutePaths(config: Config) {
  const cwd = process.cwd()

  if (config.files) config.files = ([] as string[]).concat(config.files).map((p) => path.resolve(cwd, p))
  if (config.output) config.output = path.resolve(cwd, config.output)
  if (config.assets) config.assets = path.resolve(cwd, config.assets)
  return config
}

/**
 * @private
 */
export function _clearCurrentConfig() {
  // @ts-ignore
  global.__presta__ = {
    pid: process.pid,
    cwd: process.cwd(),
    env: Env.TEST,
  }
}

/**
 * Fetch a config file. If one was specified by the user, let them know if
 * anything goes wrong. Outside watch mode, this should exit(1) if the user
 * provided a config and there was an error
 */
export function getConfigFile(filepath: string, shouldExit: boolean = false) {
  try {
    return require(path.resolve(filepath || defaultConfigFilepath))
  } catch (e) {
    logger.error({
      label: 'error',
      error: e,
    })

    // we're not in watch mode, exit
    if (shouldExit) process.exit(1)

    return {}
  }
}

/**
 * Creates a new instance _without_ any values provided by the config file.
 * This is used when the user deletes their config file.
 */
export function removeConfigValues() {
  logger.debug({
    label: 'debug',
    message: `config file values cleared`,
  })

  return setCurrentConfig(
    createConfig({
      ...getCurrentConfig(),
      config: {},
    })
  )
}

export function createConfig({
  env = getCurrentConfig().env,
  config = {},
  cli = {},
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
    files: cli.files && cli.files.length ? cli.files : config.files ? ([] as string[]).concat(config.files) : [],
  }

  // set instance
  const current = setCurrentConfig({
    ...getCurrentConfig(),
    ...merged, // overwrites every time
    env,
    debug: cli.debug || getCurrentConfig().debug,
    cwd: process.cwd(),
    configFilepath: path.resolve(cli.config || defaultConfigFilepath),
    functionsOutputDir: path.join(merged.output, 'functions'),
    staticOutputDir: path.join(merged.output, 'static'),
    routesManifest: path.join(merged.output, 'routes.json'),
    events: createEmitter(),
  })

  if (config.plugins) {
    config.plugins.map(p => {
      try {
        p()
      } catch (e) {
        logger.error({
          label: 'error',
          error: e
        })
      }
    })
  }

  logger.debug({
    label: 'debug',
    message: `config created ${JSON.stringify(current)}`,
  })

  return current
}
