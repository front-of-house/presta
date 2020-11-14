console.time('test')

const fs = require('fs-extra')
const test = require('baretest')('presta')
const assert = require('assert')
const path = require('path')

const fixtures = require('./fixtures')

export const root = path.join(__dirname, 'fixtures')

fs.ensureDirSync(root)
process.chdir(root)
fixtures.setRoot(root)

require('./index.test').default(test, assert)
require('./load.test').default(test, assert)
require('./config.test').default(test, assert)
require('./getFiles.test').default(test, assert)
require('./createHeadTags.test').default(test, assert)
require('./createEntries.test').default(test, assert)
require('./pathnameToHtmlFile.test').default(test, assert)
require('./head.test').default(test, assert)
require('./document.test').default(test, assert)

!(async function () {
  await test.run()
  console.timeEnd('test')
})()
