import * as regExp from 'regexparam'

const toRegExp = regExp.default

// @see https://github.com/lukeed/regexparam#usage
export const exec = (path: string, result: {
  keys: string[];
  pattern: RegExp;
}) => {
  let i = 0,
    out = {}
  let matches = result.pattern.exec(path)
  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i] || null
  }
  return out
}

export const getRouteParams = (url: string, route: string) => {
  return exec(url, toRegExp(route))
}