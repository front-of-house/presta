import fs from 'fs-extra'
import path from 'path'
import { PRESTA_DIR } from './constants'

let config = {}

export function set (c) {
  config = c
  fs.outputFileSync(
    path.join(PRESTA_DIR, 'config.json'),
    JSON.stringify(config)
  )
}

export function get () {
  return config
}
