const fs = require('fs-extra')
const path = require('path')

const { OUTPUT_STATIC_DIR } = require('./constants')

function removeBuiltStaticFile (file, config) {
  debug('removing static file', file)
  fs.remove(path.join(config.merged.output, OUTPUT_STATIC_DIR, file))
}

module.exports = { removeBuiltStaticFile }
