const test = require('baretest')('presta')
const assert = require('assert')

require('./lib/__test__/createConfigFromCLI.test')(test, assert)

!(async function() {
  await test.run()
})()
