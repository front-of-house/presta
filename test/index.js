console.time('test')

const test = require('baretest')('presta')
const assert = require('assert')

process.chdir('./fixtures')

require('./index.test').default(test, assert)
require('./load.test').default(test, assert)
require('./createConfigFromCLI.test').default(test, assert)
require('./createHeadTags.test').default(test, assert)
require('./encodeFilename.test').default(test, assert)
require('./createEntries.test').default(test, assert)
require('./getGlobCommonDirectory.test').default(test, assert)
require('./isStaticallyExportable.test').default(test, assert)
require('./getValidFilesArray.test').default(test, assert)
require('./pathnameToHtmlFile.test').default(test, assert)

!(async function () {
  await test.run()
  console.timeEnd('test')
})()
