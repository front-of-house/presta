import c from 'ansi-colors'
import exit from 'exit'

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
    exit()
  }

  // create initial entries
  let staticEntries = staticIds.map(id => createStaticEntry(id, config))

  createDynamicEntry(dynamicIds, config)

  options.onRenderStart()

  const { allGeneratedFiles } = await renderStaticEntries(staticEntries, {
    output: config.output
  })

  options.onRenderEnd({ count: allGeneratedFiles.length })
}
