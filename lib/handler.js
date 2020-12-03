import { render } from '../load'
import { document } from '../document'
import { debug } from './debug'
import { getRouteParams } from './getRouteParams'

export function createHandler (router, userConfig) {
  return async (event, context) => {
    if (event.httpMethod.toLowerCase() !== 'get') {
      return {
        statusCode: 405,
        body: ''
      }
    }

    const page = router(event.path)

    if (!page)
      return {
        statusCode: 404,
        body: ''
      }

    const ctx = {
      path: event.path,
      headers: event.headers,
      params: getRouteParams(event.path, page.route),
      query: event.queryStringParameters,
      lambdaEvent: event,
      lambdaContext: context
    }

    debug('presta serverless context', ctx)

    const postRenderCtx = await render(
      page.Page,
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

    return createResponse(postRenderCtx, {
      statusCode: 200,
      body: content,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
}
