---
title: Data Loading
description: 'Render hybrid pages from a server or statically, with convenient co-located data loading. No more prop drilling or fat data files.'
slug: data-loading
linkTitle: Data Loading
linkDescription: Powerful & co-located queries
next: getting-started
---

Fetching data in static and server applications can get hairy. And most of the time, data is fetched at a top level and [prop drilled](https://www.google.com/search?q=prop+drilling) to reach nested components.

In purely frontend applications, devs often take advantage of co-locating data fetching with their components i.e. on `componentDidMount` or similar.

Presta favors the latter, but makes it work in a server context.

## Fetching data for a page

As an example, let's create an empty `About.js` page.

```js
export function getPaths () {
  return ['/about']
}

export function Page ({ pathname }) {
  return ''
}
```

To fetch our data, we need to use Presta's loading mechanism. Don't worry, it **works with any HTTP request library you already use.**

```js
import { load } from 'presta/load'
```

Loading data will look familiar to React devs:

```js
export function Page ({ pathname }) {
  const data = load(
    () => {
      return fetch(`/api/page/${pathname}`).then(res => res.json())
    },
    { key: pathname }
  )

  return `<h1>Hello from ${data ? data.title : ''}</h1>`
}
```

Note the ternary. `data` here is undefined until the `fetch` resolves. Don't forget: this is the server. No need for a loading state. In fact, feel free to return nothing until the data resolves. The end result will be the same.

```js
export function Page({ pathname }) {
  const data = load(...)

  if (!data) return '';

  return `<h1>Hello from ${data.title}</h1>`
}
```

## Keys and caching

Keen observers may have noticed the `key` prop passed to `load`. The `key` here **is required** and serves a few purposes:

- indexing the data so Presta knows which loader requested what data
- caching the data into memory so it can be reused on other pages or by manually accessing it
- indexing an aggregate data object to render to the `window` of the final HTML file – hello frontend hydration

#### Does the loader run every time I make an edit to my template?

Yes, glad you asked. Since `load` lives within the `Page` function, it will be run every time. However, if you need to avoid over-calling your API or CMS, you can optionally cache the result of your loader to a local persistent file cache.

Below, though the `load` will be called every time the file is rendered, data will only be fetched _at most_ every 60 seconds. You can use [any supported value](https://github.com/vercel/ms) to denote the cache duration.

```js
export function Page({ pathname }) {
  const data = load(..., { key: pathname, duration: '60s' })

  if (!data) return '';

  return `<h1>Hello from ${data.title}</h1>`
}
```

## Something something co-located?

Above, we fetched at a top level. But Presta doesn't care where or how many times in your tree of components and functions `load` is called.

Say you've got a `Nav.js` component that fetches its links, which is used on your `Home.js` homepage. Presta will load each of these independently and render the template after all data has resolved.

```js
// Nav.js
import { load } from 'presta/load'

export function Nav ({ activePathname }) {
  const links = load(getNavLinks, { key: 'nav' })

  if (!links) return ''

  const cx = link.url === activePathname ? 'active' : ''

  return links.map(
    link => `<a href="${link.url}" class="${cx}">${link.title}</a>`
  )
}
```

```js
// Home.js
import { load } from 'presta/load'
import { Nav } from './Nav.js'

export function getPaths () {
  return ['/']
}

export function Page ({ pathname }) {
  const data = load(getHomePage, { key: 'home' })

  return `
    ${Nav({ activePathname: pathname })}
    
    <h1>${data ? data.title : ''}</h1>
  `
}
```

## How it works

Internally, Presta is simply rendering the page recursively. Again, nothing fancy. When it encounters a `load`, it adds it to a queue. When the queue is empty, it returns the full HTML result.

#### Is this slow?

Each render pass adds a millisecond or two, sure. The vast majority of time rendering is spent fetching data, so in most cases that's what should be optimized. Have a look at [cache optimizations] as well.

#### Is this a footgun?

Yeah, it could be. But again, Presta tries to give the developer more responsibility. Avoiding pitfalls like 30 separate loaders in a single template or circular loads is fairly common sense stuff. However, in the future we could probably implement a heuristic to handle most edge cases.
