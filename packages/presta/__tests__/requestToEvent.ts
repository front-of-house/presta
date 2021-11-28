import http from 'http'
import tap from 'tap'

import { requestToEvent, normalizeHeaders, getQueryStringParameters } from '../lib/requestToEvent'

function createRequest(props: Partial<http.IncomingMessage>): http.IncomingMessage {
  // @ts-ignore
  const req = new http.IncomingMessage(null)

  Object.assign(req, props)

  return req
}

tap.only('normalizeHeaders', async (t) => {
  const { headers, multiValueHeaders } = normalizeHeaders({
    'Content-Type': 'text/html',
    'Set-Cookie': ['foo=1', 'bar=2'],
    'X-Version': undefined,
  })

  t.same(headers, {
    'content-type': 'text/html',
  })
  t.same(multiValueHeaders, {
    'set-cookie': ['foo=1', 'bar=2'],
  })
})

tap.only('getQueryStringParameters', async (t) => {
  const { queryStringParameters, multiValueQueryStringParameters } = getQueryStringParameters('foo=bar&bar=a,b')

  t.same(queryStringParameters, {
    foo: 'bar',
  })
  t.same(multiValueQueryStringParameters, {
    bar: ['a', 'b'],
  })
})

tap.only('requestToEvent', async (t) => {
  const event = await requestToEvent(
    createRequest({
      url: '/',
      method: 'GET',
    })
  )

  t.same(event, {
    rawUrl: '/',
    path: '/',
    httpMethod: 'GET',
    headers: { 'client-ip': '0.0.0.0' },
    multiValueHeaders: {},
    rawQuery: '',
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    body: null,
    isBase64Encoded: false,
  })
})

tap.only('requestToEvent - shouldBase64Encode', async (t) => {
  const event = await requestToEvent(
    createRequest({
      url: '/',
      method: 'GET',
      headers: {
        'content-type': 'image/png',
      },
    })
  )

  t.equal(event.isBase64Encoded, true)
})
