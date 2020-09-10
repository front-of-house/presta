const fs = require('fs')
const path = require('path')
const debug = require('debug')('presta')

const { CWD } = require('./constants')

function safeConfigFilepath (filepath) {
  try {
    return require.resolve(path.join(CWD, filepath))
  } catch (e) {
    debug('safeConfigFilepath', e.message)
    return null
  }
}

module.exports = { safeConfigFilepath }
