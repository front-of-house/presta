require('./__test__/fixtures')

const test = require('baretest')('presta')
const assert = require('assert')

process.chdir('testApp')

require('./__test__/index.test')(test, assert)
require('./__test__/load.test')(test, assert)
require('./lib/__test__/createConfigFromCLI.test')(test, assert)
require('./lib/__test__/createHeadTags.test')(test, assert)
require('./lib/__test__/encodeFilename.test')(test, assert)
require('./lib/__test__/createEntries.test')(test, assert)
require('./lib/__test__/getGlobCommonDirectory.test')(test, assert)
require('./lib/__test__/isStaticallyExportable.test')(test, assert)
require('./lib/__test__/getValidFilesArray.test')(test, assert)
require('./lib/__test__/pathnameToHtmlFile.test')(test, assert)

!(async function () {
  console.time('test')
  await test.run()
  console.timeEnd('test')
})()
