import http from 'http'
// TODO can we make this file V8 safe?
import { parse as parseUrl } from 'url'
import rawBody from 'raw-body'
import mime from 'mime-types'

import { normalizeEvent } from '../runtime/normalizeEvent'
import { normalizeRequestHeaders } from '../runtime/normalizeRequestHeaders'
import { parseQueryStringParameters } from '../runtime/parseQueryStringParameters'
import { isBase64EncodedContentType } from '../runtime/isBase64EncodedContentType'
import { Event } from '../'

/**
 * Used internally. Converts a `http.IncomingMessage` to a AWS Lambda flavored
 * `Event` object. This method only has access to the incoming message, so it
 * can't populate all `Event` properties, like `pathParameters`.
 */
export async function requestToEvent(req: http.IncomingMessage): Promise<Event> {
  const { url: path = '', method } = req
  const { headers, multiValueHeaders } = normalizeRequestHeaders(req.headers)
  const isBase64Encoded = isBase64EncodedContentType(headers['content-type'] || '')
  const contentLengthHeader = headers['content-length']
  const body = contentLengthHeader
    ? await rawBody(req, {
        limit: '1mb',
        encoding: headers['content-type'] ? mime.charset(headers['content-type']) || true : true,
      })
    : undefined
  const rawQuery = parseUrl(path).query || ''
  const { queryStringParameters, multiValueQueryStringParameters } = parseQueryStringParameters(rawQuery)

  return normalizeEvent({
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
    pathParameters: undefined,
    requestContext: {},
    resource: '',
  })
}
