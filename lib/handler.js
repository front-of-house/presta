import { render } from '../load'
import { document } from '../document'
import { debug } from './debug'
import { getRouteParams } from './getRouteParams'

export function createHandler (router, userConfig) {
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
      if (userConfig.onRequest) {
        const response = await userConfig.onRequest(event, context)
        if (response) return response
      }

      return {
        statusCode: 404,
        body: '' // TODO Return default 404 here
      }
    }

    // we've got a page match...

    /*
     * Handle incoming request with page onRequest, if available, fallback to global
     */
    const onRequest = page.onRequest || userConfig.onRequest
    if (onRequest) {
      const response = await onRequest(event, context)
      if (response) return response
    }

    /*
     * Create presta context object
     */
    const ctx = {
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
      lambdaEvent: event,
      lambdaContext: context
    }

    debug('presta serverless context', ctx)

    const postRenderCtx = await render(
      page.template,
      ctx,
      page.render || userConfig.render
    )
    const content = await (
      page.createContent ||
      userConfig.createContent ||
      document
    )(postRenderCtx)
    const createResponse =
      page.createResponse || userConfig.createResponse || ((c, r) => r)

    const response = await createResponse(postRenderCtx, {
      statusCode: 200,
      body: content,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })

    return response
  }
}
