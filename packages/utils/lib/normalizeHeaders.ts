import http from 'http'
import { Params, MultiValueParams } from 'lambda-types'

export function normalizeHeaders(rawHeaders: http.IncomingMessage['headers']) {
  const headers: Params = {}
  const multiValueHeaders: MultiValueParams = {}

  for (const header of Object.keys(rawHeaders)) {
    const key = header.toLowerCase()
    const value = rawHeaders[header]

    if (!value) continue

    if (Array.isArray(value)) {
      multiValueHeaders[key] = value
    } else {
      headers[key] = value
    }
  }

  return { headers, multiValueHeaders }
}
