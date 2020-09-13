const path = require('path')
const fs = require('fs-extra')

const cwd = './testApp'

fs.ensureDir(cwd)
fs.outputFileSync(
  path.join(cwd, 'presta.config.js'),
  `module.exports = {
  pages: './pages/**/*.js',
  output: './build',
}`
)
fs.outputFileSync(
  path.join(cwd, '/pages/Root.js'),
  `module.exports = 'Root.js'`
)
