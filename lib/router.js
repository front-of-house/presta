import rsort from 'route-sort'
import toRegExp from 'regexparam'

/**
 * This is used *within* the generated dynamic entry file
 *
 * @see https://github.com/lukeed/regexparam#usage
 */
export function createRouter (pages, config) {
  // get route paths
  const routes = rsort(pages.map(p => p.route))

  // in order, create matcher and associate page
  const preparedRoutes = routes.map(route => [
    toRegExp(route),
    pages.find(p => p.route === route)
  ])

  return url => {
    for (const [{ pattern }, page] of preparedRoutes) {
      if (pattern.test(url)) return page
    }
  }
}
