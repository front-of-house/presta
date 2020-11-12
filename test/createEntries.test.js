import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES } from '../lib/constants'
import { createEntries } from '../lib/createEntries'

export default (test, assert) => {
  test('createEntries', () => {
    const entries = createEntries({
      pages: 'pages/*.js'
    })

    const entry = entries[0]

    assert(entry.id === '@pages@A')
    assert(entry.sourceFile.includes('A.js'))
    assert(entry.generatedFile.includes('A.js'))
    assert(fs.existsSync(entry.generatedFile))
    assert(fs.readFileSync(entry.generatedFile).includes('A.js'))
  })

  test('createEntries - config', () => {
    const entry = createEntries({
      pages: 'pages/*.js',
      configFilepath: 'presta-config.js'
    })[0]

    assert(fs.readFileSync(entry.generatedFile).includes('presta-config.js'))
  })
}
