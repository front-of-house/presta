import rsort from 'route-sort'
import toRegExp from 'regexparam'

import type { PrestaContext } from './createContext'
import type { Response } from './normalizeResponse'

export type PrestaDynamicFile = {
  route: string
  handler(context: PrestaContext): Promise<Response>
}

/**
 * This is used *within* the generated dynamic entry file
 *
 * @see https://github.com/lukeed/regexparam#usage
 */
export function createRouter (files: PrestaDynamicFile[]) {
  // get route paths
  const routes = rsort(files.map(p => p.route))

  // in order, create matcher and associate page
  // @ts-ignore
  const preparedRoutes: [ReturnType<typeof toRegExp>, PrestaDynamicFile][] = routes.map(route => [
    toRegExp(route),
    files.find(p => p.route === route)
  ])

  return (url: string) => {
    for (const [{ pattern }, page] of preparedRoutes) {
      if (pattern.test(url.split('?')[0])) return page
    }
  }
}
