const { pathnameToHtmlFile } = require('../lib/pathnameToHtmlFile')

module.exports = async function (test, assert) {
  test('pathnameToHtmlFile', async () => {
    assert(pathnameToHtmlFile('/foo') === '/foo/index.html')
    assert(pathnameToHtmlFile('/foo/bar') === '/foo/bar/index.html')
    assert(pathnameToHtmlFile('/baz.html') === '/baz.html')
    assert(pathnameToHtmlFile('/baz.xml') === '/baz.xml')
  })
}
