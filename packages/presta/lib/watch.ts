import fs from 'fs-extra'
import path from 'path'
import { create } from 'watch-dependency-graph'
import chokidar from 'chokidar'
import match from 'picomatch'
import merge from 'deep-extend'

import { outputLambdas } from './outputLambdas'
import * as logger from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { buildStaticFiles, removeBuiltStaticFile, StaticFilesMap } from './renderStaticEntries'
import { timer } from './timer'
import { Config } from './config'
import { Hooks } from './createEmitter'

/*
 * Wraps outputLambdas for logging
 */
function updateLambdas(inputs: string[], config: Config) {
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

export function isNewValidFile(file: string, globs: string[], existing: string[]) {
  return match(globs)(file) && !existing.includes(file)
}

export async function watch(config: Config, hooks: Hooks) {
  let staticFilesMap: StaticFilesMap = {}
  const files = getFiles(config.files)

  if (!files.length) {
    logger.warn({
      label: 'paths',
      message: 'no files configured',
    })
  }

  async function buildFile(file: string, existing: string[], config: Config) {
    delete require.cache[file]

    // render just file that changed
    if (isStatic(file)) {
      const result = await buildStaticFiles([file], config, staticFilesMap)
      staticFilesMap = merge({}, staticFilesMap, result.staticFilesMap)
    }

    // update dynamic entry with ALL dynamic files
    updateLambdas(existing.filter(isDynamic), config)
  }

  async function buildFiles(files: string[], existing: string[], config: Config) {
    for (const file of files) {
      await buildFile(file, existing, config)
    }
  }

  /**
   * Important: if we ever remove initial rendering, we will need to
   * re-introduce "file priming" where we require all files and surface errors
   * on startup.
   */
  await buildFiles(files, files, config)
  hooks.emitBrowserRefresh()

  /*
   * Filewatcher watches only presta files. It handles change and remove
   * events, as well as surfaces dependency tree traversal errors
   */
  const fileWatcher = create({ alias: { '@': process.cwd() } })

  fileWatcher.onChange(async (changed) => {
    await buildFiles(changed, files, config)
    hooks.emitBrowserRefresh()
  })

  fileWatcher.onRemove(async ([id]) => {
    logger.debug({ label: 'watch', message: `removed ${id}` })

    // remove from local hash
    files.splice(files.indexOf(id), 1)

    // update this regardless, not sure if [id] was dynamic or static
    updateLambdas(files.filter(isDynamic), config)
    ;(staticFilesMap[id] || []).forEach((file) => removeBuiltStaticFile(path.join(config.staticOutputDir, file)))

    hooks.emitBrowserRefresh()
  })

  fileWatcher.onError((e) => {
    logger.error({
      label: 'error',
      error: typeof e === 'string' ? new Error(e) : e,
    })
  })

  await fileWatcher.add(files)

  /*
   * globalWatcher watches the raw file globs passed to the CLI or as `files`
   * in the config. If checks on add/change to see if a file should be upgraded
   * to a a Presta source file, and added to the fileWatcher.
   */
  const globalWatcher = chokidar.watch(process.cwd(), {
    ignoreInitial: true,
    ignored: [config.output, config.assets],
  })

  globalWatcher.on('add', async (file) => {
    if (!fs.existsSync(file) || fs.lstatSync(file).isDirectory()) return
    if (!isNewValidFile(file, config.files, files)) return

    logger.debug({ label: 'watch', message: `add ${file}` })

    files.push(file)
    await fileWatcher.add(file)

    await buildFile(file, files, config)

    hooks.emitBrowserRefresh()
  })

  /**
   * Listens for events from plugins requesting a file to be built
   */
  hooks.onBuildFile(async ({ file }) => {
    await buildFile(file, files, config)
    hooks.emitBrowserRefresh()
  })

  return {
    async close() {
      await fileWatcher.close()
      await globalWatcher.close()
    },
  }
}
