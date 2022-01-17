import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { html, filterUnique, tag, prefixToObjects, createHeadTags } from '../index'

const test = suite('@presta/html')

test('html - works on its own', () => {
  const doc = html({
    body: 'original',
    head: {
      title: 'original',
    },
  })

  assert.ok(doc.includes('<title>original</title>'))
})

test('html - attributes work', () => {
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

  assert.ok(doc.includes('<html lang="en"'))
  assert.ok(doc.includes('<title>original</title>'))
  assert.ok(doc.includes('class="foo'))
  assert.ok(doc.includes('https://presta.run/favicon.svg'))
})

test('filterUnique', () => {
  // takes last defined
  assert.equal(
    filterUnique([
      { name: 'author', content: 'foo' },
      { name: 'author', content: 'bar' },
    ]),
    [{ name: 'author', content: 'bar' }]
  )

  assert.equal(filterUnique([{ href: 'style.css' }, { href: 'style.css' }]).length, 1)

  assert.equal(filterUnique([{ src: 'index.js' }, { src: 'index.js' }, { src: 'vendor.js' }]).length, 2)

  assert.equal(
    filterUnique([`<style>.class { color: blue }</style>`, `<style>.class { color: blue }</style>`]).length,
    1
  )
})

test('objectToTag', () => {
  const meta = tag('meta')({ name: 'author', content: 'foo' })
  assert.equal(meta, `<meta name="author" content="foo" />`)

  const link = tag('link')({ rel: 'stylesheet', href: 'style.css' })
  assert.equal(link, `<link rel="stylesheet" href="style.css" />`)

  const style = tag('style')({ id: 'style', children: '.class { color: blue }' })
  assert.equal(style, `<style id="style">.class { color: blue }</style>`)

  const script = tag('script')({ id: 'script', children: 'function () {}' })
  assert.equal(script, `<script id="script">function () {}</script>`)

  const str = tag('link')(`<link href="/foo" />`)
  assert.equal(str, `<link href="/foo" />`)
})

test('prefixToObjects', () => {
  const objects = prefixToObjects('og', {
    url: 'test.com',
  })
  assert.equal(objects[0].content, 'test.com')
})

test('createHeadTags - defaults', () => {
  const head = createHeadTags({})

  assert.ok(head.includes('Presta'))
  assert.ok(head.includes('charset'))
  assert.ok(head.includes('viewport'))
})

test('createHeadTags - basic', () => {
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

  assert.ok(head.includes('<title>test'))
  assert.ok(head.includes('name="description" content="test description'))
  assert.ok(head.includes('name="author" content="test'))
  assert.ok(head.includes('src="/test.js"'))
})

test('twitter and og', () => {
  const head = createHeadTags({
    title: 'test',
    description: 'test description',
  })

  assert.ok(head.includes('og:title'))
  assert.ok(head.includes('og:description'))
  assert.ok(head.includes('twitter:title'))
  assert.ok(head.includes('twitter:description'))
})

test('image shorthand', () => {
  const head = createHeadTags({
    image: 'foo',
  })

  assert.ok(head.includes('og:image'))
  assert.ok(head.includes('twitter:image'))
})

test('url shorthand', () => {
  const head = createHeadTags({
    url: 'foo',
  })

  assert.ok(head.includes('og:url'))
  assert.ok(head.includes('twitter:url'))
})

test.run()
