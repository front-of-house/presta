import toRegExp from 'regexparam'
import { Params } from 'lambda-types'

// @see https://github.com/lukeed/regexparam#usage
export function parsePathParameters(url: string, route: string): Params {
  const [path] = url.split('?')
  const result = toRegExp(route)
  let i = 0
  let out: Params = {}
  let matches = result.pattern.exec(path) || []

  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i]
  }

  return out
}
