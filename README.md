# presta ![npm](https://img.shields.io/npm/v/presta)

A flexible site generator, for both static and server rendered pages.

> `presta` is still in beta, but I'm actively using it on a few side projects
> and plan to continue development. Questions, comments, ideas? Open an issue or
> PR!

### Features

- zero config
- zero runtime
- ergonomic dataloading
- render any file type, not just HTML

### Install

You can use it as a global executable with `npx`:

```bash
$ npx presta help
```

Or install locally to your project if you're using the included utilities:

```bash
$ npm i presta -D
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
import { head } from 'presta/head'

export function Page ({ pathname }) {
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
- generating pathnames
- caching optimizations
- concurrency
- dynamic rendering on a server (yay!)

## Roadmap

- Typescript - supported experimentally atm, but the library itself isn't typed

### License

MIT License © [Eric Bailey](https://estrattonbailey.com)
