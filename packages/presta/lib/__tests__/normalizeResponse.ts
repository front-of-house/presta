import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { normalizeResponse } from '../normalizeResponse'

const test = suite('presta - normalizeResponse')

test('normalizeResponse - string', async () => {
  const res = normalizeResponse('body')
  assert.ok(res.headers && String(res.headers['content-type']).includes('text/html'))
  assert.equal(res.body, 'body')
})

test('normalizeResponse - html', async () => {
  const res = normalizeResponse({
    html: 'body',
  })
  assert.ok(res.headers && String(res.headers['content-type']).includes('text/html'))
  assert.equal(res.body, 'body')
})

test('normalizeResponse - json', async () => {
  const json = { foo: true }
  const res = normalizeResponse({ json })
  assert.ok(res.headers && String(res.headers['content-type']).includes('application/json'))
  assert.equal(res.body, JSON.stringify(json))
})

test('normalizeResponse - xml', async () => {
  const xml = '</>'
  const res = normalizeResponse({ xml })
  assert.ok(res.headers && String(res.headers['content-type']).includes('application/xml'))
  assert.equal(res.body, xml)
})

test('normalizeResponse - statusCode', async () => {
  const res = normalizeResponse({ statusCode: 400 })
  assert.equal(res.statusCode, 400)
})

test('normalizeResponse - headers', async () => {
  const res = normalizeResponse({ headers: { Host: 'foo' } })
  assert.ok(res.headers && res.headers.host === 'foo')
})

test('normalizeResponse - multiValueHeaders', async () => {
  const res = normalizeResponse({
    multiValueHeaders: { 'Set-Cookie': ['foo', 'bar'] },
  })
  assert.ok(res.multiValueHeaders && res.multiValueHeaders['Set-Cookie'][0] === 'foo')
})

test.run()
