import fs from 'fs-extra'
import path from 'path'
import assert from 'assert'

import { CWD, PRESTA_DIR } from './constants'
import { debug } from './debug'
import { safeConfigFilepath } from './safeConfigFilepath'
import { safeRequire } from './safeRequire'

let config = {}

export function get () {
  return config
}

export function create (args) {
  const configFilepath = safeConfigFilepath(args.config)
  const configFile = safeRequire(configFilepath, {})

  const pages = args.pages || configFile.pages
  const output = args.output || configFile.output || 'build'

  assert(!!pages, `presta - please provide pages to render`)

  config = {
    cwd: CWD,
    pages,
    output: path.resolve(CWD, output),
    configFilepath
  }

  // TODO need this? might be helpful...
  fs.outputFileSync(
    path.join(PRESTA_DIR, 'config.json'),
    JSON.stringify(config)
  )

  debug('config', config)

  return config
}
