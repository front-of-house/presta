import fs from 'fs'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import * as utils from '../utils'

const test = suite('presta - utils')

test('requireFresh', () => {
  const fixtures = afix({
    file: ['file.js', 'module.exports = { foo: true }'],
  })

  assert.equal(utils.requireFresh(fixtures.files.file.path).foo, true)

  fs.writeFileSync(fixtures.files.file.path, 'module.exports = { foo: false }', 'utf8')

  assert.equal(utils.requireFresh(fixtures.files.file.path).foo, false)
})

test('requireSafe', () => {
  const fixtures = afix({
    file: ['file.js', 'module.exports = { foo: true'],
  })

  assert.equal(utils.requireSafe(fixtures.files.file.path).foo, undefined)
})

test('hashContent', () => {
  assert.equal(utils.hashContent('foobar'), utils.hashContent('foobar'))
})

test('createLiveReloadScript', () => {
  const script = utils.createLiveReloadScript({ port: 4000 })
  assert.type(script, 'string')
  assert.ok(/localhost:4000/.test(script))
})

test.run()
