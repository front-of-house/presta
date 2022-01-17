import http from 'http'
import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
import { Event, Context } from 'presta'
import { NextApiRequest, NextApiResponse } from 'next'

import { shouldBase64Encode, requestToEvent, adapter } from '../adapter'

const test = suite('@presta/adapter-vercel')

function createRequest(props: Partial<NextApiRequest>): NextApiRequest {
  // @ts-ignore
  const req = new http.IncomingMessage(null)

  Object.assign(
    req,
    {
      query: {},
      cookies: {},
      body: undefined,
      env: 'env',
    },
    props
  )

  // @ts-ignore
  return req
}

function createResponse() {
  let headers: { key: string; value: string }[] = []
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
    end(b: string) {
      body = b
    },
  }
}

test('shouldBase64Encode', async () => {
  assert.ok(shouldBase64Encode('image/jpeg'))
  assert.not.ok(shouldBase64Encode('text/html'))
})

test('requestToEvent', async () => {
  const event = requestToEvent(
    createRequest({
      url: '/',
      method: 'GET',
      cookies: { foo: 'bar' },
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
    cookies: { foo: 'bar' },
    env: 'env',
  })
})

test('adapter', async () => {
  let plan = 0

  function handler(ev: Event, ctx: Context) {
    plan++

    return {
      statusCode: 200,
      headers: {
        'x-header': 'foo',
      },
      multiValueHeaders: {
        'x-header-multi': ['foo', 'foo'],
      },
      body: 'foo',
    }
  }

  const adapted = adapter(handler)
  const req = createRequest({
    url: '/',
    method: 'GET',
  })
  const res = createResponse()
  await adapted(req, res as unknown as NextApiResponse)

  console.log(res.body)

  assert.equal(plan, 1)
  assert.equal(res.statusCode, 200)
  assert.equal(res.headers, [
    { key: 'x-header-multi', value: 'foo,foo' },
    { key: 'x-header', value: 'foo' },
  ])
  assert.equal(res.body, 'foo')
})

test.run()
