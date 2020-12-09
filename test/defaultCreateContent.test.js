import { defaultCreateContent } from '../lib/defaultCreateContent'

export default async (test, assert) => {
  test('defaultCreateContent - basic', async () => {
    const doc = defaultCreateContent({
      content: 'original',
      head: {
        title: 'original'
      }
    })

    assert(/<title>original<\/title>/.test(doc))
    assert(/<body.+original/.test(doc))
  })
}
