console.time('test')

const path = require('path')

// proxy self back to self
require('module-alias').addAliases({
  'presta/load': path.join(__dirname, '../load'),
  'presta/document': path.join(__dirname, '../document'),
  'presta/render': path.join(__dirname, '../render')
})

const fs = require('fs-extra')
const test = require('baretest')('presta')
const assert = require('assert')

const fixtures = require('./fixtures')

export const root = path.join(__dirname, '../fixtures')

fs.ensureDirSync(root)
process.chdir(root)
fixtures.setRoot(root)

require('./load.test').default(test, assert)
require('./config.test').default(test, assert)
require('./getFiles.test').default(test, assert)
require('./createHeadTags.test').default(test, assert)
require('./createDynamicEntry.test').default(test, assert)
require('./pathnameToHtmlFile.test').default(test, assert)
require('./head.test').default(test, assert)
require('./document.test').default(test, assert)
// require('./renderStaticEntries.test').default(test, assert)
require('./build.test').default(test, assert)
require('./router.test').default(test, assert)
require('./getRouteParams.test').default(test, assert)
require('./defaultCreateContent.test').default(test, assert)

!(async function () {
  await test.run()
  console.timeEnd('test')
})()
