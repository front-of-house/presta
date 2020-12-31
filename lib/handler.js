import { render, clearMemoryCache } from '../load'
import { debug } from './debug'
import { getRouteParams } from './getRouteParams'
import { default404 } from './default404'
import { defaultResponseHeaders } from './defaultResponseHeaders'
import { defaultCreateContent } from './defaultCreateContent'
import { initPlugins } from './initPlugins'
import { createContext } from './createContext'

/*
 * This function is initially called *within* a generated entry file
 */
export function createHandler (router, config) {
  return async (event, context) => {
    /*
     * Dynamic routes only support GET
     */
    if (event.httpMethod.toLowerCase() !== 'get') {
      return {
        statusCode: 405,
        body: ''
      }
    }

    /*
     * Match a page using router
     */
    const page = router(event.path)

    /*
     * Exit early if no page was matched
     */
    if (!page) {
      // if no page, but we have a global onRequest, try that first before failing
      if (config.onRequest) {
        debug('handler', 'no page, trying config.onRequest')

        const response = await config.onRequest(event, context)

        if (response) return response
      }

      debug('handler', 'fallback to default 404')

      return {
        statusCode: 404,
        body: default404,
        headers: defaultResponseHeaders
      }
    }

    // we've got a page match...

    /*
     * Handle incoming request with page onRequest, if available, fallback to global
     */
    const onRequest = page.onRequest || config.onRequest
    if (onRequest) {
      const response = await onRequest(event, context)
      if (response) return response
    }

    /*
     * Create presta context object
     */
    const ctx = createContext({
      path: event.path,
      headers: {
        ...event.headers,
        ...event.multiValueHeaders
      },
      params: getRouteParams(event.path, page.route),
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

    const renderedProps = await render(
      page.template,
      ctx,
      page.render || config.render
    )

    // clear this to prevent memory leak
    clearMemoryCache()

    const content = await (
      page.createContent ||
      config.createContent ||
      defaultCreateContent
    )(renderedProps)
    const createResponse =
      page.createResponse || config.createResponse || ((c, r) => r)

    const response = await createResponse(renderedProps, {
      statusCode: 200,
      body: content,
      headers: defaultResponseHeaders
    })

    return response
  }
}
