import fs from 'fs-extra'
import path from 'path'
import { create } from 'watch-dependency-graph'
import chokidar from 'chokidar'
import match from 'picomatch'
import { timer } from '@presta/utils'

import { outputLambdas } from './outputLambdas'
import * as logger from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { buildStaticFiles, removeBuiltStaticFile, StaticFilesMap } from './buildStaticFiles'
import { Config } from './config'
import { Hooks } from './createEmitter'
import { staticFilesMapToManifestFiles, writeManifest } from './manifest'

/*
 * Wraps outputLambdas for logging
 */
function updateLambdas(inputs: string[], config: Config) {
  const time = timer()

  // always write this, even if inputs = []
  const lambdas = outputLambdas(inputs, config)

  // if user actually has routes configured, give feedback
  if (inputs.length) {
    logger.info({
      label: 'built',
      message: `lambdas`,
      duration: time(),
    })
  }

  return lambdas
}

export function isNewValidFile(file: string, globs: string[], existing: string[]) {
  return match(globs)(file) && !existing.includes(file)
}

export async function watch(config: Config, hooks: Hooks) {
  let staticFilesMap: StaticFilesMap = {}
  const allFiles = getFiles(config.files)

  if (!allFiles.length) {
    logger.warn({
      label: 'paths',
      message: 'no files configured',
    })
  }

  async function buildFiles(files: string[], existing: string[], config: Config) {
    for (const file of files) {
      delete require.cache[file]
    }

    const builtStaticFiles = await buildStaticFiles(files.filter(isStatic), config, staticFilesMap)
    const builtLambdas = updateLambdas(existing.filter(isDynamic), config)

    // merge in new static files
    staticFilesMap = Object.assign(staticFilesMap, builtStaticFiles.staticFilesMap)

    writeManifest(
      {
        files: [...staticFilesMapToManifestFiles(staticFilesMap), ...builtLambdas],
      },
      config
    )
  }

  /**
   * Important: if we ever remove initial rendering, we will need to
   * re-introduce "file priming" where we require all files and surface errors
   * on startup.
   */
  await buildFiles(allFiles, allFiles, config)
  hooks.emitBrowserRefresh()

  /*
   * Filewatcher watches only presta files. It handles change and remove
   * events, as well as surfaces dependency tree traversal errors
   */
  const fileWatcher = create({ alias: { '@': process.cwd() } })

  fileWatcher.onChange(async (changed) => {
    await buildFiles(changed, allFiles, config)
    hooks.emitBrowserRefresh()
  })

  fileWatcher.onRemove(async ([id]) => {
    logger.debug({ label: 'watch', message: `removed ${id}` })

    // remove from local hash
    allFiles.splice(allFiles.indexOf(id), 1)

    // update this regardless, not sure if [id] was dynamic or static
    updateLambdas(allFiles.filter(isDynamic), config)
    ;(staticFilesMap[id] || []).forEach((file) => removeBuiltStaticFile(path.join(config.staticOutputDir, file)))

    hooks.emitBrowserRefresh()
  })

  fileWatcher.onError((e) => {
    logger.error({
      label: 'error',
      error: typeof e === 'string' ? new Error(e) : e,
    })
  })

  await fileWatcher.add(allFiles)

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
    if (!isNewValidFile(file, config.files, allFiles)) return

    logger.debug({ label: 'watch', message: `add ${file}` })

    allFiles.push(file)
    await fileWatcher.add(file)

    await buildFiles([file], allFiles, config)

    hooks.emitBrowserRefresh()
  })

  /**
   * Listens for events from plugins requesting a file to be built
   */
  hooks.onBuildFile(async ({ file }) => {
    await buildFiles([file], allFiles, config)
    hooks.emitBrowserRefresh()
  })

  return {
    async close() {
      await fileWatcher.close()
      await globalWatcher.close()
    },
  }
}
