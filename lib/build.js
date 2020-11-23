import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import exit from 'exit'

import { TMP_STATIC } from './constants'
import { debug } from './debug'
import { createStaticEntry, createDynamicEntry } from './createEntries'
import { log, formatLog } from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { set as setConfig } from './config'
import { renderStaticEntries } from './renderStaticEntries'
import { timer } from './timer'

export async function build (config, options = {}) {
  debug('watch initialized with config', config)

  /*
   * Set computed config for later use
   */
  setConfig(config)

  const staticIds = getFiles(config.pages).filter(isStatic)
  let dynamicIds = getFiles(config.pages).filter(isDynamic)

  if (!staticIds.length && !dynamicIds.length) {
    log(`  ${c.gray('nothing to build')}\n`)
  } else {
    let staticTime = 0
    let staticFileAmount = 0
    let dynamicTime = 0
    let copyTime = 0

    if (staticIds.length) {
      const staticEntries = staticIds.map(id =>
        createStaticEntry(id, TMP_STATIC, config)
      )

      const time = timer()

      const { allGeneratedFiles } = await renderStaticEntries(staticEntries, {
        output: config.output
      })

      staticTime = time()
      staticFileAmount = allGeneratedFiles.length
    }

    if (dynamicIds.length) {
      const time = timer()

      await createDynamicEntry(dynamicIds, config)

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
      console.log('')

      if (staticTime) {
        log(
          `  ${c.blue(`static`)} ${c.gray(
            `built ${staticFileAmount} files in ${staticTime}`
          )}`
        )
      }

      if (dynamicTime) {
        log(
          `  ${c.blue(`dynamic`)} ${c.gray(`built function in ${dynamicTime}`)}`
        )
      }

      if (copyTime) {
        log(`  ${c.blue(`copied`)} ${c.gray(`static assets in ${copyTime}`)}`)
      }
    }
  }
}
