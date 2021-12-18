import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { pathnameToFile } from '../renderStaticEntries'

const test = suite('presta - pathnameToFile')

test('pathnameToFile', async () => {
  assert.equal(pathnameToFile('/foo'), '/foo/index.html')
  assert.equal(pathnameToFile('/foo/bar'), '/foo/bar/index.html')
  assert.equal(pathnameToFile('/baz.html'), '/baz.html')
  assert.equal(pathnameToFile('/baz.xml'), '/baz.xml')
  assert.equal(pathnameToFile('/foo', 'json'), '/foo.json')
})

test.run()
