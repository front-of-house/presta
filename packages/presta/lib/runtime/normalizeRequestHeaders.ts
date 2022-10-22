import type http from 'http'
import { Params, MultiValueParams } from 'lambda-types'

export function normalizeRequestHeaders(rawRequestHeaders: http.IncomingMessage['headers']) {
  const headers: Params = {}
  const multiValueHeaders: MultiValueParams = {}

  for (const header of Object.keys(rawRequestHeaders)) {
    const key = header.toLowerCase()
    const value = rawRequestHeaders[header]

    if (!value) continue

    if (Array.isArray(value)) {
      multiValueHeaders[key] = value
    } else {
      headers[key] = value
    }
  }

  return { headers, multiValueHeaders }
}
