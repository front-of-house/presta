import { render } from '../load'
import { debug } from './debug'
import { getRouteParams } from './getRouteParams'
import { default404 } from './default404'
import { defaultResponseHeaders } from './defaultResponseHeaders'
import { defaultCreateContent } from './defaultCreateContent'

/*
 * This function is initially called *within* a generated entry file
 */
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
        debug('handler', 'no page, trying config.onRequest')

        const response = await userConfig.onRequest(event, context)

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
    const onRequest = page.onRequest || userConfig.onRequest
    if (onRequest) {
      const response = await onRequest(event, context)
      if (response) return response
    }

    /*
     * Create presta context object
     */
    const context = {
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
      lambda: { event, context },
      props: {},
      plugins: {}
    }

    debug('presta serverless context', context)

    const renderedProps = await render(
      page.template,
      context,
      page.render || userConfig.render
    )
    const content = await (
      page.createContent ||
      userConfig.createContent ||
      defaultCreateContent
    )(renderedProps)
    const createResponse =
      page.createResponse || userConfig.createResponse || ((c, r) => r)

    const response = await createResponse(renderedProps, {
      statusCode: 200,
      body: content,
      headers: defaultResponseHeaders
    })

    return response
  }
}
