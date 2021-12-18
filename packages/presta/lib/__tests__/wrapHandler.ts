import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { wrapHandler } from '../wrapHandler'
import { AWS } from '../types'

const test = suite('presta - getFiles')

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

test('wrapHandler', async () => {
  let plan = 0

  const handler = wrapHandler({
    route: '/:slug',
    async handler(event, context) {
      plan++
      assert.equal(event.routeParameters.slug, 'foo')
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

  assert.equal(response.body, 'foo')
  assert.equal(plan, 1)
})

test.run()
