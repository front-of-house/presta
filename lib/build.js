import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import exit from 'exit'

import { TMP_STATIC } from './constants'
import { debug } from './debug'
import { createStaticEntry, createDynamicEntry } from './createEntries'
import { log } from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { set as setConfig } from './config'
import { renderStaticEntries } from './renderStaticEntries'

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
    if (staticIds.length) {
      const staticEntries = staticIds.map(id =>
        createStaticEntry(id, TMP_STATIC, config)
      )

      // options.onRenderStart()

      const { allGeneratedFiles } = await renderStaticEntries(staticEntries, {
        output: config.output
      })

      // options.onRenderEnd({ count: allGeneratedFiles.length })
    }

    if (dynamicIds.length) {
      await createDynamicEntry(dynamicIds, config)
    }

    if (fs.existsSync(config.assets)) {
      fs.copySync(config.assets, path.join(config.output, 'static'))
    }
  }
}
