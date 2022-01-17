/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { Response as LambdaResponse } from 'lambda-types'
import { Response, Headers } from './lambda'

function stringify(obj: object | string) {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj
}

export function normalizeResponse(response: Partial<Response> | string): LambdaResponse {
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

  const rawHeaders: Headers = {
    'Content-Type': contentType,
    ...headers,
  }
  const normalizedHeaders: LambdaResponse['headers'] = {}

  for (const header of Object.keys(rawHeaders)) {
    const key = header.toLowerCase()
    const value = rawHeaders[header]
    normalizedHeaders[key] = value || ''
  }

  return {
    isBase64Encoded,
    statusCode,
    headers: normalizedHeaders,
    multiValueHeaders,
    body: stringify(body || html || json || xml || ''),
  }
}
