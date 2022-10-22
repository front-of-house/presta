import { Params } from 'lambda-types'

export function normalizeResponseHeaders<T = Params>(responseHeaders: T): T {
  for (const header of Object.keys(responseHeaders)) {
    // @ts-ignore
    responseHeaders[header.toLowerCase()] = responseHeaders[header] || ''
  }

  return responseHeaders
}
