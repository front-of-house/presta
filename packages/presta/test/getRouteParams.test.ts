import { getRouteParams } from '../lib/getRouteParams'

export default async (test, assert) => {
  test('getRouteParams - basic', async () => {
    assert.deepEqual(getRouteParams('/a', '/:slug'), { slug: 'a' })
    assert.deepEqual(getRouteParams('/a/b', '/:page/:slug'), {
      page: 'a',
      slug: 'b',
    })
    assert.deepEqual(getRouteParams('/a', '*'), { wild: 'a' })
  })
}
