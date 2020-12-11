import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import exit from 'exit'

import { CWD, CONFIG_DEFAULT } from './constants'
import { debug } from './debug'
import { log } from './log'

export function create (args) {
  const potentialConfigFilepath = path.join(CWD, args.config || CONFIG_DEFAULT)
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
    configFilepath,
    cwd: CWD,
    pages: [].concat(pages),
    output: path.resolve(CWD, output),
    assets: path.resolve(CWD, assets)
  }

  debug('config', config)

  return config
}
