import fs from 'fs-extra'
import path from 'path'
import assert from 'assert'
import c from 'ansi-colors'

import { CWD, CONFIG_DEFAULT } from './constants'
import { debug } from './debug'
import { safeRequire } from './safeRequire'
import { log } from './log'

export function create (args) {
  const potentialConfigFilepath = path.join(CWD, args.config || CONFIG_DEFAULT)
  const configFilepath = fs.existsSync(potentialConfigFilepath)
    ? potentialConfigFilepath
    : null

  const configFile = safeRequire(configFilepath, {})
  const pages = args.pages || configFile.pages
  const output = args.output || configFile.output || 'build'

  if (!pages) {
    log(`  ${c.yellow('please specify where your pages are located')}`)
    throw ''
  }

  const config = {
    cwd: CWD,
    pages: [].concat(pages),
    output: path.resolve(CWD, output),
    configFilepath
  }

  debug('config', config)

  return config
}
