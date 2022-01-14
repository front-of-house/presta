import http from 'http'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { requestToEvent } from '../requestToEvent'
import { normalizeHeaders } from '../normalizeHeaders'
import { parseQueryStringParameters } from '../parseQueryStringParameters'

function createRequest(props: Partial<http.IncomingMessage>): http.IncomingMessage {
  // @ts-ignore
  const req = new http.IncomingMessage(null)

  Object.assign(req, props)

  return req
}

const test = suite('presta - requestToEvent')

test('normalizeHeaders', async () => {
  const { headers, multiValueHeaders } = normalizeHeaders({
    'Content-Type': 'text/html',
    'Set-Cookie': ['foo=1', 'bar=2'],
    'X-Version': undefined,
  })

  assert.equal(headers, {
    'content-type': 'text/html',
  })
  assert.equal(multiValueHeaders, {
    'set-cookie': ['foo=1', 'bar=2'],
  })
})

test('parseQueryStringParameters', async () => {
  const { queryStringParameters, multiValueQueryStringParameters } = parseQueryStringParameters('foo=bar&bar=a,b')

  assert.equal(queryStringParameters, {
    foo: 'bar',
  })
  assert.equal(multiValueQueryStringParameters, {
    bar: ['a', 'b'],
  })
})

test('requestToEvent', async () => {
  const event = await requestToEvent(
    createRequest({
      url: '/',
      method: 'GET',
    })
  )

  assert.equal(event, {
    rawUrl: '/',
    path: '/',
    httpMethod: 'GET',
    headers: {},
    multiValueHeaders: {},
    rawQuery: '',
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    body: null,
    isBase64Encoded: false,
    pathParameters: {},
  })
})

test('requestToEvent - shouldBase64Encode', async () => {
  const event = await requestToEvent(
    createRequest({
      url: '/',
      method: 'GET',
      headers: {
        'content-type': 'image/png',
      },
    })
  )

  assert.equal(event.isBase64Encoded, true)
})

test.run()
