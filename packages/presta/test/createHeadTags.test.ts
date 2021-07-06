import {
  filterUnique,
  tag,
  prefixToObjects,
  createHeadTags
} from '../lib/createHeadTags'

export default async function (test, assert) {
  test('filterUnique', async () => {
    // takes last defined
    assert.deepEqual(
      filterUnique([
        { name: 'author', content: 'foo' },
        { name: 'author', content: 'bar' },
      ]),
      [
        { name: 'author', content: 'bar' },
      ]
    )

    assert.equal(
      filterUnique([
        { href: 'style.css' },
        { href: 'style.css' },
      ]).length,
      1
    )

    assert.equal(
      filterUnique([
        { src: 'index.js' },
        { src: 'index.js' },
        { src: 'vendor.js' },
      ]).length,
      2
    )

    assert.equal(
      filterUnique([
        `<style>.class { color: blue }</style>`,
        `<style>.class { color: blue }</style>`,
      ]).length,
      1
    )
  })

  test('objectToTag', async () => {
    const meta = tag('meta')({ name: 'author', content: 'foo' })
    assert(meta === `<meta name="author" content="foo" />`)

    const link = tag('link')({ rel: 'stylesheet', href: 'style.css' })
    assert(link === `<link rel="stylesheet" href="style.css" />`)

    const style = tag('style')({ id: 'style', children: '.class { color: blue }' })
    assert(style === `<style id="style">.class { color: blue }</style>`)

    const script = tag('script')({ id: 'script', children: 'function () {}' })
    assert(script === `<script id="script">function () {}</script>`)

    const str = tag('link')(`<link href="/foo" />`)
    assert(str === `<link href="/foo" />`)
  })

  test('prefixToObjects', () => {
    const objects = prefixToObjects('og', {
      url: 'test.com'
    })
    assert(objects[0].content === 'test.com')
  })

  test('createHeadTags - defaults', async () => {
    const head = createHeadTags({})

    assert(/Presta/.test(head))
    assert(/charset/.test(head))
    assert(/viewport/.test(head))
  })

  test('createHeadTags - basic', async () => {
    const head = createHeadTags({
      title: 'test',
      description: 'test description',
      og: {
        url: 'test.com'
      },
      twitter: {
        card: 'summary_large_image'
      },
      meta: [{ name: 'author', content: 'test' }],
      script: [`<script src="/test.js"></script>`]
    })

    assert(/<title>test/.test(head))
    assert(/name="description" content="test description.+\/>/.test(head))
    assert(/name="author" content="test.+\/>/.test(head))
    assert(/script.+src="\/test/.test(head))
  })

  test('twitter and og', async () => {
    const head = createHeadTags({
      title: 'test',
      description: 'test description'
    })

    assert(/og:title/.test(head))
    assert(/og:description/.test(head))
    assert(/twitter:title/.test(head))
    assert(/twitter:description/.test(head))
  })

  test('image shorthand', async () => {
    const head = createHeadTags({
      image: 'foo'
    })

    assert(/og:image/.test(head))
    assert(/twitter:image/.test(head))
  })

  test('url shorthand', async () => {
    const head = createHeadTags({
      url: 'foo'
    })

    assert(/og:url/.test(head))
    assert(/twitter:url/.test(head))
  })
}
