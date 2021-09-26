import http from 'http'

import { normalizeResponse } from './normalizeResponse'
import { AWS } from './types'

export function sendServerlessResponse(res: http.ServerResponse, r: Partial<AWS['HandlerResponse']>) {
  const response = normalizeResponse(r)

  // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L73
  for (const key in r.multiValueHeaders) {
    res.setHeader(key, String(r.multiValueHeaders[key]))
  }

  for (const key in r.headers) {
    res.setHeader(key, String(r.headers[key]))
  }

  res.statusCode = response.statusCode
  res.write(response.body)
  res.end()
}
