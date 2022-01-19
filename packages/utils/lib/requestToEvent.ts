import http from 'http'
import { parse as parseUrl } from 'url'
import rawBody from 'raw-body'
import mime from 'mime-types'

import { Event } from 'lambda-types'
import { normalizeHeaders } from './normalizeHeaders'
import { parseQueryStringParameters } from './parseQueryStringParameters'

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function shouldBase64Encode(contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

export async function requestToEvent(req: http.IncomingMessage): Promise<Event> {
  const { url: path = '', method } = req
  const { headers, multiValueHeaders } = normalizeHeaders(req.headers)
  const isBase64Encoded = shouldBase64Encode(headers['content-type'] || '')
  const contentLengthHeader = headers['content-length']
  const body = contentLengthHeader
    ? await rawBody(req, {
        limit: '1mb',
        encoding: headers['content-type'] ? mime.charset(headers['content-type']) || true : true,
      })
    : undefined
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
    body: body ? Buffer.from(body).toString(isBase64Encoded ? 'base64' : 'utf8') : null,
    isBase64Encoded,
    pathParameters: {},
    requestContext: {},
    resource: '',
  }
}
