import fs from 'fs-extra'
import path from 'path'

import { debug } from './debug'

import type { Presta } from '../'

export function removeBuiltStaticFile (file: string, config: Presta) {
  debug('removing static file', file)
  fs.remove(path.join(config.staticOutputDir, file))
}
