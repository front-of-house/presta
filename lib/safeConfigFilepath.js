import path from 'path'

import { debug } from './debug'
import { CWD } from './constants'

export function safeConfigFilepath (filepath) {
  try {
    return require.resolve(path.resolve(CWD, filepath))
  } catch (e) {
    debug('safeConfigFilepath', e.message)
    return null
  }
}
