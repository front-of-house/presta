const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')

const { OUTPUT_STATIC_DIR } = require('./lib/constants')
const { getCurrentConfig } = require('./lib/config')

const keys = []

function hash (str) {
  var h = 5381,
    i = str.length

  while (i) h = (h * 33) ^ str.charCodeAt(--i)

  return (h >>> 0).toString(36)
}

function extract (raw, ext, key) {
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

function css (raw, key) {
  return extract(raw, 'css', key)
}

function js (raw, key) {
  return extract(raw, 'js', key)
}

module.exports = {
  extract,
  css,
  js
}
