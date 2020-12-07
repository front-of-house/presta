---
title: Creating Pages
description: "Pages in Presta are very simple. They should look familiar to anyone coming from a framework like Next.js or React Static. That's intentional: it's a good pattern."
slug: pages
linkTitle: Creating Pages
linkDescription: Easy peasy
---

Pages in Presta are very simple. They should look familiar to anyone coming from a framework like [Next.js](https://nextjs.org/) or [React Static](https://github.com/react-static/react-static). That's intentional: it's a good pattern.

There are a few other features we should cover though.

## Paths and routes

The first of two required exports of a Presta page is`getPaths`. It's async, so yes, you can fetch data here. For simple pages, you can just return a string like this:

```js
export async function getPaths () {
  return ['/']
}
```

Which would result in a root `index.html` file, like for your homepage. To render more routes, return more paths:

```js
import fetch from 'node-fetch'

export async function getPaths () {
  const pages = await fetch('/api/pages.json').then(res => res.json())
  return pages.map(page => `/page/${page.slug}`)
}
```

#### Can I fetch data for the page in `getPaths`?

Technically yeah, but don't. Presta has better ways of loading data for an individual page. Think: thin `getPaths`, fat `Page`s.

## Page and templates

The second required export is `Page`. `Page` is simply a function that returns a string. At its most simple, a `Page` function looks like this:

```js
export function Page ({ pathname }) {
  return '<h1>Hello world!</h1>'
}
```

Of course, your page probably has more markup than that. But you get the idea.

#### Does Presta support rendering anything other than strings?

You bet. In [the runtime file] you can define a custom renderer. **Yes,** you can use React.

## Metadata

Pages also have access to a handy util to help create meta data: `head`. Since your metadata is probably specific to every page, it's passed directly to the `Page` function:

```js
export function Page ({ pathname, head }) {
  head({ title: 'Home Page' })

  return '<h1>Hello world!</h1>'
}
```

The most common meta fields are configurable at a top level and serve as shorthands. The following will populate the site title and meta description, but also the Open Graph and Twitter meta data as well:

```js
head({
  title: 'Home Page',
  description: 'Meta description',
  image: '/path/to/image.png'
})
```

You can override Open Graph and Twitter data as well:

```js
head({
  og: {
    site_name: 'Presta'
  },
  twitter: {
    image: '/path/to/twitter.png'
  }
})
```

For everything else – `link`, `script`, `style` and more `meta` – you can provide them as arrays of objects:

```js
head({
  link: [{ rel: 'stylesheet', href: '/path/to/styles.css' }],
  script: [{ src: '/path/to/index.js' }],
  style: [{ children: '.blue { color: blue }' }],
  meta: [{ name: 'author', content: 'estrattonbailey' }]
})
```

#### What about shared default metadata?

Easy, just define it in [the config file](/presta/docs/configuration).
