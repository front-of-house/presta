import toRegExp from 'regexparam'

import type { RouteParams } from '../'

// @see https://github.com/lukeed/regexparam#usage
export function getRouteParams (url: string, route: string): RouteParams {
  const result = toRegExp(route)
  let i = 0
  let out: RouteParams = {}
  let matches = result.pattern.exec(url)

  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i] || null
  }

  return out
}
