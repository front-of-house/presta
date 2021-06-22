import toRegExp from 'regexparam'

// @see https://github.com/lukeed/regexparam#usage
export function getRouteParams (url: string, route: string) {
  const result = toRegExp(route)
  let i = 0
  let out = {}
  let matches = result.pattern.exec(url)

  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i] || null
  }

  return out
}
