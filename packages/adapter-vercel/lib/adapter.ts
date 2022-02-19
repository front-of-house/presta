/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { parse as parseUrl } from 'url'
import { NextApiRequest, NextApiResponse } from 'next'
import { Response } from 'lambda-types'
import type { Handler, Event, Context } from 'presta'
import { normalizeHeaders } from '@presta/utils/normalizeHeaders'
import { parseQueryStringParameters } from '@presta/utils/parseQueryStringParameters'
import { sendServerlessResponse } from '@presta/utils/sendServerlessResponse'

export type VercelEvent = Event & {
  env: NextApiRequest['env']
  cookies: { [cookie: string]: string }
}

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
export function shouldBase64Encode(contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

export function requestToEvent(req: NextApiRequest): VercelEvent {
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
    body: req.body || null,
    isBase64Encoded,
    pathParameters: {},
    cookies: req.cookies || {},
    env: req.env,
  }
}

export function adapter(handler: Handler) {
  return async function handleVercelRequest(req: NextApiRequest, res: NextApiResponse) {
    const event = requestToEvent(req)
    // @ts-ignore
    const response: Response = await handler(event, {} as Context)

    sendServerlessResponse(res, response)
  }
}
