import toRegExp from 'regexparam'

import { RouteParameters } from './types'

// @see https://github.com/lukeed/regexparam#usage
export function getRouteParams(url: string, route: string): RouteParameters {
  const [path] = url.split('?')
  const result = toRegExp(route)
  let i = 0
  let out: RouteParameters = {}
  let matches = result.pattern.exec(path) || []

  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i]
  }

  return out
}
