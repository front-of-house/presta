![presta](https://user-images.githubusercontent.com/4732330/95477753-4aaec980-094e-11eb-9fa1-f2741b8233cd.png)

### The simple way to build the modern web.

> `presta` is in active beta. Questions, comments, ideas? Open an issue or PR!

Presta starts simple and stays simple. It provides familiar ergonomics, but
avoids opaque abstraction, giving more power (and responsibility) to the
developer.

At its core, presta requests paths – or routes – to render, and concatenates
strings returned from your pages into HTML documents. It can event render other
formats too, like JSON.

#### Installation

`presta` needs to be installed local to your project:

```bash
$ npm i presta
```

Help will always be given to those who ask for it:

```bash
$ npx presta help
```

## Quick Start

Pages in `presta` export two functions:

- `getPaths` - returns an array of routes to render
- `Page` - a function that returns a string

Given a page, `Home.js`, below...

```js
export function getPaths () {
  return ['/']
}

export function Page ({ pathname }) {
  return `<h1>You're on the home page ${pathname}</h1>`
}
```

...rendering is as simple as `npx presta <pages> <outDir>`:

```bash
$ npx presta build Home.js dist
```

#### Data Loading

`presta` includes a handy data loader that will look familiar to React users. It
can be used _with any_ fetching mechanism to resolve remote or other
asynchronous data.

```js
import { load } from 'presta/load'

export function getPaths() {
  return ['/']
}

export function Page ({ pathname }) {
  const data = load(
    async () => ...,
    { key: 'home' }
  ) // => { title: 'Hello world' }

  if (!data) return

  return `<h1>${data.title}</h1>`
}
```

#### Head Management

`presta` also provides an easy API for adding markup to the `<head>` of your
page.

```js
export function Page ({ pathname, head }) {
  // ...

  if (!data) return

  head({
    title: data.title,
    description: data.description
  })

  // ...
}
```

#### HTML Generation

To customize the HTML output of `presta`, provide a `presta.runtime.js` file.

Here, `createDocument` is passed the raw result of every `Page` function.
`document` expects at minimum a `body` property.

```js
import { document } from 'presta/document'

export function createDocument ({ body }) {
  return document({
    head: {
      title: 'Default Page Title',
      og: {
        image: '/static/og.png'
      }
    },
    body,
    foot: {
      scripts: [{ src: '/index.js' }]
    }
  })
}
```

## Everything Else

That's pretty much it, but there are a few other things that I need to document:

- full API for the included utilities
- generating dynamic pathnames
- caching optimizations
- concurrency
- dynamic rendering on a server (yay!)

## Roadmap

- Typescript support

### License

MIT License © [Eric Bailey](https://estrattonbailey.com)
