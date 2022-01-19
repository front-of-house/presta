import { parse as parseQuery } from 'query-string'
import { Params, MultiValueParams } from 'lambda-types'

export function parseQueryStringParameters(query: string) {
  const params = parseQuery(query, { arrayFormat: 'comma' })

  const queryStringParameters: Params = {}
  const multiValueQueryStringParameters: MultiValueParams = {}

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
