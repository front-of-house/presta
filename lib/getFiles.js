const fs = require('fs-extra')
const path = require('path')
const matched = require('matched')

function isDynamic (file) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file, 'utf-8'))
}

function isStatic (file) {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file, 'utf-8'))
}

function getFiles ({ cwd, files }) {
  return []
    .concat(files)
    .map(file => path.resolve(cwd, file)) // make absolute
    .map(glob => matched.sync(glob, { cwd }))
    .flat()
}

module.exports = {
  isDynamic,
  isStatic,
  getFiles
}
