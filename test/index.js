console.time('test')

require('esbuild-register/dist/node').register()

const path = require('path')

// proxy self back to self
require('module-alias').addAliases({
  '@': process.cwd(),
  'presta:internal': path.join(__dirname, '..')
})

const fs = require('fs-extra')
const test = require('baretest')('presta')
const assert = require('assert')

const fixtures = require('./fixtures')
const { createConfig, _clearCurrentConfig, Env } = require('../lib/config')

const root = path.join(__dirname, '../fixtures')

fs.ensureDirSync(root)
process.chdir(root)
fixtures.setRoot(root)

require('./config.test').default(test, assert)
require('./getFiles.test').default(test, assert)
require('./createHeadTags.test').default(test, assert)
require('./outputLambdas.test').default(test, assert)
require('./pathnameToFile.test').default(test, assert)
require('./html.test').default(test, assert)
require('./build.test').default(test, assert)
require('./getRouteParams.test').default(test, assert)
require('./normalizeResponse.test').default(test, assert)
require('./load.test').default(test, assert)
require('./loadCache.test').default(test, assert)
require('./extract.test').default(test, assert)

!(async function () {
  createConfig({ env: Env.TEST })

  test.before(() => {
    _clearCurrentConfig()
  })

  test.after(() => {
    fs.removeSync(fixtures.getRoot())
  })

  await test.run()

  console.timeEnd('test')
})()
