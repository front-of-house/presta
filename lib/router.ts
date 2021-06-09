import * as rSort from 'route-sort'
import * as regExp from 'regexparam'
import config from './types/config'

const rsort = rSort.default
const toRegExp = regExp.default

/**
 * This is used *within* the generated dynamic entry file
 *
 * @see https://github.com/lukeed/regexparam#usage
 */
export const createRouter = (files: any[], config: config) => {
  // get route paths
  const routes = rsort(files.map(p => p.route))

  // in order, create matcher and associate page
  const preparedRoutes = routes.map(route => [
    toRegExp(route),
    files.find(p => p.route === route)
  ])

  return (url: string) => {
    for (const [{ pattern }, page] of preparedRoutes) {
      if (pattern.test(url)) return page
    }
  }
}
