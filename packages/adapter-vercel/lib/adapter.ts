import { parse as parseUrl } from 'url'
import { NextApiRequest, NextApiResponse } from 'next'
import { Handler, Response } from 'lambda-types'
import { Event, Context } from 'presta'
import { normalizeHeaders } from 'presta/dist/normalizeHeaders'
import { parseQueryStringParameters } from 'presta/dist/parseQueryStringParameters'

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function shouldBase64Encode(contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

function requestToEvent(req: NextApiRequest): Event {
  const { url: path = '', method } = req
  const { headers, multiValueHeaders } = normalizeHeaders(req.headers)
  const isBase64Encoded = shouldBase64Encode(headers['content-type'] || '')
  const rawQuery = parseUrl(path).query || ''
  const { queryStringParameters, multiValueQueryStringParameters } = parseQueryStringParameters(rawQuery)

  return {
    rawUrl: path,
    path,
    httpMethod: method as string,
    headers,
    multiValueHeaders,
    rawQuery,
    queryStringParameters,
    multiValueQueryStringParameters,
    body: req.body,
    isBase64Encoded,
    pathParameters: {},
  }
}

export function adapter(handler: Handler) {
  return async function handleVercelRequest(req: NextApiRequest, res: NextApiResponse) {
    const event = requestToEvent(req)
    // @ts-ignore
    const response: Response = await handler(event, {} as Context)

    if (response.multiValueHeaders) {
      for (const key of Object.keys(response.multiValueHeaders)) {
        res.setHeader(key, String(response.multiValueHeaders[key]))
      }
    }

    if (response.headers) {
      for (const key of Object.keys(response.headers)) {
        res.setHeader(key, String(response.headers[key]))
      }
    }

    res.statusCode = response.statusCode
    res.end(response.body)
  }
}
