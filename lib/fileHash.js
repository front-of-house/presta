import fs from 'fs-extra'
import path from 'path'
import rev from 'rev-hash'

import { PRESTA_DIR } from './constants'
import { safeRequire } from './safeRequire'

const fileHash = safeRequire(path.join(PRESTA_DIR, 'hash.json'), {})

export function save () {
  fs.writeFileSync(path.join(PRESTA_DIR, 'hash.json'), JSON.stringify(fileHash))
}

export function get (id) {
  return fileHash[id]
}

export function set (id, value, extra = {}) {
  fileHash[id] = {
    ...(fileHash[id] || {}),
    rev: value,
    ...extra
  }
}

export function remove (id) {
  delete fileHash[id]
}

export function hash (filepath) {
  return rev(fs.readFileSync(filepath, 'utf-8'))
}

export function keys () {
  return Object.keys(fileHash)
}
