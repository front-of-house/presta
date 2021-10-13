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

tap.test('getRouteParams - with query string', async (t) => {
  t.same(getRouteParams('/a?bool', '/:slug'), { slug: 'a', bool: null })
  t.same(getRouteParams('/a/b?bool&str=value', '/:page/:slug'), {
    page: 'a',
    slug: 'b',
    bool: null,
    str: 'value',
  })
  t.same(getRouteParams('/a?number=1', '*'), { wild: 'a', number: 1 })
})
