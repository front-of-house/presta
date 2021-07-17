import tap from 'tap'

import { pathnameToFile } from '../lib/renderStaticEntries'

tap.test('pathnameToFile', async (t) => {
  t.equal(pathnameToFile('/foo'), '/foo/index.html')
  t.equal(pathnameToFile('/foo/bar'), '/foo/bar/index.html')
  t.equal(pathnameToFile('/baz.html'), '/baz.html')
  t.equal(pathnameToFile('/baz.xml'), '/baz.xml')
  t.equal(pathnameToFile('/foo', 'json'), '/foo.json')
})
