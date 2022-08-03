import { Event } from 'lambda-types'

import { parseQueryStringParameters } from './parseQueryStringParameters'
import { isBase64EncodedContentType } from './isBase64EncodedContentType'

/**
 * Takes a `Partial<Event>` and returns `Event`. Requires at least an `event.path` property.
 */
export function normalizeEvent(event: Pick<Event, 'path'> & Partial<Omit<Event, 'path'>>): Event {
  const rawQuery = event.rawQuery || event.path.split('?')[1]
  const { queryStringParameters, multiValueQueryStringParameters } = parseQueryStringParameters(rawQuery)
  const isBase64Encoded = event.isBase64Encoded ?? isBase64EncodedContentType(event?.headers?.['content-type'] || '')

  return {
    rawUrl: event.rawUrl || event.path,
    rawQuery,
    path: event.path,
    httpMethod: event.httpMethod || 'GET',
    headers: event.headers || {},
    multiValueHeaders: event.multiValueHeaders || {},
    queryStringParameters: event.queryStringParameters || queryStringParameters,
    multiValueQueryStringParameters: event.multiValueQueryStringParameters || multiValueQueryStringParameters,
    pathParameters: event.pathParameters || {},
    body: event.body || null,
    isBase64Encoded: isBase64Encoded ?? false,
    requestContext: event.requestContext || {},
    resource: event.resource || '',
  }
}
