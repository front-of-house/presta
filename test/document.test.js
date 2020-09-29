import { document } from '../document'

export default async (test, assert) => {
  test('document - works on its own', async () => {
    const doc = document({
      body: 'original',
      head: {
        title: 'original'
      }
    })

    assert(/<title>original<\/title>/.test(doc))
    assert(/<body>original/.test(doc))
  })

  test('document - merges contexts correctly', async () => {
    const doc = document(
      {
        body: 'original',
        head: {
          title: 'original'
        }
      },
      {
        body: '<div id="root">original</div>',
        head: {
          title: 'override'
        }
      }
    )

    assert(/<title>override<\/title>/.test(doc))
    assert(/<div id="root">original<\/div>/.test(doc))
  })
}
