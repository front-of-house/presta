import fs from 'fs-extra'
import { build as esbuild } from 'esbuild'

import { outputLambdas } from './outputLambdas'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { renderStaticEntries } from './renderStaticEntries'
import { timer } from './timer'
import * as logger from './log'

import { Presta } from '../'

export async function build (config: Presta) {
  const totalTime = timer()
  const files = getFiles(config)
  const staticIds = files.filter(isStatic)
  const dynamicIds = files.filter(isDynamic)

  logger.debug({
    label: 'build',
    message: 'starting build'
  })

  if (!staticIds.length && !dynamicIds.length) {
    logger.warn({
      label: 'files',
      message: 'no files were found, nothing to build'
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

          const { allGeneratedFiles } = await renderStaticEntries(
            staticIds,
            config
          )

          staticTime = time()
          staticFileAmount = allGeneratedFiles.length
        }
      })(),
      (async () => {
        if (dynamicIds.length) {
          const time = timer()

          outputLambdas(dynamicIds, config)

          await esbuild({
            entryPoints: Object.values(require(config.routesManifest)),
            outdir: config.functionsOutputDir,
            bundle: true,
            platform: 'node',
            target: ['node12'],
            minify: true,
            allowOverwrite: true
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
      })()
    ])

    // since we're building (not watch) if any task fails, exit with error
    if (tasks.find(task => task.status === 'rejected')) {
      logger.debug({
        label: 'build',
        message: 'build partially failed'
      })

      // log out errors
      tasks
        .filter(task => task.status === 'rejected')
        .forEach((task: PromiseRejectedResult) =>
          logger.error({
            label: 'error',
            error: task.reason
          })
        )

      process.exit(1)
      return
    }

    logger.newline()

    if (staticTime) {
      logger.info({
        label: 'static',
        message: `rendered ${staticFileAmount} file(s)`,
        duration: staticTime
      })
    }

    if (dynamicTime) {
      logger.info({
        label: 'lambda',
        message: `compiled ${dynamicIds.length} function(s)`,
        duration: dynamicTime
      })
    }

    if (copyTime) {
      logger.info({
        label: 'assets',
        message: `copied in ${copyTime}`
      })
    }

    if (staticTime || dynamicTime) {
      logger.newline()
      logger.info({
        label: 'complete',
        message: `in ${totalTime()}`
      })
      logger.newline()
    }
  }
}
