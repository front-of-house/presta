const fs = require('fs-extra')
const path = require('path')

const { CWD, PRESTA_WRAPPED_PAGES } = require('../constants')
const { createEntries } = require('../createEntries')

const sourceFile = path.join(CWD, '/pages/Root.js')
const generatedFile = path.join(PRESTA_WRAPPED_PAGES, 'Root.js')

module.exports = (test, assert) => {
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

  test('createEntries - runtime', () => {
    createEntries({
      filesArray: [sourceFile],
      baseDir: path.join(CWD, '/pages'),
      runtimeFilepath: 'presta-runtime.js'
    })

    assert(fs.readFileSync(generatedFile).includes('presta-runtime.js'))
  })
}
