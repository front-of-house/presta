const { debug } = require('./debug')
const { getRouteParams } = require('./getRouteParams')
const { default404 } = require('./default404')
const { createContext } = require('./createContext')
const { normalizeResponse } = require('./normalizeResponse')
const { loadCache } = require('./load')

/*
 * This function is initially called *within* a generated entry file
 */
function createHandler (router, config) {
  return async (event, context) => {
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

module.exports = { createHandler }
