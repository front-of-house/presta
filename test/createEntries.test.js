import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { createStaticEntry, createDynamicEntry } from '../lib/createEntries'
import { OUTPUT_DYNAMIC_PAGES_ENTRY } from '../lib/constants'

export default (test, assert) => {
  test('createStaticEntry', () => {
    const files = {
      a: {
        url: './createStaticEntry/a.js',
        content: ''
      }
    }

    const fsx = fixtures.create(files)

    const config = {
      pages: './createStaticEntry/*.js',
      configFilepath: path.join(fixtures.getRoot(), 'presta-config.js')
    }

    const entry = createStaticEntry(fsx.files.a, config)

    assert(entry.sourceFile.includes('createStaticEntry/a.js'))
    assert(entry.entryFile.includes('createStaticEntry/a.js'))

    const contents = fs.readFileSync(entry.entryFile)
    assert(contents.includes('createStaticEntry/a.js'))
    assert(contents.includes('presta-config.js'))
  })

  test('createDynamicEntry', () => {
    const files = {
      a: {
        url: './createDynamicEntry/a.js',
        content: ''
      },
      b: {
        url: './createDynamicEntry/b.js',
        content: ''
      }
    }

    const fsx = fixtures.create(files)

    const config = {
      pages: './createDynamicEntry/*.js',
      output: 'output'
    }

    const entry = createDynamicEntry([fsx.files.a, fsx.files.b], config)

    assert(entry.includes(OUTPUT_DYNAMIC_PAGES_ENTRY))

    const contents = fs.readFileSync(entry)

    assert(contents.includes('createDynamicEntry/a.js'))
    assert(contents.includes('createDynamicEntry/b.js'))
  })
}
