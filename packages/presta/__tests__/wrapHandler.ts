import tap from 'tap'

import { wrapHandler } from '../lib/wrapHandler'
import { AWS } from '../lib/types'

const context = {} as AWS['HandlerContext']

function stubEvent(props: Partial<AWS['HandlerEvent']>): AWS['HandlerEvent'] {
  return {
    rawUrl: '',
    rawQuery: '',
    path: '',
    httpMethod: 'GET',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: {},
    body: null,
    isBase64Encoded: false,
    ...props,
  }
}

tap.test('wrapHandler', async (t) => {
  t.plan(2)

  const handler = wrapHandler({
    route: '/:slug',
    async handler(event, context) {
      t.equal(event.params.slug, 'foo')
      return {
        body: 'foo',
      }
    },
  })

  const response = await handler(
    stubEvent({
      path: '/foo',
    }),
    context
  )

  t.equal(response.body, 'foo')
})

tap.test('wrapHandler - html fallback', async (t) => {
  const handler = wrapHandler({
    route: '/:slug',
    async handler(event, context) {
      throw Error()
    },
  })

  const response = await handler(
    stubEvent({
      path: '/foo',
    }),
    context
  )

  t.ok(response?.body?.includes('HTTP 500'))
})

tap.test('wrapHandler - json fallback', async (t) => {
  const handler = wrapHandler({
    route: '/:slug',
    async handler(event, context) {
      throw Error()
    },
  })

  const response = await handler(
    stubEvent({
      path: '/foo',
      headers: {
        Accept: 'application/json',
      },
    }),
    context
  )

  const body = JSON.parse(response.body || '')

  t.equal(body.errors.length, 1)
})

tap.test('wrapHandler - json fallback with details', async (t) => {
  const handler = wrapHandler({
    route: '/:slug',
    async handler(event, context) {
      const e = Error('message')
      // @ts-ignore
      e.title = 'test'
      throw e
    },
  })

  const response = await handler(
    stubEvent({
      path: '/foo',
      headers: {
        Accept: 'application/json',
      },
    }),
    context
  )

  const body = JSON.parse(response.body || '')
  const error = body.errors[0]

  t.equal(error.details, 'message')
  t.equal(error.title, 'test')
})
