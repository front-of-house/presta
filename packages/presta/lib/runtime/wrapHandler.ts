import { Response as LambdaResponse } from 'lambda-types'

import { normalizeEvent } from './normalizeEvent'
import { parsePathParameters } from './parsePathParameters'
import { normalizeResponse } from './normalizeResponse'

import type { PrestaFunctionFile, Event, Context } from '../core'

/**
 * This function wraps every Presta handler. Plugins wrap around this, so keep
 * in mind that some work is done here already and doesn't need to be
 * duplicated in other adapters and plugins.
 */
export function wrapHandler(file: PrestaFunctionFile): (event: Event, context: Context) => Promise<LambdaResponse> {
  return async (event: Event, context: Context) => {
    const ev = normalizeEvent(event)

    if (!Object.keys(ev.pathParameters || {}).length) {
      ev.pathParameters = parsePathParameters(event.path, file.route)
    }

    return normalizeResponse(await file.handler(ev, context))
  }
}
