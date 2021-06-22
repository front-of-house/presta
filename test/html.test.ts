import { html } from '../lib/html'

export default async (test, assert) => {
  test('html - works on its own', async () => {
    const doc = html({
      body: 'original',
      head: {
        title: 'original'
      }
    })

    assert(/<title>original<\/title>/.test(doc))
    assert(/<body.+original/.test(doc))
  })

  test('html - attributes work', async () => {
    const doc = html({
      body: 'original',
      head: {
        title: 'original'
      },
      bodyAttributes: {
        // @ts-ignore TODO
        class: 'foo'
      },
      htmlAttributes: {
        lang: 'en'
      }
    })

    assert(/<title>original<\/title>/.test(doc))
    assert(/<body.+original/.test(doc))
    assert(/<body.+class="foo"/.test(doc))
    assert(/<html lang="en"/.test(doc))
  })
}
