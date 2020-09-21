import { debug } from './debug'

export function safeRequire (filepath, def) {
  try {
    return require(filepath)
  } catch (e) {
    debug('safeRequire', e.message)
    return def
  }
}
