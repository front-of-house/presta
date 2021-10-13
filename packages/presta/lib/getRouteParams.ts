import toRegExp from 'regexparam'
import { parse } from 'query-string'

import { RouteParams } from './types'

// @see https://github.com/lukeed/regexparam#usage
export function getRouteParams(url: string, route: string): RouteParams {
  const [path, query] = url.split('?')
  const result = toRegExp(route)
  let i = 0
  let out: RouteParams = {}
  let matches = result.pattern.exec(path) || []

  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i]
  }

  out = {
    ...parse(query),
    ...out,
  }

  return out
}
