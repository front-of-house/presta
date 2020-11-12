const path = require('path')
const matched = require('matched')

const { CWD } = require('./constants')
const { isStaticallyExportable } = require('./isStaticallyExportable')
const { ignoredFilesFilterer } = require('./ignore')

function getValidFilesArray (...globs) {
  return globs
    .flat()
    .map(glob => matched.sync(glob))
    .flat()
    .map(file => path.relative(CWD, file)) // @see #14
    .filter(ignoredFilesFilterer)
    .filter(isStaticallyExportable)
}

module.exports = { getValidFilesArray }
