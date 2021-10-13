import fs from 'fs-extra'
import { build as esbuild } from 'esbuild'

import { outputLambdas } from './outputLambdas'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { renderStaticEntries } from './renderStaticEntries'
import { timer } from './timer'
import * as logger from './log'
import { Presta } from './types'

function getRoutesManifestSafely(manifestFilepath: string) {
  try {
    return require(manifestFilepath)
  } catch (e) {
    return {}
  }
}

export async function build(config: Presta) {
  const totalTime = timer()
  const files = getFiles(config)
  const staticIds = files.filter(isStatic)
  const dynamicIds = files.filter(isDynamic)

  logger.debug({
    label: 'build',
    message: 'starting build',
  })

  if (!staticIds.length && !dynamicIds.length) {
    logger.warn({
      label: 'files',
      message: 'no files were found, nothing to build',
    })
  } else {
    let staticTime = ''
    let staticFileAmount = 0
    let dynamicTime = ''
    let copyTime = ''

    const tasks = await Promise.allSettled([
      (async () => {
        if (staticIds.length) {
          const time = timer()

          const { allGeneratedFiles } = await renderStaticEntries(staticIds, config)

          staticTime = time()
          staticFileAmount = allGeneratedFiles.length
        }
      })(),
      (async () => {
        if (dynamicIds.length) {
          const time = timer()

          outputLambdas(dynamicIds, config)

          await esbuild({
            entryPoints: Object.values(require(config.functionsManifest)),
            outdir: config.functionsOutputDir,
            bundle: true,
            platform: 'node',
            target: ['node12'],
            minify: true,
            allowOverwrite: true,
          })

          dynamicTime = time()
        }
      })(),
      (async () => {
        if (fs.existsSync(config.assets)) {
          const time = timer()

          fs.copySync(config.assets, config.staticOutputDir)

          copyTime = time()
        }
      })(),
    ])

    // since we're building (not watch) if any task fails, exit with error
    if (tasks.find((task) => task.status === 'rejected')) {
      logger.debug({
        label: 'build',
        message: 'build partially failed',
      })

      // log out errors
      tasks.forEach((task) => {
        if (task.status === 'rejected') {
          logger.error({
            label: 'error',
            error: task.reason,
          })
        }
      })

      process.exit(1)
      return
    }

    if (staticTime || dynamicTime) {
      logger.newline()
    }

    if (staticTime) {
      logger.info({
        label: 'static',
        message: `rendered ${staticFileAmount} file(s)`,
        duration: staticTime,
      })
    }

    if (dynamicTime) {
      logger.info({
        label: 'lambda',
        message: `compiled ${dynamicIds.length} function(s)`,
        duration: dynamicTime,
      })
    }

    if (copyTime) {
      logger.info({
        label: 'assets',
        message: `copied in ${copyTime}`,
      })
    }

    config.hooks.emitPostBuild({
      output: config.output,
      staticOutput: config.staticOutputDir,
      functionsOutput: config.functionsOutputDir,
      functionsManifest: getRoutesManifestSafely(config.functionsManifest),
    })

    if (staticTime || dynamicTime) {
      logger.newline()
      logger.info({
        label: 'complete',
        message: `in ${totalTime()}`,
      })
      logger.newline()
    }
  }
}
