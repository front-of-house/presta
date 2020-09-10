const { filterUnique, objectToTag, prefixToObjects, createHeadTags } = require('../createHeadTags')

module.exports = async function (test, assert) {
  test("filterUnique", async () => {
    const unique = filterUnique([
      { name: 'author', content: 'foo' },
      { name: 'author', content: 'bar' },
    ])

    assert(unique[0].content === 'foo')
  })

  test("objectToTag", async () => {
    const meta = objectToTag('meta', { name: 'author', content: 'foo' })
    assert(meta === `<meta name="author" content="foo" />`)
    const link = objectToTag('link', { rel: 'stylesheet', href: 'foo' })
    assert(link === `<link rel="stylesheet" href="foo" />`)
    const script = objectToTag('script', { src: 'foo' })
    assert(script === `<script src="foo"></script>`)
    const scriptWithChild = objectToTag('script', { children: 'foo' })
    assert(scriptWithChild === `<script>foo</script>`)
    const style = objectToTag('style', { children: 'foo' })
    assert(style === `<style>foo</style>`)
  })

  test('prefixToObjects', () => {
    const objects = prefixToObjects('og', {
      url: 'test.com'
    })
    assert(objects[0].content === 'test.com')
  })

  test("createHeadTags", async () => {
    const head = createHeadTags({
      title: 'test',
      description: 'test description',
      og: {
        url: 'test.com',
      },
      twitter: {
        card: 'summary_large_image',
      },
      meta: [
        { name: 'author', content: 'test' },
      ],
      script: [
        `<script src="/test.js"></script>`
      ]
    })

    assert(head === `<title>test</title>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="author" content="test" />
<meta property="og:description" content="test description" />
<meta property="og:url" content="test.com" />
<meta name="twitter:description" content="test description" />
<meta name="twitter:card" content="summary_large_image" />
<script src="/test.js"></script>`)
  })

  test("twitter and og", async () => {
    const head = createHeadTags({
      title: 'test',
      description: 'test description',
    })

    assert(head === `<title>test</title>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta property="og:description" content="test description" />
<meta name="twitter:description" content="test description" />`)
  })
}
