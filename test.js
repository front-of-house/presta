const test = require('baretest')('presta')
const assert = require('assert')

require('./__test__/load.test')(test, assert)
// require('./lib/__test__/createConfigFromCLI.test')(test, assert)
require('./lib/__test__/createHeadTags.test')(test, assert)

!(async function() {
  console.time('test')
  await test.run()
  console.timeEnd('test')
})()
