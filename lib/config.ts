import * as path from 'path'
import * as c from 'ansi-colors'

import { CONFIG_DEFAULT, OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { debug } from './debug'
import { log } from './log'
import { createEmitter } from './createEmitter'
import config from './types/config'

const cwd = process.cwd();


(global as any).__presta__  = (global as any).__presta__ || {
  cliArgs: {},
  configFile: {},
  pid: process.pid
}

export const resolvePaths = (obj: any) => {
  if (obj.files) obj.files = [].concat(obj.files).map(p => path.resolve(cwd, p))
  if (obj.output) obj.output = path.resolve(cwd, obj.output)
  if (obj.assets) obj.assets = path.resolve(cwd, obj.assets)
  return obj
}

export const getConfigFile = (filepath: string) => {
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

export const createConfig = ({
  env = (global as any).__presta__.env,
  configFile = (global as any).__presta__.configFile,
  cliArgs = (global as any).__presta__.cliArgs
}) => {
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
  };

  (global as any).__presta__ = {
    ...(global as any).__presta__,
    env,
    cwd,
    configFile,
    cliArgs,
    merged,
    configFilepath: path.resolve(cliArgs.config || CONFIG_DEFAULT),
    dynamicEntryFilepath: path.join(merged.output, OUTPUT_DYNAMIC_PAGES_ENTRY),
    emitter: createEmitter()
  } as config

  debug('config created', (global as any).__presta__)

  return (global as any).__presta__
}

export const removeConfigValues = () => {
  (global as any).__presta__ = createConfig({
    ...(global as any).__presta__,
    configFile: {}
  })

  return (global as any).__presta__
}

/*
 * Extract serialize-able props to merge with user config within generated
 * files
 */
export const serialize = (config) => {
  return JSON.stringify({
    cwd: config.cwd,
    files: config.merged.files,
    output: config.merged.output,
    assets: config.merged.assets
  })
}

export const getCurrentConfig = () => {
  return (global as any).__presta__global.__presta__
}

export const clearCurrentConfig = () => {
  (global as any).__presta__ = { cliArgs: {}, configFile: {} }
}