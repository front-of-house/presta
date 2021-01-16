const { defaultCreateContent } = require('../lib/defaultCreateContent')

module.exports = async (test, assert) => {
  test('defaultCreateContent - basic', async () => {
    const doc = defaultCreateContent({
      props: {
        content: 'original',
        head: {
          title: 'original'
        }
      }
    })

    assert(/<title>original<\/title>/.test(doc))
    assert(/<body.+original/.test(doc))
  })
}
