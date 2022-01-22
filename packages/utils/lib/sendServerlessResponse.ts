import http from 'http'
import { Response } from 'lambda-types'

export function sendServerlessResponse(res: http.ServerResponse, response: Response) {
  // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L73
  if (response.multiValueHeaders) {
    for (const header of Object.keys(response.multiValueHeaders)) {
      res.setHeader(
        header,
        response.multiValueHeaders[header].map((v) => String(v))
      )
    }
  }

  if (response.headers) {
    for (const header of Object.keys(response.headers)) {
      res.setHeader(header, String(response.headers[header]))
    }
  }

  res.statusCode = response.statusCode
  res.end(response.body)
}
