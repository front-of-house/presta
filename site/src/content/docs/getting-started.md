---
title: Getting Started
description: "At its core, Presta requests paths to render (routes) and uses templates you provide to generate files based on those routes. That's it."
slug: getting-started
linkTitle: Getting Started
linkDescription: Small library, short docs.
prev: overview
---

At its core, Presta requests paths to render (routes) and uses templates you provide to generate files based on those routes. That's it. You'll probably want some data loading too, but we'll get to that.

### Installation

Presta needs to be installed locally to your project:

```bash
$ npm i presta
```

Don't forget, you can always ask the CLI for help:

```bash
$ npx presta -h
```

### Your first page

Pages are simple. They only require two things:

- `getPaths` - an async function that returns an array of strings
- `Page` - a sync function that returns a string AKA your template

```js
export async function getPaths () {
  return ['/about']
}

export function Page ({ pathname }) {
  return `<h1>Page is ${pathname}</h1>`
}
```

You can render this page – let's call it `About.js` – right from the CLI:

```bash
$ npx presta build About.js
```

This will generated an new file `/build/about/index.html` with content `<h1>Page is /about</h1>`. Neat!

#### General Notes

As you can see above, the default output directory for rendered files is `/build`. You can customize this using the CLI like this:

```bash
$ npx presta build About.js dist
```

Also, if you're rendering a directory of pages, the CLI also supports simple globs:

```bash
$ npx presta build pages/**/*.js
```

For info on this and more, check out the page on [configuration](/presta/docs/configuration).
