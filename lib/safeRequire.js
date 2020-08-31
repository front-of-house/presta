const debug = require("debug")("presta");

function safeRequire(filepath, def) {
  try {
    return require(filepath)
  } catch (e) {
    debug('safeRequire', e.message)
    return def
  }
}

module.exports = { safeRequire }
