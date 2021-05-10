const fs = require('fs-extra')
const path = require('path')

const fixtures = require('./fixtures')

const { createConfig } = require('../lib/config')
const { createDynamicEntry } = require('../lib/createDynamicEntry')

module.exports = (test, assert) => {
  test('createDynamicEntry', () => {
    const fsx = fixtures.create({
      a: {
        url: './createDynamicEntry/a.js',
        content: ''
      },
      b: {
        url: './createDynamicEntry/b.js',
        content: ''
      }
    })
    const config = createConfig({
      cliArgs: {
        files: './createDynamicEntry/*.js',
        output: path.join(fixtures.getRoot(), 'output')
      }
    })

    const entry = createDynamicEntry([fsx.files.a, fsx.files.b], config)

    assert(entry.includes(config.merged.output))

    fsx.cleanup()
  })
}
