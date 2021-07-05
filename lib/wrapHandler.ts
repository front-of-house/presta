import { getRouteParams } from './getRouteParams'
import { normalizeResponse } from './normalizeResponse'

import type { AWS, Event, Context, Lambda } from '..'

export function wrapHandler (file: Lambda) {
  return async (event: AWS['HandlerEvent'], context: Context) => {
    event = {
      ...event,
      params: getRouteParams(event.path, file.route)
    } as Event

    const response = normalizeResponse(await file.handler(event as Event, context))

    return response
  }
}
