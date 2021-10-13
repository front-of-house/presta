/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { getRouteParams } from './getRouteParams'
import { normalizeResponse } from './normalizeResponse'
import { pruneObject } from './pruneObject'
import * as logger from './log'
import { AWS, Event, Context, Lambda, PrestaError } from './types'

function createHTMLErrorPage({ statusCode }: { statusCode: number }) {
  return `
    <!DOCTYPE html>
    <html>
      <head><title>HTTP ${statusCode}</title></head>
      <body><h1>HTTP ${statusCode}</h1></body>
    </html>
  `
}

export function wrapHandler(
  file: Lambda
): (event: AWS['HandlerEvent'], context: Context) => Promise<AWS['HandlerResponse']> {
  return async (event: AWS['HandlerEvent'], context: Context) => {
    event = {
      ...event,
      routeParameters: getRouteParams(event.path, file.route),
    } as Event

    let response

    try {
      response = normalizeResponse(await file.handler(event as Event, context))
    } catch (e) {
      logger.error({
        label: 'serve',
        message: `lambda`,
        error: e as Error,
      })

      const err = e as PrestaError
      const accept = event.headers['Accept']
      const acceptsJson = accept && accept.includes('json')
      const statusCode = err.status || err.statusCode || 500

      response = normalizeResponse({
        statusCode,
        html: acceptsJson ? undefined : createHTMLErrorPage({ statusCode }),
        json: acceptsJson
          ? {
              errors: [
                pruneObject({
                  status: statusCode,
                  source: err.source,
                  title: err.title,
                  details: err.details || err.message,
                }),
              ],
            }
          : undefined,
      })
    }

    return response
  }
}
