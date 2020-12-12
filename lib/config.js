import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import exit from 'exit'

import { CONFIG_DEFAULT } from './constants'
import { debug } from './debug'
import { log } from './log'

const actualCwd = process.cwd()

export function create (args) {
  const cwd = args.cwd ? path.resolve(actualCwd, args.cwd) : actualCwd

  require('module-alias').addAliases({ '@': cwd })

  const potentialConfigFilepath = path.join(cwd, args.config || CONFIG_DEFAULT)
  const configFilepath = fs.existsSync(potentialConfigFilepath)
    ? potentialConfigFilepath
    : null

  let configFile = {}

  try {
    configFile = configFilepath ? require(configFilepath) : {}
  } catch (e) {
    log(`${c.red('~ error')} ${configFilepath}\n\n  > ${e.stack || e}\n`)
  }

  const pages = args.pages || configFile.pages
  const output = args.output || configFile.output || 'build'
  const assets = args.assets || configFile.assets || 'public'

  if (!pages) {
    log(c.yellow('~ please specify where your pages are located\n'))

    if (process.env.NODE_ENV === 'test') {
      throw ''
    } else {
      exit()
    }
  }

  const config = {
    ...configFile,
    cwd,
    configFilepath,
    pages: [].concat(pages),
    output: path.resolve(cwd, output),
    assets: path.resolve(cwd, assets)
  }

  debug('config', config)

  return config
}
