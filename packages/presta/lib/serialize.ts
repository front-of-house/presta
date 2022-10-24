/**
 * This is production code, so be careful what you add to this file because we
 * want to keep it small.
 *
 * This file is used in compiled Presta functions to serialize output.
 */
import { Response as LambdaResponse } from 'lambda-types'
import { normalizeResponseHeaders } from './runtime/normalizeResponseHeaders'

import { Response } from './core'

enum ContentType {
  Html = 'text/html; charset=utf-8',
  Json = 'application/json; charset=utf-8',
  Xml = 'application/xml; charset=utf-8',
}

function stringifyObject(obj: object | string) {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj
}

function base(contentType: ContentType, response: Partial<Response>): LambdaResponse {
  const statusCode = response.statusCode || 200
  const normalizedHeaders = response.headers ? normalizeResponseHeaders(response.headers) : {}
  const redir = statusCode > 299 && statusCode < 399

  if (!redir) {
    normalizedHeaders['content-type'] = contentType
  }

  return {
    isBase64Encoded: response.isBase64Encoded || false,
    statusCode,
    headers: normalizedHeaders,
    multiValueHeaders: response.multiValueHeaders ? normalizeResponseHeaders(response.multiValueHeaders) : {},
    body: stringifyObject(response.body || ''),
  }
}

export function html(response: Partial<Response>): LambdaResponse {
  return base(ContentType.Html, response)
}

export function json(response: Omit<Partial<Response>, 'body'> & { body: Record<string, unknown> }): LambdaResponse {
  return base(ContentType.Json, { ...response, body: stringifyObject(response.body) })
}

export function xml(response: Partial<Response>): LambdaResponse {
  return base(ContentType.Xml, response)
}
