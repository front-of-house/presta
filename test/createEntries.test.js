import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES } from '../lib/constants'
import { createStaticEntries } from '../lib/createEntries'

export default (test, assert) => {
  test('createEntries', () => {
    const entries = createStaticEntries({
      pages: 'pages/*.js'
    })

    const entry = entries[0]

    assert(entry.id.includes('@fixtures@pages@A'))
    assert(entry.sourceFile.includes('A.js'))
    assert(entry.entryFile.includes('A.js'))
    assert(fs.existsSync(entry.entryFile))
    assert(fs.readFileSync(entry.entryFile).includes('A.js'))
  })

  test('createEntries - config', () => {
    const entry = createStaticEntries({
      pages: 'pages/*.js',
      configFilepath: 'presta-config.js'
    })[0]

    assert(fs.readFileSync(entry.entryFile).includes('presta-config.js'))
  })
}
