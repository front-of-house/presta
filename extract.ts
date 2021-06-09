import fs from 'fs-extra'
import path from 'path'
import assert from 'assert'

import { OUTPUT_STATIC_DIR } from './lib/constants'
import { getCurrentConfig } from './lib/config'

const keys = []

const hash = (str: string) => {
  var h = 5381,
    i = str.length

  while (i) h = (h * 33) ^ str.charCodeAt(--i)

  return (h >>> 0).toString(36)
}

export const extract = (raw: string, ext: string, key: string) => {
  assert(!!raw, 'Nothing to extract')
  assert(!!ext, 'Please specify an extension')
  assert(!!key, 'Please specify a key')

  const { env, cwd, merged: config } = getCurrentConfig()
  const PROD = env === 'production'

  const filename = PROD ? key + '-' + hash(raw) : key
  const publicPath = '/' + filename + '.' + ext

  fs.outputFileSync(
    path.join(config.output, OUTPUT_STATIC_DIR, publicPath),
    raw
  )

  return publicPath
}

export const css = (raw: string, key: string) => {
  return extract(raw, 'css', key)
}

export const js = (raw: string, key: string) => {
  return extract(raw, 'js', key)
}
