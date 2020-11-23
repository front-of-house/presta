import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { createStaticEntry, createDynamicEntry } from '../lib/createEntries'
import { OUTPUT_DYNAMIC_PAGES_ENTRY } from '../lib/constants'

export default (test, assert) => {
  test('createStaticEntry', () => {
    const fsx = fixtures.create({
      a: {
        url: './createStaticEntry/a.js',
        content: ''
      }
    })
    const config = {
      pages: 'placeholder',
      configFilepath: path.join(fixtures.getRoot(), 'placeholder')
    }

    const entry = createStaticEntry(
      fsx.files.a,
      path.join(fixtures.getRoot(), 'createStaticEntry-dist'),
      config
    )

    assert(entry.sourceFile.includes('createStaticEntry/a.js'))
    assert(
      entry.entryFile.includes('createStaticEntry-dist/createStaticEntry/a.js')
    )

    fsx.cleanup()
  })

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
      output: 'output'
    }

    const entry = createDynamicEntry([fsx.files.a, fsx.files.b], config)

    assert(entry.includes(config.output))
    assert(entry.includes(OUTPUT_DYNAMIC_PAGES_ENTRY))

    fsx.cleanup()
  })
}
