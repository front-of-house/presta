import {
  html,
  filterUnique,
  tag,
  prefixToObjects,
  createHeadTags
} from '.'

test('html - works on its own', async () => {
  const doc = html({
    body: 'original',
    head: {
      title: 'original'
    }
  })

  expect(doc).toContain('<title>original<\/title>')
  expect(doc).toContain('original')
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

  expect(doc).toContain('<html lang="en"')
  expect(doc).toContain('<title>original<\/title>')
  expect(doc).toContain('original')
  expect(doc).toContain('class="foo')
})

test('filterUnique', async () => {
  // takes last defined
  expect(
    filterUnique([
      { name: 'author', content: 'foo' },
      { name: 'author', content: 'bar' },
    ])
  ).toEqual(
    [{ name: 'author', content: 'bar' }]
  )

  expect(
    filterUnique([
      { href: 'style.css' },
      { href: 'style.css' },
    ]).length
  ).toEqual(1)

  expect(
    filterUnique([
      { src: 'index.js' },
      { src: 'index.js' },
      { src: 'vendor.js' },
    ]).length
  ).toEqual(2)

  expect(
    filterUnique([
      `<style>.class { color: blue }</style>`,
      `<style>.class { color: blue }</style>`,
    ]).length
  ).toEqual(1)
})

test('objectToTag', async () => {
  const meta = tag('meta')({ name: 'author', content: 'foo' })
  expect(meta).toEqual(`<meta name="author" content="foo" />`)

  const link = tag('link')({ rel: 'stylesheet', href: 'style.css' })
  expect(link).toEqual(`<link rel="stylesheet" href="style.css" />`)

  const style = tag('style')({ id: 'style', children: '.class { color: blue }' })
  expect(style).toEqual(`<style id="style">.class { color: blue }</style>`)

  const script = tag('script')({ id: 'script', children: 'function () {}' })
  expect(script).toEqual(`<script id="script">function () {}</script>`)

  const str = tag('link')(`<link href="/foo" />`)
  expect(str).toEqual(`<link href="/foo" />`)
})

test('prefixToObjects', () => {
  const objects = prefixToObjects('og', {
    url: 'test.com'
  })
  expect(objects[0].content).toEqual('test.com')
})

test('createHeadTags - defaults', async () => {
  const head = createHeadTags({})

  expect(head).toContain('Presta')
  expect(head).toContain('charset')
  expect(head).toContain('viewport')
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

  expect(head).toContain('<title>test')
  expect(head).toContain('name="description" content="test description')
  expect(head).toContain('name="author" content="test')
  expect(head).toContain('src="/test.js"')
})

test('twitter and og', async () => {
  const head = createHeadTags({
    title: 'test',
    description: 'test description'
  })

  expect(head).toContain('og:title')
  expect(head).toContain('og:description')
  expect(head).toContain('twitter:title')
  expect(head).toContain('twitter:description')
})

test('image shorthand', async () => {
  const head = createHeadTags({
    image: 'foo'
  })

  expect(head).toContain('og:image')
  expect(head).toContain('twitter:image')
})

test('url shorthand', async () => {
  const head = createHeadTags({
    url: 'foo'
  })

  expect(head).toContain('og:url')
  expect(head).toContain('twitter:url')
})
