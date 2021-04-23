const rsort = require('route-sort')
const toRegExp = require('regexparam')

/**
 * This is used *within* the generated dynamic entry file
 *
 * @see https://github.com/lukeed/regexparam#usage
 */
function createRouter (files, config) {
  // get route paths
  const routes = rsort(files.map(p => p.route))

  // in order, create matcher and associate page
  const preparedRoutes = routes.map(route => [
    toRegExp(route),
    files.find(p => p.route === route)
  ])

  return url => {
    for (const [{ pattern }, page] of preparedRoutes) {
      if (pattern.test(url)) return page
    }
  }
}

module.exports = { createRouter }
