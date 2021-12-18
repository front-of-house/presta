import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { getRouteParams } from '../getRouteParams'

const test = suite('presta - getRouteParams')

test('getRouteParams - basic', async () => {
  assert.equal(getRouteParams('/a', '/a'), {})
  assert.equal(getRouteParams('/a', '/:slug'), { slug: 'a' })
  assert.equal(getRouteParams('/a?query', '/:slug'), { slug: 'a' })
  assert.equal(getRouteParams('/a/b', '/:page/:slug'), {
    page: 'a',
    slug: 'b',
  })
  assert.equal(getRouteParams('/a', '*'), { wild: 'a' })
  assert.equal(getRouteParams('/a?query', '*'), { wild: 'a' })
})

test.run()
