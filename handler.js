import { render } from './load'
import { document } from './document'

export function createHandler (router, userConfig) {
  return async (ev, ctx) => {
    const page = router(ev.path)

    if (!page)
      return {
        statusCode: 404,
        body: ''
      }

    const result = await render(
      page.Page,
      { pathname: ev.path },
      page.render || userConfig.render
    )
    const body = await (
      page.createDocument ||
      userConfig.createDocument ||
      document
    )(result)

    return {
      statusCode: 200,
      body,
      headers: {
        'content-type': 'text/html'
      }
    }
  }
}
