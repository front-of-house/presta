import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES } from '../lib/constants'
import { createEntries } from '../lib/createEntries'

const sourceFile = path.join(CWD, '/pages/Root.js')
const generatedFile = path.join(PRESTA_WRAPPED_PAGES, 'Root.js')

export default (test, assert) => {
  test('createEntries', () => {
    const entries = createEntries({
      filesArray: [sourceFile],
      baseDir: path.join(CWD, '/pages')
    })

    const entry = entries[0]

    assert(entry.id === '@Root')
    assert(entry.sourceFile === sourceFile)
    assert(entry.generatedFile === generatedFile)
    assert(fs.existsSync(generatedFile))
    assert(fs.readFileSync(generatedFile).includes(sourceFile))
  })

  test('createEntries - config', () => {
    createEntries({
      filesArray: [sourceFile],
      baseDir: path.join(CWD, '/pages'),
      configFilepath: 'presta-config.js'
    })

    assert(fs.readFileSync(generatedFile).includes('presta-config.js'))
  })
}
