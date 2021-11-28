/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { getRouteParams } from './getRouteParams'
import { normalizeResponse } from './normalizeResponse'
import { AWS, Event, Context, Lambda } from './types'

export function wrapHandler(
  file: Lambda
): (event: AWS['HandlerEvent'], context: Context) => Promise<AWS['HandlerResponse']> {
  return async (event: AWS['HandlerEvent'], context: Context) => {
    event = {
      ...event,
      routeParameters: getRouteParams(event.path, file.route),
    } as Event

    return normalizeResponse(await file.handler(event as Event, context))
  }
}
