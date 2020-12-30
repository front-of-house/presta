import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'

import { debug } from './debug'
import { createDynamicEntry } from './createDynamicEntry'
import { log, formatLog } from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { renderStaticEntries } from './renderStaticEntries'
import { timer } from './timer'
import { compile } from './webpack'

export async function build (config, options = {}) {
  debug('watch initialized with config', config)

  const totalTime = timer()
  const files = getFiles(config)
  const staticIds = files.filter(isStatic)
  const dynamicIds = files.filter(isDynamic)
  const userConfig = config.configFilepath ? require(config.configFilepath) : {}

  if (!staticIds.length && !dynamicIds.length) {
    log(`  ${c.gray('nothing to build')}\n`)
  } else {
    let staticTime = 0
    let staticFileAmount = 0
    let dynamicTime = 0
    let copyTime = 0

    await Promise.all([
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
        if (dynamicIds.length || userConfig.onRequest) {
          const time = timer()

          createDynamicEntry(dynamicIds, config)

          await compile(config)

          dynamicTime = time()

          formatLog({
            color: 'green',
            action: 'build',
            meta: '⚡︎' + dynamicTime,
            description: ''
          })
        }
      })(),
      (async () => {
        if (fs.existsSync(config.assets)) {
          const time = timer()

          fs.copySync(config.assets, path.join(config.output, 'static'))

          copyTime = time()
        }
      })()
    ])

    log('')

    if (staticTime) {
      log(
        `  ${c.blue(`static`)} ${c.gray(
          `built ${staticFileAmount} files in ${staticTime}`
        )}`
      )
    }

    if (dynamicTime) {
      log(
        `  ${c.blue(`dynamic`)} ${c.gray(
          `compiled function in ${dynamicTime}`
        )}`
      )
    }

    if (copyTime) {
      log(`  ${c.blue(`copied`)} ${c.gray(`static assets in ${copyTime}`)}`)
    }

    if (staticTime || dynamicTime) {
      log('') // leave a 1-line buffer

      log(`  ${c.blue(`build complete`)} ${c.gray(`in ${totalTime()}`)}`)

      log('') // leave a 1-line buffer
    }
  }
}
