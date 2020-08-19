const path = require('path')

const { CWD } = require('./constants')

function safeConfigFilepath (filepath) {
  try {
    return require.resolve(path.join(CWD, filepath))
  } catch (e) {
    return null
  }
}

module.exports = { safeConfigFilepath }
