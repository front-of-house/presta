import rsort from 'route-sort'
import toRegExp from 'regexparam'

export function createRouter (pages, userConfig) {
  const routes = pages.map(p => p.route)
  const sortedRoutes = rsort(routes)
  const sortedPages = sortedRoutes.map(r => {
    return pages.find(p => p.route === r)
  })
  const preparedRoutes = sortedPages.map(p => [toRegExp(p.route), p])

  return url => {
    for (const [{ pattern }, page] of preparedRoutes) {
      if (pattern.test(url)) return page
    }
  }
}
