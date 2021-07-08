import fs from 'fs-extra'
// @ts-ignore
import graph from 'watch-dependency-graph'
import chokidar from 'chokidar'
import match from 'picomatch'

import { outputLambdas } from './outputLambdas'
import * as logger from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { renderStaticEntries } from './renderStaticEntries'
import { timer } from './timer'
import { createConfig, removeConfigValues, getConfigFile } from './config'
import { builtStaticFiles } from './builtStaticFiles'
import { removeBuiltStaticFile } from './removeBuiltStaticFile'

import type { Presta } from '..'

/*
 * Wraps outputLambdas for logging
 */
function updateLambdas(inputs: string[], config: Presta) {
  const time = timer()

  // always write this, even if inputs = []
  outputLambdas(inputs, config)

  // if user actually has routes configured, give feedback
  if (inputs.length) {
    logger.info({
      label: 'built',
      message: `lambdas`,
      duration: time(),
    })
  }
}

export async function watch(config: Presta) {
  /*
   * Get files that match static/dynamic patters at startup
   */
  let files = getFiles(config)
  let hasConfigFile = fs.existsSync(config.configFilepath)

  if (!files.length) {
    logger.warn({
      label: 'paths',
      message: 'no files configured',
    })
  }

  /*
   * Create initial dynamic entry regardless of if the user has routes, bc we
   * need this file to serve 404 locally
   */
  updateLambdas(files.filter(isDynamic), config)

  /*
   * Set up all watchers
   */
  const fileWatcher = graph({ alias: { '@': config.cwd } })
  const globalWatcher = chokidar.watch(config.cwd, {
    ignoreInitial: true,
    ignored: [config.output, config.assets],
  })

  /*
   * On a config update, the user may have passed in a new `files` array or
   * other global config required by all files, so we need to re-fetch all
   * files and rebuild everything.
   */
  async function handleConfigUpdate() {
    files = getFiles(config)
    await renderStaticEntries(files.filter(isStatic), config)
    updateLambdas(files.filter(isDynamic), config)
  }

  /*
   * On a changed file, we can just render it
   */
  async function handleFileChange(file: string) {
    // render just file that changed
    if (isStatic(file)) {
      await renderStaticEntries([file], config)
    }

    // update dynamic entry with ALL dynamic files
    if (isDynamic(file)) {
      updateLambdas(files.filter(isDynamic), config)
    }

    config.events.emit('refresh')
    config.events.emit('done', [file])
  }

  fileWatcher.on('remove', ([id]: string[]) => {
    logger.debug({
      label: 'watch',
      message: `fileWatcher - removed ${id}`,
    })

    // remove from local hash
    files.splice(files.indexOf(id), 1)

    // update this regardless, not sure if [id] was dynamic or static
    updateLambdas(files.filter(isDynamic), config)

    // if it was config, we gotta do a restart
    if (id === config.configFilepath) {
      // filter out values from the config file
      config = removeConfigValues()

      // reset this!
      hasConfigFile = false

      handleConfigUpdate()
    }

    ;(builtStaticFiles[id] || []).forEach((file) => removeBuiltStaticFile(file, config))

    config.events.emit('remove', id)
  })

  fileWatcher.on('change', ([id]: string[]) => {
    logger.debug({
      label: 'watch',
      message: `fileWatcher - changed ${id}`,
    })

    if (id === config.configFilepath) {
      // clear config file for re-require
      delete require.cache[config.configFilepath]

      try {
        // merge in new values from config file
        config = createConfig({
          config: getConfigFile(config.configFilepath),
        })

        handleConfigUpdate()
      } catch (e) {
        logger.error({
          label: 'error',
          error: e,
        })
      }
    } else {
      handleFileChange(id)
    }

    config.events.emit('change', id)
  })

  fileWatcher.on('error', (e: Error) => {
    logger.error({
      label: 'error',
      error: e,
    })
  })

  /*
   * globalWatcher watches the raw file globs passed to the CLI or as `files`
   * in the config. If checks on add/change to see if a file should be upgraded
   * to a a Presta source file, and added to the fileWatcher. It also watches
   * for addition of a config file.
   */
  globalWatcher.on('all', async (event, file) => {
    // ignore events handled by wdg, or any directory events
    if (!/add|change/.test(event) || !fs.existsSync(file) || fs.lstatSync(file).isDirectory()) return

    // if a file change matches any pages globs
    if (match(config.files)(file) && !files.includes(file)) {
      logger.debug({
        label: 'watch',
        message: `globalWatcher - add ${file}`,
      })

      files.push(file)

      fileWatcher.add(file)

      handleFileChange(file)
    }

    // if file matches config file and we don't already have one
    if (file === config.configFilepath && !hasConfigFile) {
      logger.debug({
        label: 'watch',
        message: `globalWatcher - add config file ${file}`,
      })

      fileWatcher.add(config.configFilepath)

      try {
        // merge in new values from config file
        config = createConfig({
          config: getConfigFile(config.configFilepath),
        })

        hasConfigFile = true

        handleConfigUpdate()
      } catch (e) {
        logger.error({
          label: 'error',
          error: e,
        })
      }
    }

    config.events.emit('add', file)
  })

  /**
   * Init watching after event subscriptions
   */
  fileWatcher.add(files)
  if (hasConfigFile) fileWatcher.add(config.configFilepath)

  /**
   * Prime files to check for errors on startup and register any plugins
   */
  try {
    files.map(require)
  } catch (e) {
    logger.error({
      label: 'error',
      error: e,
    })
  }
}
