import { pathnameToHtmlFile } from '../lib/pathnameToHtmlFile'

export default async function (test, assert) {
  test('pathnameToHtmlFile', async () => {
    assert(pathnameToHtmlFile('/foo') === '/foo/index.html')
    assert(pathnameToHtmlFile('/foo/bar') === '/foo/bar/index.html')
    assert(pathnameToHtmlFile('/baz.html') === '/baz.html')
  })
}
