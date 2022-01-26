/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { getAssetFromKV, Options } from '@cloudflare/kv-asset-handler'
import { Router } from 'itty-router'
import { normalizeHeaders } from '@presta/utils/normalizeHeaders'
import { parseQueryStringParameters } from '@presta/utils/parseQueryStringParameters'
import { createDefaultHtmlResponse } from '@presta/utils/createDefaultHtmlResponse'
import type { Event, Response as LambdaResponse } from 'lambda-types'
import type { HookPostBuildPayload } from 'presta'

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function shouldBase64Encode(contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

export async function requestToEvent(req: Request): Promise<Event> {
  const { url: rawUrl = '', method } = req
  const { headers, multiValueHeaders } = normalizeHeaders({}) //req.headers)

  const contentType = headers['content-type'] || ''
  const isBase64Encoded = shouldBase64Encode(contentType)

  const body = await req.text()
  const url = new URL(rawUrl)
  const rawQuery = url.search || ''
  const { queryStringParameters, multiValueQueryStringParameters } = parseQueryStringParameters(rawQuery)

  return {
    rawUrl,
    path: url.pathname,
    httpMethod: method as string,
    headers,
    multiValueHeaders,
    rawQuery,
    queryStringParameters,
    multiValueQueryStringParameters,
    body: body || '', // TODO base64
    isBase64Encoded,
    pathParameters: {},
    requestContext: {},
    resource: '',
  }
}

export function createResponse(response: LambdaResponse) {
  const res = new Response(response.body, { status: response.statusCode })

  // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L73
  if (response.multiValueHeaders) {
    for (const header of Object.keys(response.multiValueHeaders)) {
      for (const value of response.multiValueHeaders[header]) {
        res.headers.append(header, String(value))
      }
    }
  }

  if (response.headers) {
    for (const header of Object.keys(response.headers)) {
      res.headers.set(header, String(response.headers[header]))
    }
  }

  return res
}

function createRequestHandler(props: HookPostBuildPayload, routes: any[]) {
  const router = Router()

  for (const route of routes) {
    router.all(route.route, async (req) => {
      // @ts-ignore
      const event = await requestToEvent(req)
      const { handler } = route.module
      // @ts-ignore
      const response = await handler(event, {})
      // @ts-ignore
      return createResponse(response)
    })
  }

  return async (event: FetchEvent) => {
    const url = new URL(event.request.url)

    try {
      const options: Partial<Options> = {}

      // @ts-ignore
      if (PRESTA_ENV !== 'production') {
        // customize caching
        options.cacheControl = {
          bypassCache: true,
        }
      }

      const page = await getAssetFromKV(event, options)

      // allow headers to be altered
      const response = new Response(page.body, page)

      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('Referrer-Policy', 'unsafe-url')
      response.headers.set('Feature-Policy', 'none')

      return response
    } catch (e) {}

    const cacheKey = new Request(new URL(event.request.url).toString(), event.request)
    const cache = caches.default

    let response = await cache.match(cacheKey)

    try {
      if (!response) {
        response = await router.handle(event.request)

        if (response) {
          if ([301, 302, 307, 310].includes(response.status)) {
            const location = new URL(response.headers.get('location') || '/', url.origin).href
            return Response.redirect(location, response.status)
          }

          event.waitUntil(cache.put(cacheKey, response.clone()))
        } else {
          response = new Response(createDefaultHtmlResponse({ statusCode: 404 }), {
            status: 404,
            headers: { 'content-type': 'text/html;charset=utf8' },
          })
        }
      }
    } catch (e) {
      console.error(e) // TODO only in dev
      response = new Response(createDefaultHtmlResponse({ statusCode: 500 }), {
        status: 500,
        headers: { 'content-type': 'text/html;charset=utf8' },
      })
    }

    return response
  }
}

export function adapter(props: HookPostBuildPayload, routes: any[]) {
  const requestHandler = createRequestHandler(props, routes)
  return (event: FetchEvent) => {
    return event.respondWith(requestHandler(event))
  }
}
