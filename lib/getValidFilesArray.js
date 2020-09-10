const matched = require('matched')

const { isStaticallyExportable } = require('./isStaticallyExportable')
const { ignoredFilesFilterer } = require('./ignore')

function getValidFilesArray (glob) {
  return matched
    .sync(glob)
    .filter(ignoredFilesFilterer)
    .filter(isStaticallyExportable)
}

module.exports = { getValidFilesArray }
