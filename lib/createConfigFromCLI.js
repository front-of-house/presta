import path from 'path'
import assert from 'assert'

import { debug } from './debug'
import { CWD } from './constants'
import { getGlobCommonDirectory } from './getGlobCommonDirectory'
import { safeConfigFilepath } from './safeConfigFilepath'
import { safeRequire } from './safeRequire'

export function createConfigFromCLI (args) {
  const configFilepath = safeConfigFilepath(args.config)
  const configFile = safeRequire(configFilepath, {})
  const runtimeFilepath = safeConfigFilepath(args.runtime)
  const input = args.pages || configFile.pages
  const output = args.output || configFile.output || 'build'

  assert(!!input, `presta - please provide pages to render`)

  const config = {
    input,
    output: path.join(CWD, output),
    baseDir: path.resolve(CWD, getGlobCommonDirectory(input)),
    configFilepath,
    runtimeFilepath
  }

  debug('config', config)

  return config
}
