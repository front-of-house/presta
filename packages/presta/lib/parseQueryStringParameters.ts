/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import { parse as parseQuery } from 'query-string'
import { QueryStringParameters, MultiValueQueryStringParameters } from './lambda'

export function parseQueryStringParameters(query: string) {
  const params = parseQuery(query, { arrayFormat: 'comma' })

  const queryStringParameters: QueryStringParameters = {}
  const multiValueQueryStringParameters: MultiValueQueryStringParameters = {}

  for (const param of Object.keys(params)) {
    const value = params[param]
    if (Array.isArray(value)) {
      multiValueQueryStringParameters[param] = value
    } else if (value) {
      queryStringParameters[param] = value
    }
  }

  return { queryStringParameters, multiValueQueryStringParameters }
}
