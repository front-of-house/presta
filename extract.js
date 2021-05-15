const fs = require('fs-extra')
const path = require('path')
const callsites = require('callsites')

const { OUTPUT_STATIC_DIR } = require('./lib/constants')
const { getCurrentConfig } = require('./lib/config')

function hash (str) {
  var h = 5381,
    i = str.length

  while (i) h = (h * 33) ^ str.charCodeAt(--i)

  return (h >>> 0).toString(36)
}

function base (raw, ext, key) {
  const { env, cwd, merged: config } = getCurrentConfig()
  const PROD = env === 'production'

  // important: if you call base() directly, this callsites index will be incorrect
  key = key || path.basename(callsites()[3].getFileName()).split('.')[0]

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

// facade to enable callsites usage
function extract (raw, ext, key) {
  return base(raw, ext, key)
}

module.exports = {
  extract,
  css,
  js
}
