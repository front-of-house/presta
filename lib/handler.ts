import { debug } from './debug'
import { getRouteParams } from './getRouteParams'
import { default404 } from './default404'
import { normalizeResponse } from './normalizeResponse'
import { loadCache } from './load'
import { createRouter } from './router'

import type { lambda, HandlerEvent, HandlerContext } from '..'

/*
 * This function is initially called *within* a generated entry file
 */
export function createHandler (router: ReturnType<typeof createRouter>) {
  return async (event: lambda['HandlerEvent'], context: HandlerContext) => {
    debug('received event', event)

    /*
     * Match a file using router
     */
    const file = router(event.path)

    /*
     * Exit early if no file was matched
     */
    if (!file) {
      debug('handler', 'fallback to default 404')

      return normalizeResponse({
        statusCode: 404,
        body: default404
      })
    }

    // we've got a file match...

    event = {
      ...event,
      params: getRouteParams(event.path, file.route)
    } as HandlerEvent

    debug('presta handler', event, context)

    const response = normalizeResponse(await file.handler(event as HandlerEvent, context))

    loadCache.clearAllMemory()

    return response
  }
}
