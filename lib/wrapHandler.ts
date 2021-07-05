import { getRouteParams } from './getRouteParams'
import { normalizeResponse } from './normalizeResponse'

import type { lambda, HandlerEvent, HandlerContext, PrestaDynamicFile } from '..'

export function wrapHandler (file: PrestaDynamicFile) {
  return async (event: lambda['HandlerEvent'], context: HandlerContext) => {
    event = {
      ...event,
      params: getRouteParams(event.path, file.route)
    } as HandlerEvent

    const response = normalizeResponse(await file.handler(event as HandlerEvent, context))

    return response
  }
}
