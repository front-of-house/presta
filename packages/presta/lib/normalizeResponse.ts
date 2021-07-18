import { AWS, Response } from './types'

function stringify(obj: object | string) {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj
}

export function normalizeResponse(response: Partial<Response> | string): AWS['HandlerResponse'] {
  const {
    isBase64Encoded = false,
    statusCode = 200,
    headers = {},
    multiValueHeaders = {},
    body = '',
    html = undefined,
    json = undefined,
    xml = undefined,
  } = typeof response === 'string'
    ? {
        body: response,
      }
    : response

  let contentType = 'text/html; charset=utf-8'

  if (!!json) {
    contentType = 'application/json; charset=utf-8'
  } else if (!!xml) {
    contentType = 'application/xml; charset=utf-8'
  }

  return {
    isBase64Encoded,
    statusCode,
    headers: {
      'Content-Type': contentType,
      ...headers,
    },
    multiValueHeaders,
    body: stringify(body || html || json || xml || ''),
  }
}
