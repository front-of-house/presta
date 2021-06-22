import { HandlerEvent, HandlerContext } from '@netlify/functions'

import { debug } from './debug'
import { getRouteParams } from './getRouteParams'
import { default404 } from './default404'
import { createContext } from './createContext'
import { normalizeResponse } from './normalizeResponse'
import { loadCache } from './load'
import { createRouter } from './router'

/*
 * This function is initially called *within* a generated entry file
 */
export function createHandler (router: ReturnType<typeof createRouter>) {
  return async (event: HandlerEvent, context: HandlerContext) => {
    debug('received event', event)

    /*
     * Match a file using router
     */
    const file = router(event.path)

    /*
     * Exit early if no file was matched
     */
    if (!file) {
      debug('handler', 'fallback to default 404')

      return normalizeResponse({
        statusCode: 404,
        body: default404
      })
    }

    // we've got a file match...

    /*
     * Create presta context object
     */
    const ctx = createContext({
      path: event.path,
      method: event.httpMethod,
      headers: {
        ...event.headers,
        ...event.multiValueHeaders
      },
      body: event.body,
      params: getRouteParams(event.path, file.route),
      query: {
        ...event.queryStringParameters,
        ...event.multiValueQueryStringParameters
      },
      lambda: { event, context }
    })

    debug('presta serverless context', ctx)

    const response = normalizeResponse(await file.handler(ctx))

    loadCache.clearAllMemory()

    return response
  }
}
