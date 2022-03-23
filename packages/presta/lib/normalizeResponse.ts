/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { Response as LambdaResponse } from 'lambda-types'
import { Response, Headers } from './lambda'

function stringify(obj: object | string) {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj
}

function normalizeHeaders(headers: Headers) {
  const normalized: Headers = {}

  for (const header of Object.keys(headers)) {
    const key = header.toLowerCase()
    const value = headers[header]
    normalized[key] = value || ''
  }

  return normalized
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
  const redir = statusCode > 299 && statusCode < 399

  let contentType = 'text/html; charset=utf-8'

  if (!!json) {
    contentType = 'application/json; charset=utf-8'
  } else if (!!xml) {
    contentType = 'application/xml; charset=utf-8'
  }

  const normalizedIncomingHeaders = normalizeHeaders(headers as Headers)
  const normalizedHeaders: LambdaResponse['headers'] = {}

  if (!redir) {
    normalizedHeaders['content-type'] = contentType
  }

  return {
    isBase64Encoded,
    statusCode,
    headers: Object.assign({}, normalizedHeaders, normalizedIncomingHeaders),
    multiValueHeaders,
    body: stringify(body || html || json || xml || ''),
  }
}
