import fs from 'fs-extra'
import path from 'path'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { debug } from './debug'
import * as templates from './templates'

export function createDynamicEntry (sourceFiles, config) {
  const entryFile = path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)

  fs.outputFileSync(
    entryFile,
    templates.dynamic({ sourceFiles, configFilepath: config.configFilepath })
  )

  debug('created entry', entryFile)

  return entryFile
}
