import fs from 'fs-extra'
import path from 'path'

import * as logger from './log'

import type { Presta } from '..'

export function removeBuiltStaticFile (file: string, config: Presta) {
  logger.debug({
    label: 'debug',
    message: `removing old static file ${file}`,
  })

  fs.remove(path.join(config.staticOutputDir, file))
}
