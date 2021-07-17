import tap from 'tap'

import { getRouteParams } from '../lib/getRouteParams'

tap.test('getRouteParams - basic', async (t) => {
  t.same(getRouteParams('/a', '/:slug'), { slug: 'a' })
  t.same(getRouteParams('/a/b', '/:page/:slug'), {
    page: 'a',
    slug: 'b',
  })
  t.same(getRouteParams('/a', '*'), { wild: 'a' })
})
