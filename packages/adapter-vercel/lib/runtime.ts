/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Response } from 'lambda-types'
import type { Handler, Event, Context } from 'presta'
import { normalizeResponse } from 'presta/runtime/normalizeResponse'
import { sendServerlessResponse } from 'presta/runtime/sendServerlessResponse'
import { normalizeRequestHeaders } from 'presta/runtime/normalizeRequestHeaders'
import { isBase64EncodedContentType } from 'presta/runtime/isBase64EncodedContentType'

export type VercelEvent = Event & {
  env: NextApiRequest['env']
  cookies: { [cookie: string]: string }
}

export function requestToEvent(req: NextApiRequest): VercelEvent {
  const { url: path = '', method } = req
  const { headers, multiValueHeaders } = normalizeRequestHeaders(req.headers)
  const isBase64Encoded = isBase64EncodedContentType(headers['content-type'] || '')
  const rawQuery = new URL(path).search || ''

  return {
    rawUrl: path,
    path,
    httpMethod: method as string,
    headers,
    multiValueHeaders,
    rawQuery,
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    body: req.body || null,
    isBase64Encoded,
    pathParameters: {},
    // @ts-expect-error TODO should pry add a context bucket to events, or use context object
    cookies: req.cookies || {},
    env: req.env,
  }
}

export function adapter(handler: Handler) {
  return async function handleVercelRequest(req: NextApiRequest, res: NextApiResponse) {
    const event = requestToEvent(req)
    const context = {
      env: req.env,
      cookies: req.cookies || {},
    } as unknown as Context

    const response: Response = normalizeResponse(await handler(event, context))

    sendServerlessResponse(res, response)
  }
}
