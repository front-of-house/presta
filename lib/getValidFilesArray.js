const matched = require('matched')

const { ignoredFilesFilterer } = require('./ignore')

function getValidFilesArray (glob) {
  return matched.sync(glob).filter(ignoredFilesFilterer)
}

module.exports = { getValidFilesArray }
