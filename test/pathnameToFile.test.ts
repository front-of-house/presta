import { pathnameToFile } from '../lib/pathnameToFile'

export default async function (test, assert) {
  test('pathnameToFile', async () => {
    assert(pathnameToFile('/foo') === '/foo/index.html')
    assert(pathnameToFile('/foo/bar') === '/foo/bar/index.html')
    assert(pathnameToFile('/baz.html') === '/baz.html')
    assert(pathnameToFile('/baz.xml') === '/baz.xml')
    assert(pathnameToFile('/foo', 'json') === '/foo.json')
  })
}
