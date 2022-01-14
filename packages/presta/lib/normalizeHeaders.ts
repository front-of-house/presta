import http from 'http'
import { Headers, MultiValueHeaders } from './lambda'

export function normalizeHeaders(rawHeaders: http.IncomingMessage['headers']) {
  const headers: Headers = {}
  const multiValueHeaders: MultiValueHeaders = {}

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
