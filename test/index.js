console.time('test')

require('@babel/register')({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: '12' },
        useBuiltIns: 'usage',
        corejs: '3.6'
      }
    ]
  ]
})

const path = require('path')

// proxy self back to self
require('module-alias').addAliases({
  // 'presta/html': path.join(__dirname, '../html')
})

const fs = require('fs-extra')
const test = require('baretest')('presta')
const assert = require('assert')

const fixtures = require('./fixtures')

const root = path.join(__dirname, '../fixtures')

fs.ensureDirSync(root)
process.chdir(root)
fixtures.setRoot(root)

require('./config.test')(test, assert)
require('./getFiles.test')(test, assert)
require('./createHeadTags.test')(test, assert)
require('./createDynamicEntry.test')(test, assert)
require('./pathnameToFile.test')(test, assert)
require('./html.test')(test, assert)
// require('./renderStaticEntries.test')(test, assert)
require('./build.test')(test, assert)
require('./router.test')(test, assert)
require('./getRouteParams.test')(test, assert)
require('./normalizeResponse.test')(test, assert)

!(async function () {
  await test.run()
  console.timeEnd('test')
})()
