import tap from 'tap'
import { html, filterUnique, tag, prefixToObjects, createHeadTags } from '../'

tap.test('html - works on its own', (t) => {
  const doc = html({
    body: 'original',
    head: {
      title: 'original',
    },
  })

  t.ok(doc.includes('<title>original</title>'))

  t.end()
})

tap.test('html - attributes work', (t) => {
  const doc = html({
    body: 'original',
    head: {
      title: 'original',
    },
    bodyAttributes: {
      // @ts-ignore TODO
      class: 'foo',
    },
    htmlAttributes: {
      lang: 'en',
    },
  })

  t.ok(doc.includes('<html lang="en"'))
  t.ok(doc.includes('<title>original</title>'))
  t.ok(doc.includes('class="foo'))

  t.end()
})

tap.test('filterUnique', (t) => {
  // takes last defined
  t.same(
    filterUnique([
      { name: 'author', content: 'foo' },
      { name: 'author', content: 'bar' },
    ]),
    [{ name: 'author', content: 'bar' }]
  )

  t.equal(filterUnique([{ href: 'style.css' }, { href: 'style.css' }]).length, 1)

  t.equal(filterUnique([{ src: 'index.js' }, { src: 'index.js' }, { src: 'vendor.js' }]).length, 2)

  t.equal(filterUnique([`<style>.class { color: blue }</style>`, `<style>.class { color: blue }</style>`]).length, 1)

  t.end()
})

tap.test('objectToTag', (t) => {
  const meta = tag('meta')({ name: 'author', content: 'foo' })
  t.equal(meta, `<meta name="author" content="foo" />`)

  const link = tag('link')({ rel: 'stylesheet', href: 'style.css' })
  t.equal(link, `<link rel="stylesheet" href="style.css" />`)

  const style = tag('style')({ id: 'style', children: '.class { color: blue }' })
  t.equal(style, `<style id="style">.class { color: blue }</style>`)

  const script = tag('script')({ id: 'script', children: 'function () {}' })
  t.equal(script, `<script id="script">function () {}</script>`)

  const str = tag('link')(`<link href="/foo" />`)
  t.equal(str, `<link href="/foo" />`)

  t.end()
})

tap.test('prefixToObjects', (t) => {
  const objects = prefixToObjects('og', {
    url: 'test.com',
  })
  t.equal(objects[0].content, 'test.com')

  t.end()
})

tap.test('createHeadTags - defaults', (t) => {
  const head = createHeadTags({})

  t.ok(head.includes('Presta'))
  t.ok(head.includes('charset'))
  t.ok(head.includes('viewport'))

  t.end()
})

tap.test('createHeadTags - basic', (t) => {
  const head = createHeadTags({
    title: 'test',
    description: 'test description',
    og: {
      url: 'test.com',
    },
    twitter: {
      card: 'summary_large_image',
    },
    meta: [{ name: 'author', content: 'test' }],
    script: [`<script src="/test.js"></script>`],
  })

  t.ok(head.includes('<title>test'))
  t.ok(head.includes('name="description" content="test description'))
  t.ok(head.includes('name="author" content="test'))
  t.ok(head.includes('src="/test.js"'))

  t.end()
})

tap.test('twitter and og', (t) => {
  const head = createHeadTags({
    title: 'test',
    description: 'test description',
  })

  t.ok(head.includes('og:title'))
  t.ok(head.includes('og:description'))
  t.ok(head.includes('twitter:title'))
  t.ok(head.includes('twitter:description'))

  t.end()
})

tap.test('image shorthand', (t) => {
  const head = createHeadTags({
    image: 'foo',
  })

  t.ok(head.includes('og:image'))
  t.ok(head.includes('twitter:image'))

  t.end()
})

tap.test('url shorthand', (t) => {
  const head = createHeadTags({
    url: 'foo',
  })

  t.ok(head.includes('og:url'))
  t.ok(head.includes('twitter:url'))

  t.end()
})
