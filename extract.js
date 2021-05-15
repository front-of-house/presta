const fs = require('fs')
const path = require('path')

const { OUTPUT_STATIC_DIR } = require('./lib/constants')
const { getCurrentConfig } = require('./lib/config')

function hash (str) {
  var h = 5381,
    i = str.length

  while (i) h = (h * 33) ^ str.charCodeAt(--i)

  return (h >>> 0).toString(36)
}

function extract (raw, ext, key = '') {
  const { env, cwd, merged: config } = getCurrentConfig()
  const PROD = env === 'production'

  let filename = key

  if (PROD) {
    if (key) {
      filename = key + '-' + hash(raw)
    } else {
      filename = hash(raw)
    }
  } else if (!PROD && !key) {
    filename = hash(raw)
  }

  const publicPath = '/' + filename + '.' + ext

  fs.writeFileSync(path.join(config.output, OUTPUT_STATIC_DIR, publicPath), raw)

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
