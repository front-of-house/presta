import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { createStaticEntry, createDynamicEntry } from '../lib/createEntries'

export default (test, assert) => {
  test('createStaticEntry', () => {
    const config = {
      pages: './createEntries/*.js',
      configFilepath: path.join(fixtures.getRoot(), 'presta-config.js')
      // filepath
    }

    const filepath = path.join(fixtures.getRoot(), '/createEntries/a.js')

    const entry = createStaticEntry(filepath, config)

    assert(entry.sourceFile.includes('createEntries/a.js'))
    assert(entry.entryFile.includes('createEntries/a.js'))

    const contents = fs.readFileSync(entry.entryFile)
    assert(contents.includes('createEntries/a.js'))
    assert(contents.includes('presta-config.js'))
  })

  test('createDynamicEntry', () => {
    const config = {
      pages: './createEntries/*.js',
      configFilepath: path.join(fixtures.getRoot(), 'presta-config.js')
    }

    const a = path.join(fixtures.getRoot(), '/createEntries/a.js')
    const b = path.join(fixtures.getRoot(), '/createEntries/b.js')

    const entry = createDynamicEntry([a, b], config)

    assert(entry.includes('presta.js'))

    const contents = fs.readFileSync(entry)

    assert(contents.includes('createEntries/a.js'))
    assert(contents.includes('createEntries/b.js'))
    assert(contents.includes('presta-config.js'))
  })
}
