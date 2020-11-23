import { render } from '../load'
import { document } from '../document'

export function createHandler (router, userConfig) {
  return async (event, context) => {
    const page = router(event.path)

    if (!page)
      return {
        statusCode: 404,
        body: ''
      }

    const result = await render(
      page.Page,
      { pathname: event.path, event, context },
      page.render || userConfig.render
    )
    const body = await (
      page.createDocument ||
      userConfig.createDocument ||
      document
    )(result)
    const createResponse =
      page.createResponse || userConfig.createResponse || (c => c.result)

    return createResponse({
      event,
      context,
      result: {
        statusCode: 200,
        body,
        headers: {
          'content-type': 'text/html; charset=utf-8'
        }
      }
    })
  }
}
