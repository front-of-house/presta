const path = require('path')

const cwd = process.cwd()

const fileCache = require('flat-cache').load(
  'presta',
  path.resolve(cwd, './.presta/cache')
)

module.exports = {
  fileCache
}
