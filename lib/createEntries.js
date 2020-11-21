import fs from 'fs-extra'
import path from 'path'

import { CWD, TMP_DYNAMIC, OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { debug } from './debug'
import * as templates from './templates'

export function createStaticEntry (sourceFile, outDir, config) {
  const entryFile = path.join(outDir, sourceFile.replace(CWD, ''))

  fs.outputFileSync(
    entryFile,
    templates.stat({ sourceFile, configFilepath: config.configFilepath })
  )

  debug('created entry', entryFile)

  return {
    sourceFile,
    entryFile
  }
}

export function createDynamicEntry (sourceFiles, config) {
  const entryFile = path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)

  fs.outputFileSync(
    entryFile,
    templates.dynamic({ sourceFiles, configFilepath: config.configFilepath })
  )

  debug('created entry', entryFile)

  return entryFile
}
