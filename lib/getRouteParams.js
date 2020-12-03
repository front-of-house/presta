import toRegExp from 'regexparam'

// @see https://github.com/lukeed/regexparam#usage
function exec (path, result) {
  let i = 0,
    out = {}
  let matches = result.pattern.exec(path)
  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i] || null
  }
  return out
}

export function getRouteParams (url, route) {
  return exec(url, toRegExp(route))
}
