import rsort from 'route-sort'
import toRegExp from 'regexparam'

export function createRouter (pages, userConfig) {
  const routes = pages.map(p => p.path)
  const sortedRoutes = rsort(routes)
  const sortedPages = sortedRoutes.map(r => {
    return pages.find(p => p.path === r)
  })
  const preparedRoutes = sortedPages.map(p => [toRegExp(p.path), p])

  return url => {
    for (const [{ pattern }, page] of preparedRoutes) {
      if (pattern.test(url)) return page
    }
  }
}
