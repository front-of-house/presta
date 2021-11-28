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
      t.equal(event.routeParameters.slug, 'foo')
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
