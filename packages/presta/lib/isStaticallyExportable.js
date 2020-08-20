const fs = require('fs-extra')

function isStaticallyExportable(file) {
  return /export\s.+\sgetPaths/.test(fs.readFileSync(file));
}

module.exports = { isStaticallyExportable }
