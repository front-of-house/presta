import toRegExp from 'regexparam'

import { PathParameters } from './lambda'

// @see https://github.com/lukeed/regexparam#usage
export function getRouteParams(url: string, route: string): PathParameters {
  const [path] = url.split('?')
  const result = toRegExp(route)
  let i = 0
  let out: PathParameters = {}
  let matches = result.pattern.exec(path) || []

  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i]
  }

  return out
}
