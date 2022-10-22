import { Response as LambdaResponse } from 'lambda-types'

import { html } from '../serialize'
import type { Response } from '../core'

export function normalizeResponse(response: Response | string): LambdaResponse {
  return typeof response === 'string'
    ? html({ body: response })
    : {
        ...response,
        statusCode: response.statusCode || 200,
      }
}
