import { debug } from './debug'
import { getRouteParams } from './getRouteParams'
import { default404 } from './default404'
import { createContext } from './createContext'
import { normalizeResponse } from './normalizeResponse'
import { loadCache } from '../load'
import config from './types/config'
import context from './types/context'

/*
 * This function is initially called *within* a generated entry file
 */
export const createHandler = (router, config: config) => {
  return async (event, context: context) => {
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
      headers: {
        ...event.headers,
        ...event.multiValueHeaders
      },
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
