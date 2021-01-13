const { document } = require('../document')

module.exports = async (test, assert) => {
  test('document - works on its own', async () => {
    const doc = document({
      body: 'original',
      head: {
        title: 'original'
      }
    })

    assert(/<title>original<\/title>/.test(doc))
    assert(/<body.+original/.test(doc))
  })

  test('document - attributes work', async () => {
    const doc = document({
      body: 'original',
      head: {
        title: 'original'
      },
      bodyAttributes: {
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
