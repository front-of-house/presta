import fs from 'fs'
import path from 'path'
import getPort from 'get-port'

import * as logger from './log'
import { PrestaCLIDevOptions, PrestaCLIBuildOptions } from './cli'
import { Plugin } from './plugins'

export type Options = {
  files: string[]
  output: string
  assets: string
  plugins: Plugin[]
  port: number
}

export type Config = Options & {
  env: string
  staticOutputDir: string
  functionsOutputDir: string
  manifestFilepath: string
}

export const defaultConfigFilepath = 'presta.config.js'

export function getAvailablePort(preferred: string) {
  return getPort({ port: parseInt(preferred, 10) })
}

/**
 * Fetch a config file. If one was specified by the user, let them know if
 * anything goes wrong. Outside watch mode, this should exit(1) if the user
 * provided a config and there was an error
 */
export function getConfigFile(filepath?: string, shouldExit: boolean = false) {
  const fp = path.resolve(filepath || defaultConfigFilepath)

  try {
    delete require.cache[fp]
    return require(fp)
  } catch (e) {
    const exists = fs.existsSync(fp)

    // config file exists, should log error, otherwise ignore missing file
    if (exists) {
      logger.error({
        label: 'error',
        error: e as Error,
      })

      // we're not in watch mode, exit build
      if (shouldExit) process.exit(1)
    }

    return {}
  }
}

export function create(
  env: string,
  cli: PrestaCLIBuildOptions | PrestaCLIDevOptions,
  file: Partial<Options>,
  cwd = process.cwd()
): Config {
  const config = {
    env,
    output: 'build',
    assets: 'public',
    plugins: [],
    port: 4000,
    files: [], // TODO where do we validate
    ...file,
  }

  // override with CLI
  if (cli._.length) config.files = cli._
  if (cli.output) config.output = cli.output
  if (cli.assets) config.assets = cli.assets
  if (cli.port) config.port = cli.port

  // resolve absolute paths
  if (config.files) config.files = ([] as string[]).concat(config.files).map((p) => path.resolve(cwd, p))
  if (config.output) config.output = path.resolve(cwd, config.output)
  if (config.assets) config.assets = path.resolve(cwd, config.assets)

  return {
    ...config,
    staticOutputDir: path.join(config.output, 'static'),
    functionsOutputDir: path.join(config.output, 'functions'),
    manifestFilepath: path.join(config.output, 'manifest.json'),
  }
}
