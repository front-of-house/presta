import fs from 'fs'
import http from 'http'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import * as utils from '../'

function createRequest(props: Partial<http.IncomingMessage>): http.IncomingMessage {
  // @ts-ignore
  const req = new http.IncomingMessage(null)

  Object.assign(req, props)

  return req
}

const test = suite('@presta/utils')

test('normalizeHeaders', async () => {
  const { headers, multiValueHeaders } = utils.normalizeHeaders({
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
  const { queryStringParameters, multiValueQueryStringParameters } = utils.parseQueryStringParameters('foo=bar&bar=a,b')

  assert.equal(queryStringParameters, {
    foo: 'bar',
  })
  assert.equal(multiValueQueryStringParameters, {
    bar: ['a', 'b'],
  })
})

test('requestToEvent', async () => {
  const event = await utils.requestToEvent(
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
    requestContext: {},
    resource: '',
  })
})

test('requestToEvent - shouldBase64Encode', async () => {
  const event = await utils.requestToEvent(
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

test('requireFresh', () => {
  const fixtures = afix({
    file: ['file.js', 'module.exports = { foo: true }'],
  })

  assert.equal(utils.requireFresh(fixtures.files.file.path).foo, true)

  fs.writeFileSync(fixtures.files.file.path, 'module.exports = { foo: false }', 'utf8')

  assert.equal(utils.requireFresh(fixtures.files.file.path).foo, false)
})

test('requireSafe', () => {
  const fixtures = afix({
    file: ['file.js', 'module.exports = { foo: true'],
  })

  assert.equal(utils.requireSafe(fixtures.files.file.path).foo, undefined)
})

test('hashContent', () => {
  assert.equal(utils.hashContent('foobar'), utils.hashContent('foobar'))
})

test('sendServerlessResponse', async () => {
  function createRequest() {
    let headers: any[] = []
    let body = ''

    return {
      get headers() {
        return headers
      },
      statusCode: null,
      get body() {
        return body
      },
      setHeader(key: string, value: string) {
        headers.push({ key, value })
      },
      write(body: string) {
        body = body
      },
      end() {},
    } as unknown as http.ServerResponse & { headers: any[] }
  }

  const one = createRequest()
  utils.sendServerlessResponse(one, {
    statusCode: 200,
    headers: {
      'x-header': 'foo',
    },
    multiValueHeaders: {
      'x-header-multi': ['foo', 'foo'],
    },
  })
  assert.equal(one.statusCode, 200)
  assert.equal(one.headers, [
    { key: 'x-header-multi', value: 'foo,foo' },
    { key: 'x-header', value: 'foo' },
  ])
})

test.run()
