const fs = require('fs-extra')
const path = require('path')
const matched = require('matched')

function isDynamic (file) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file, 'utf-8'))
}

function isStatic (file) {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file, 'utf-8'))
}

function isPrestaFile (file) {
  return isStatic(file) || isDynamic(file)
}

function getFiles (config) {
  return []
    .concat(config.merged.files)
    .map(file => path.resolve(config.cwd, file)) // make absolute
    .map(glob => matched.sync(glob, { cwd: config.cwd }))
    .flat()
}

module.exports = {
  isPrestaFile,
  isDynamic,
  isStatic,
  getFiles
}
