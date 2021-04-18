const { clearMemoryCache } = require('../load')
const { debug } = require('./debug')
const { getRouteParams } = require('./getRouteParams')
const { default404 } = require('./default404')
const { defaultResponseHeaders } = require('./defaultResponseHeaders')
const { initPlugins } = require('./initPlugins')
const { createContext } = require('./createContext')

/*
 * This function is initially called *within* a generated entry file
 */
function createHandler (router, config) {
  return async (event, context) => {
    /*
     * Match a file using router
     */
    const file = router(event.path)

    /*
     * Exit early if no file was matched
     */
    if (!file) {
      debug('handler', 'fallback to default 404')

      return {
        statusCode: 404,
        body: default404,
        headers: defaultResponseHeaders
      }
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

    /*
     * Create plugin instances
     */
    initPlugins(ctx, config)

    debug('presta serverless context', ctx)

    const response = await file.handler(ctx)

    // clear this to prevent memory leak
    clearMemoryCache()

    return response
  }
}

module.exports = { createHandler }
