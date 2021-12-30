import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { wrapHandler } from '../wrapHandler'
import { Context, Event } from '../lambda'

const test = suite('presta - getFiles')

const context = {} as Context

function stubEvent(props: Partial<Event>): Event {
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
    pathParameters: {},
    ...props,
  }
}

test('wrapHandler', async () => {
  let plan = 0

  const handler = wrapHandler({
    route: '/:slug',
    async handler(event, context) {
      plan++
      assert.equal(event.pathParameters.slug, 'foo')
      return {
        statusCode: 200,
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
