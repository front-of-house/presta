import path from 'path'
import assert from 'assert'

import { debug } from './debug'
import { CWD } from './constants'
import { safeConfigFilepath } from './safeConfigFilepath'
import { safeRequire } from './safeRequire'

export function createConfigFromCLI (args) {
  const configFilepath = safeConfigFilepath(args.config)
  const configFile = safeRequire(configFilepath, {})

  const pages = args.pages || configFile.pages
  const output = args.output || configFile.output || 'build'

  assert(!!pages, `presta - please provide pages to render`)

  const config = {
    cwd: CWD,
    pages,
    output: path.resolve(CWD, output),
    configFilepath
  }

  debug('config', config)

  return config
}
