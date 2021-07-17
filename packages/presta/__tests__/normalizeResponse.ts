import tap from 'tap'

import { normalizeResponse } from '../lib/normalizeResponse'

tap.test('normalizeResponse - string', async (t) => {
  const res = normalizeResponse('body')
  t.ok(res.headers && String(res.headers['Content-Type']).includes('text/html'))
  t.equal(res.body, 'body')
})

tap.test('normalizeResponse - html', async (t) => {
  const res = normalizeResponse({
    html: 'body',
  })
  t.ok(res.headers && String(res.headers['Content-Type']).includes('text/html'))
  t.equal(res.body, 'body')
})

tap.test('normalizeResponse - json', async (t) => {
  const json = { foo: true }
  const res = normalizeResponse({ json })
  t.ok(res.headers && String(res.headers['Content-Type']).includes('application/json'))
  t.equal(res.body, JSON.stringify(json))
})

tap.test('normalizeResponse - xml', async (t) => {
  const xml = '</>'
  const res = normalizeResponse({ xml })
  t.ok(res.headers && String(res.headers['Content-Type']).includes('application/xml'))
  t.equal(res.body, xml)
})

tap.test('normalizeResponse - statusCode', async (t) => {
  const res = normalizeResponse({ statusCode: 400 })
  t.equal(res.statusCode, 400)
})

tap.test('normalizeResponse - headers', async (t) => {
  const res = normalizeResponse({ headers: { Host: 'foo' } })
  t.ok(res.headers && res.headers.Host === 'foo')
})

tap.test('normalizeResponse - multiValueHeaders', async (t) => {
  const res = normalizeResponse({
    multiValueHeaders: { 'Set-Cookie': ['foo', 'bar'] },
  })
  t.ok(res.multiValueHeaders && res.multiValueHeaders['Set-Cookie'][0] === 'foo')
})
