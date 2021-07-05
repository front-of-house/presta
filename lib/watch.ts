import fs from 'fs-extra'
import c from 'ansi-colors'
import graph from 'watch-dependency-graph'
import chokidar from 'chokidar'
import match from 'picomatch'

import { debug } from './debug'
import { outputLambdas } from './outputLambdas'
import { log, formatLog } from './log'
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
function updateLambdas (inputs: string[], config: Presta) {
  const time = timer()

  // always write this, even if inputs = []
  outputLambdas(inputs, config)

  // if user actually has routes configured, give feedback
  if (inputs.length) {
    formatLog({
      color: 'green',
      action: 'build',
      meta: '⚡︎' + time(),
      description: ''
    })
  }
}

/**
 * Util for other helpers, like source
 */
export async function buildFiles (ids: string[], config: Presta) {
  if (!ids.length) return

  const staticIds = ids.filter(isStatic)
  // const dynamicIds = ids.filter(isDynamic)

  if (staticIds.length) {
    await renderStaticEntries(staticIds, config)
  }

  /**
   * TODO can't do this, will overwrite any dynamic routes that exist
   *
   * This could be alleviated IF we decided to output separate functions
   * for each route. But at the moment this breaks.
   */
  // if (dynamicIds.length) updateLambdas(dynamicIds, config)

  config.emitter.emit('refresh')
  config.emitter.emit('done', ids)
}

export async function watch (config: Presta) {
  debug('watch initialized with config', config)

  /*
   * Get files that match static/dynamic patters at startup
   */
  let files = getFiles(config)
  let hasConfigFile = fs.existsSync(config.configFilepath)

  if (!files.length) {
    log(`  ${c.gray('no files configured')}\n`)
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
    ignored: [config.merged.output, config.merged.assets]
  })

  /*
   * On a config update, the user may have passed in a new `files` array or
   * other global config required by all files, so we need to re-fetch all
   * files and rebuild everything.
   */
  async function handleConfigUpdate () {
    files = getFiles(config)
    buildFiles(files, config)
  }

  /*
   * On a changed file, we can just render it
   */
  async function handleFileChange (file: string) {
    // render just file that changed
    if (isStatic(file)) {
      await renderStaticEntries([file], config)
    }

    // update dynamic entry with ALL dynamic files
    if (isDynamic(file)) {
      delete require.cache[config.dynamicEntryFilepath]
      updateLambdas(files.filter(isDynamic), config)
    }

    config.emitter.emit('refresh')
    config.emitter.emit('done', [file])
  }

  fileWatcher.on('remove', ([id]) => {
    debug('fileWatcher - removed', id)

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

    ;(builtStaticFiles[id] || []).forEach(file =>
      removeBuiltStaticFile(file, config)
    )

    config.emitter.emit('remove', id)
  })

  fileWatcher.on('change', ([id]) => {
    debug('fileWatcher - changed', id)

    if (id === config.configFilepath) {
      // clear config file for re-require
      delete require.cache[config.configFilepath]

      try {
        // merge in new values from config file
        config = createConfig({
          configFile: getConfigFile(config.configFilepath)
        })

        handleConfigUpdate()
      } catch (e) {
        log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
      }
    } else {
      handleFileChange(id)
    }

    config.emitter.emit('change', id)
  })

  fileWatcher.on('error', e => {
    log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
  })

  /*
   * globalWatcher watches the raw file globs passed to the CLI or as `files`
   * in the config. If checks on add/change to see if a file should be upgraded
   * to a a Presta source file, and added to the fileWatcher. It also watches
   * for addition of a config file.
   */
  globalWatcher.on('all', async (event, file) => {
    // ignore events handled by wdg, or any directory events
    if (
      !/add|change/.test(event) ||
      !fs.existsSync(file) ||
      fs.lstatSync(file).isDirectory()
    )
      return

    // if a file change matches any pages globs
    if (match(config.merged.files)(file) && !files.includes(file)) {
      debug('globalWatcher - add file')

      files.push(file)

      fileWatcher.add(file)

      handleFileChange(file)
    }

    // if file matches config file and we don't already have one
    if (file === config.configFilepath && !hasConfigFile) {
      debug('globalWatcher - add config file')

      fileWatcher.add(config.configFilepath)

      try {
        // merge in new values from config file
        config = createConfig({
          configFile: getConfigFile(config.configFilepath)
        })

        hasConfigFile = true

        handleConfigUpdate()
      } catch (e) {
        log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
      }
    }

    config.emitter.emit('add', file)
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
    log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
  }
}
