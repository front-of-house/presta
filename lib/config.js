import fs from 'fs-extra'
import path from 'path'
import assert from 'assert'
import c from 'ansi-colors'

import { CWD, CONFIG_DEFAULT } from './constants'
import { debug } from './debug'
import { safeRequire } from './safeRequire'
import { log } from './log'

let config = {}

export function set (c) {
  config = c
}

export function get () {
  return config
}

export function create (args) {
  const potentialConfigFilepath = path.join(CWD, args.config || CONFIG_DEFAULT)
  const configFilepath = fs.existsSync(potentialConfigFilepath)
    ? potentialConfigFilepath
    : null

  const configFile = safeRequire(configFilepath, {})
  const pages = args.pages || configFile.pages
  const output = args.output || configFile.output || 'build'
  const assets = args.assets || configFile.assets || 'public'

  if (!pages) {
    log(`  ${c.yellow('please specify where your pages are located')}`)
    throw ''
  }

  const c = {
    cwd: CWD,
    pages: [].concat(pages),
    output: path.resolve(CWD, output),
    assets: path.resolve(CWD, assets),
    configFilepath
  }

  config = c

  debug('config', c)

  return c
}
