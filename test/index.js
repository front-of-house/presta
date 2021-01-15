console.time('test')

require('@babel/polyfill')
require('@babel/register')({
  presets: [require.resolve('@babel/preset-env')]
})

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

const root = path.join(__dirname, '../fixtures')

fs.ensureDirSync(root)
process.chdir(root)
fixtures.setRoot(root)

require('./load.test')(test, assert)
require('./config.test')(test, assert)
require('./getFiles.test')(test, assert)
require('./createHeadTags.test')(test, assert)
require('./createDynamicEntry.test')(test, assert)
require('./pathnameToHtmlFile.test')(test, assert)
require('./head.test')(test, assert)
require('./document.test')(test, assert)
// require('./renderStaticEntries.test')(test, assert)
require('./build.test')(test, assert)
require('./router.test')(test, assert)
require('./getRouteParams.test')(test, assert)
require('./defaultCreateContent.test')(test, assert)

!(async function () {
  await test.run()
  console.timeEnd('test')
})()
