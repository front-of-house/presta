import { createRouter, PrestaDynamicFile } from '../lib/router'

export default async (test, assert) => {
  const router = createRouter([
    { route: '*' } as PrestaDynamicFile,
    { route: '/:slug' } as PrestaDynamicFile,
    { route: '/:page/:slug' } as PrestaDynamicFile
  ])

  test('router - match', async () => {
    assert(router('/a').route === '/:slug')
    assert(router('/posts/a').route === '/:page/:slug')
  })

  test('router - no match', async () => {
    assert(router('/posts/a/b').route === '*')
  })
}
