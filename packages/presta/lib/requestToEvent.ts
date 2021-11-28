import http from 'http'
import { parse as parseUrl } from 'url'
import { parse as parseQuery } from 'query-string'
import rawBody from 'raw-body'
import mime from 'mime-types'
import { AWS } from './types'

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function shouldBase64Encode(contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

export function normalizeHeaders(rawHeaders: http.IncomingMessage['headers']) {
  const headers: AWS['HandlerEvent']['headers'] = {}
  const multiValueHeaders: AWS['HandlerEvent']['multiValueHeaders'] = {}

  for (const header of Object.keys(rawHeaders)) {
    const key = header.toLowerCase()
    const value = rawHeaders[header]

    if (!value) continue

    if (Array.isArray(value)) {
      multiValueHeaders[key] = value
    } else {
      headers[key] = value
    }
  }

  return { headers, multiValueHeaders }
}

export function getQueryStringParameters(query: string) {
  const params = parseQuery(query, { arrayFormat: 'comma' })

  const queryStringParameters: AWS['HandlerEvent']['queryStringParameters'] = {}
  const multiValueQueryStringParameters: AWS['HandlerEvent']['multiValueQueryStringParameters'] = {}

  for (const param of Object.keys(params)) {
    const value = params[param]
    if (Array.isArray(value)) {
      multiValueQueryStringParameters[param] = value
    } else {
      queryStringParameters[param] = value || undefined
    }
  }

  return { queryStringParameters, multiValueQueryStringParameters }
}

export async function requestToEvent(req: http.IncomingMessage): Promise<AWS['HandlerEvent']> {
  const { url: path = '', method } = req
  const { headers, multiValueHeaders } = normalizeHeaders(req.headers)
  const isBase64Encoded = shouldBase64Encode(headers['content-type'] || '')
  const contentLengthHeader = headers['content-length']
  const body = contentLengthHeader
    ? await rawBody(req, {
        limit: '1mb',
        encoding: mime.charset(contentLengthHeader) || undefined,
      })
    : undefined
  const rawQuery = parseUrl(path).query || ''
  const { queryStringParameters, multiValueQueryStringParameters } = getQueryStringParameters(rawQuery)

  /**
   * Just fake this locally
   * @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L208
   */
  headers['client-ip'] = '0.0.0.0'

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
  }
}
