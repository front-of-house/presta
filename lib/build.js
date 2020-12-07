import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'

import { debug } from './debug'
import { createDynamicEntry } from './createEntries'
import { log, formatLog } from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { renderStaticEntries } from './renderStaticEntries'
import { timer } from './timer'
import { compile } from './webpack'

export async function build (config, options = {}) {
  debug('watch initialized with config', config)

  const staticIds = getFiles(config.pages).filter(isStatic)
  const dynamicIds = getFiles(config.pages).filter(isDynamic)
  const userConfig = config.configFilepath ? require(config.configFilepath) : {}

  if (!staticIds.length && !dynamicIds.length) {
    log(`  ${c.gray('nothing to build')}\n`)
  } else {
    let staticTime = 0
    let staticFileAmount = 0
    let dynamicTime = 0
    let copyTime = 0

    if (staticIds.length) {
      const time = timer()

      const { allGeneratedFiles } = await renderStaticEntries(staticIds, config)

      staticTime = time()
      staticFileAmount = allGeneratedFiles.length
    }

    if (dynamicIds.length || userConfig.onRequest) {
      const time = timer()

      await createDynamicEntry(dynamicIds, config)
      await compile(config)

      dynamicTime = time()

      formatLog({
        color: 'green',
        action: 'build',
        meta: '⚡︎' + dynamicTime,
        description: ''
      })
    }

    if (fs.existsSync(config.assets)) {
      const time = timer()

      fs.copySync(config.assets, path.join(config.output, 'static'))

      copyTime = time()
    }

    if (staticTime || dynamicTime || copyTime) {
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
    }
  }
}
