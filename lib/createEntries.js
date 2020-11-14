import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES, PRESTA_FUNCTIONS } from './constants'
import { debug } from './debug'
import * as templates from './templates'

export function createStaticEntry(sourceFile, config) {
  const entryFile = path.join(PRESTA_WRAPPED_PAGES, sourceFile.replace(CWD, ''))

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
  const entryFile = path.join(PRESTA_FUNCTIONS, 'presta.js')

  fs.outputFileSync(
    entryFile,
    templates.dynamic({ sourceFiles, configFilepath: config.configFilepath })
  )

  debug('created entry', entryFile)

  return entryFile
}
