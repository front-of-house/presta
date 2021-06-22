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

require('./config.test')(test, assert)
require('./getFiles.test')(test, assert)
require('./createHeadTags.test').default(test, assert)
require('./createDynamicEntry.test')(test, assert)
require('./pathnameToFile.test')(test, assert)
require('./html.test')(test, assert)
// require('./renderStaticEntries.test')(test, assert)
require('./build.test').default(test, assert)
require('./router.test')(test, assert)
require('./getRouteParams.test')(test, assert)
require('./normalizeResponse.test')(test, assert)
require('./load.test')(test, assert)
require('./loadCache.test')(test, assert)
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
