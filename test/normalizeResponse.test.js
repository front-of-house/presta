const { normalizeResponse } = require('../lib/normalizeResponse')

module.exports = async function (test, assert) {
  test('normalizeResponse - string', async () => {
    const res = normalizeResponse('body')
    assert(res.headers['Content-Type'].includes('text/html'))
    assert(res.body === 'body')
  })

  test('normalizeResponse - html', async () => {
    const res = normalizeResponse({
      html: 'body'
    })
    assert(res.headers['Content-Type'].includes('text/html'))
    assert(res.body === 'body')
  })

  test('normalizeResponse - json', async () => {
    const json = { foo: true }
    const res = normalizeResponse({ json })
    assert(res.headers['Content-Type'].includes('application/json'))
    assert(res.body === JSON.stringify(json))
  })

  test('normalizeResponse - xml', async () => {
    const xml = '</>'
    const res = normalizeResponse({ xml })
    assert(res.headers['Content-Type'].includes('application/xml'))
    assert(res.body === xml)
  })

  test('normalizeResponse - statusCode', async () => {
    const res = normalizeResponse({ statusCode: 400 })
    assert(res.statusCode === 400)
  })

  test('normalizeResponse - headers', async () => {
    const res = normalizeResponse({ headers: { Host: 'foo' } })
    assert(res.headers.Host === 'foo')
  })

  test('normalizeResponse - multiValueHeaders', async () => {
    const res = normalizeResponse({
      multiValueHeaders: { 'Set-Cookie': ['foo', 'bar'] }
    })
    assert(res.multiValueHeaders['Set-Cookie'][0] === 'foo')
  })
}
