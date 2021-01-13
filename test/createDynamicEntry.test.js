const fs = require('fs-extra')
const path = require('path')

const fixtures = require('./fixtures')

const { createDynamicEntry } = require('../lib/createDynamicEntry')
const { OUTPUT_DYNAMIC_PAGES_ENTRY } = require('../lib/constants')

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
    const config = {
      pages: './createDynamicEntry/*.js',
      output: 'output',
      dynamicEntryFilepath: path.join(
        fixtures.getRoot(),
        'output',
        OUTPUT_DYNAMIC_PAGES_ENTRY
      )
    }

    const entry = createDynamicEntry([fsx.files.a, fsx.files.b], config)

    assert(entry.includes(config.output))
    assert(entry.includes(OUTPUT_DYNAMIC_PAGES_ENTRY))

    fsx.cleanup()
  })
}
