- [Installation](#installation)
- [Running Presta](#running-presta)
  - [Build](#build)
  - [Watch](#watch)
- [Presta Context](#presta-context)
- [Configuration](#configuration)
  - [Pages](#pages)
  - [Output](#output)
  - [Assets](#assets)
  - [Transforming Content](#transforming-content)
  - [Custom Renderer](#custom-renderer)
  - [Config FAQ](#config-faq)
- [Creating Pages](#creating-pages)
  - [Static Pages](#static-pages)
  - [Dynamic Pages](#dynamic-pages)
  - [Hybrid Pages](#hybrid-pages)
  - [Page Head Metadata](#page-head-metadata)
- [Data Loading](#data-loading)
  - [Keys and Caching](#keys-and-caching)
  - [Co-location](#co-location)
- [Utilities](#utilities)
  - [presta/document](#prestadocument)
  - [presta/utils/merge](#prestautilsmerge)
- [Examples](#examples)
- [Roadmap](#roadmap)

<br />

Presta is an alternative to all-in-one web frameworks. You can use Presta to
render a single file, or many. You can integrate it as a small part of existing
projects, or use it to manage multiple microsites built with different
technologies. As a general rule, Presta aims to be an ecosystem of tools, not a
walled-garden platform.

#### Features

- create static pages, SSR routes, SPAs, or any combination
- no client-side runtime, but you can easily bring your own
- fast local development using [esm](https://github.com/standard-things/esm) to
  run your ESModule code (almost) natively
- can support (probably) any templating library written in JavaScript
- output any file format you need i.e. sitemaps or RSS feeds
- at ~1300 loc, it's small and maintainable (and we aim to keep it that way)

## Installation

```bash
$ npm i presta
```

```bash
Usage
  $ presta <command> [options]

Available Commands
  build    Render page(s) to output directory (defaults to ./build)
  watch    Watch and build page(s) to output directory

For more info, run any command with the `--help` flag
  $ presta build --help
  $ presta watch --help

Options
  -c, --config     Path to a config file.  (default ./presta.config.js)
  -a, --assets     Specify static asset directory.  (default ./public)
  --jsx            Specify a JSX pragma.  (default h)
  -v, --version    Displays current version
  -h, --help       Displays this message
```

## Running Presta

As seen above, you can run Presta one of two ways: `build` or `watch`.

#### Build

`build` will generate all static pages, compile a serverless function with any
configured dynamic pages, and copy any files from `./public` to the static
output directory for deployment.

#### Watch

`watch` does the same as `build`, but monitors your file structure for changes,
re-generating your files and reloading your browser on every change.

> `watch` doesn't do a full render to start, so if you're starting from an empty output
> directory, consider running `npx presta build` followed by `npx presta watch` to
> kick things off.

## Presta Context

Throughout the process, Presta passes around a object containing helpful context
related to the file being built.

For static files, it looks like this:

```js
{
  path: '/about', // the route being rendered
}
```

For dynamic files, it looks like this:

```js
{
  path: '/about',
  headers: {}, // lambda headers
  params: {}, // route params
  query: {}, // query params
  lambdaEvent: {}, // full lambda event
  lambdaContext: {}, // full lambda context
}
```

> This object will change. Namely, we need to determine how to attach
> utilities/plugins, and let them add values. Also, Presta currently relies on
> `content` and `head` objects to generate files, which kinda ruins the purity of
> this object.

## Configuration

In addition to the CLI, Presta will read from a config file, which defaults to
`presta.config.js` in the current working directory.

#### Pages

`pages` can be a single file, a glob, or an array of single files and globs.

```js
export const pages = 'src/pages/**/*.js'
```

#### Output

Defaults to `./build`.

```js
export const output = 'dist'
```

#### Assets

Directory for your static assets. Defaults to `./public`. These are copied to
the `output` directory on `presta build`.

```js
export const assets = 'assets'
```

#### Transforming Content

Out of the box, Presta will wrap your content in a basic HTML document. If you
need to customize this, or output a different type of document, define a
`createContent` export.

`createContent` is passed the full Presta context, and is required to return a
`string`. The default setup looks like this:

```js
import { document } from 'presta/document'

export function createContent (context) {
  return document({
    head: context.head,
    body: context.content
  })
}
```

> You can also define `createContent` at a page-level. If defined there, it will
> take precedence over the globally defined function in the config file.

`createContent` should simply return a string, and the filename depends on what
you return from `getStaticPaths`. So if you're rendering, say, JSON, those files might
look like this:

```js
// my-json-file.js

export function getStaticPaths () {
  return ['my-file.json']
}

export function template ({ path }) {
  return JSON.stringify({ path })
}
```

```js
// presta.config.js

export function createContent ({ body }) {
  return body
}
```

#### Custom Renderer

By default, Presta's render looks like this:

```js
export function render (template, context) {
  return template(context)
}
```

But, say you're using React:

```js
import { renderToStaticMarkup } from 'react-dom/server'

export function render (Template, context) {
  return renderToStaticMarkup(<Template {...context} />)
}
```

Easy as that. Soon we'll include more examples here! If you have suggestions,
[drop us a line.](https://github.com/sure-thing/presta/issues/new/choose)

#### Config FAQ

##### What properties are required in my config file?

None of them.

##### Can I define a custom `render` without a custom `createContent`?

Of course! If you need to render a templating language like React, you can
define a custom `render` and leave out `createContent`: it'll fallback to
Presta's default, but use your newly rendered React markup.

And it goes both ways. A custom `createContent` does not require a custom
`render` handler.

## Creating Pages

When rendering statically, Presta generates strings – via templates – and writes
them to files. For dynamic SSR rendered pages, it writes strings to HTTP
responses via a simple serverless function.

#### Static Pages

To create a static page, create a file that exports two functions:

- `getStaticPaths` - an async function that returns an array of strings
- `template` - a synchronous function that returns a string

```js
export async function getStaticPaths () {
  return ['/about']
}

export function template (ctx) {
  return `<h1>You're on page ${ctx.path}</h1>`
}
```

You can render this page – let's call it `About.js` – from the CLI:

```bash
$ npx presta build About.js
```

#### Dynamic Pages

To create dynamic pages, swap the `getStaticPaths` export with:

```js
export const route = '/about'
```

Now, a serverless function will be generated, and every hit to `/about` will
render a fresh `template`!

##### Additional Properties

Since dynamic routes are generated in response to server requests, we can
decorate the context with added properties.

Say you have a page configured like this:

```js
export const route = '/:slug'
export const template = ctx => `<div>...</div>`
```

And you hit `/about?foo=abc` in your browser. The `ctx` value above will look
like this:

```js
{
  path: '/about',
  params: { slug: 'about' },
  query: { foo: 'abc' },
  headers: { ... },
  lambdaEvent: { ... },
  lambdaContext: { ... },
}
```

#### Hybrid Pages

Pages in Presta can be both static and hybrid, which is great for sites that
want to do things like preview content, or that build infrequently between
content updates.

```js
import { load } from 'presta/load'

export const route = '/posts/:slug/:preview?'

export async function getStaticPaths () {
  const posts = await getAllPosts()
  return posts.map(p => p.slug)
}

export function template (ctx) {
  const { slug, preview } = ctx.params
  const post = load(() => getSinglePost({ slug, preview }), { key: 'posts' })

  return post ? `<article>${post.content}</article>` : ''
}
```

Although this is pseudo code, the page above could do a couple neat things if
set up correctly.

- Let's say you deploy and you visit `/posts/one` in your browser. You'll see the
  static page for the post with slug `one`.
- If you create a new post with slug `two`, you can visit it immediately at
  `/posts/two` _without rebuilding your site_.
- Say you create a draft version of `one`. You could visit `/posts/one/preview`
  – which won't match the static version of the page at `/posts/one` – and it
  could fetch you the draft version of your post instead!

#### Page Head Metadata

You'll probably want to manage your `<head>` metadata at a page level. Presta
provides a simple utility on its context for this:

```js
export function template ({ head }) {
  head({ title: 'My Page Title' })

  return `<div>...</div>`
}
```

> The API here is the same as that of the [presta/document](#prestadocument)
> below. Have a look at that to get an idea of what's available.

## Data Loading

Presta is unique in its approach to data loading. Instead of [prop
drilling](https://www.google.com/search?q=prop+drilling), it provides a utility
to co-locate your data with your templates and other components.

It should look familiar to React devs. And don't worry, it **works with any HTTP
request library you already use.**

```js
import { load } from 'presta/load'

export const route = '/:slug'

export function template ({ path }) {
  const data = load(
    () => {
      return fetch(`/api/page/${path}`).then(res => res.json())
    },
    { key: path }
  )

  return `<h1>Hello from ${data ? data.title : ''}</h1>`
}
```

Note the ternary. `data` here is undefined until the `fetch` resolves. Don't
forget: this is the server. No need for a loading state. In fact, feel free to
return nothing until the data resolves. The end result will be the same.

```js
export function template({ path }) {
  const data = load(...)

  if (!data) return '';

  return `<h1>Hello from ${data.title}</h1>`
}
```

#### Keys and caching

Keen observers may have noticed the `key` prop passed to `load`. The `key` here **is required** and serves a few purposes:

- indexing the data so Presta knows which loader requested what data
- caching the data into memory so it can be reused on other pages or by manually accessing it
- indexing an aggregate data object to render to the `window` of the final HTML file – hello frontend hydration

##### Does the loader run every time I make an edit to my template?

Yes, glad you asked. Since `load` lives within the `Page` function, it will be
run every time. However, if you need to avoid over-calling your API or CMS, you
can optionally cache the result of your loader to a local persistent file cache.

Below, though the `load` will be called every time the file is rendered, data
will only be fetched _at most_ every 60 seconds. You can use [any supported
value](https://github.com/vercel/ms) to denote the cache duration.

```js
export function template({ path }) {
  const data = load(..., { key: path, duration: '60s' })

  if (!data) return '';

  return `<h1>Hello from ${data.title}</h1>`
}
```

#### Co-location

Above, we fetched at a top level. But Presta doesn't care where or how many
times in your tree of components and functions `load` is called.

Say you've got a `Nav.js` component that fetches its links, which is used on
your `Home.js` homepage. Presta will load each of these independently and render
the template after all data has resolved.

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

export function getStaticPaths () {
  return ['/']
}

export function template ({ path }) {
  const data = load(getHomePage, { key: 'home' })

  return `
    ${Nav({ activePathname: path })}
    <h1>${data ? data.title : ''}</h1>
  `
}
```

##### How it works

Internally, Presta is simply rendering the page recursively. Again, nothing
fancy. When it encounters a `load`, it adds it to a queue. When the queue is
empty, it returns the full HTML result.

##### Is this slow?

Each render pass adds a millisecond or two, sure. The vast majority of time
rendering is spent fetching data, so in most cases that's what should be
optimized.

> We're working on documentation for further cache optimization. Check back
> soon!

##### Is this a footgun?

Yeah, it could be. But avoiding pitfalls like 30 separate loaders in a single template
or circular loads is fairly common sense stuff. However, in the future we could
probably implement a heuristic to handle most edge cases.

## Utilities

Presta exposes a couple things it uses internally because they might be helpful
to users.

#### presta/document

As seen above, Presta defaults to creating HTML documents for your pages. To do
so, it uses an internal function called `document`. Many users will need to
customize their documents, so it's exposed for easy access. Full example below:

```js
// presta.config.js

import { document } from 'presta/document'
import { merge } from 'presta/utils/merge'

export function createContent (ctx) {
  return document({
    head: merge(ctx.head, {
      title: 'My Site',
      image: '/social-image.png',
      meta: [{ name: 'description', content: 'My SEO description' }],
      link: [
        { rel: 'icon', href: '/favicon.png' },
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/svbstrate@4.1.2/dist/svbstrate.css'
        }
      ],
      script: [{ src: '/analytics.js' }]
    }),
    body: `<div id="root">${ctx.content}</div>`,
    foot: {
      script: [{ src: '/app.js' }]
    }
  })
}
```

#### presta/utils/merge

As seen above, Presta exposes a deep merge utility.

## Templating

Presta renders strings. So really, anything that can generate a string with
JavaScript should work as a templating solution - even plain strings themselves!

Strings get cumbersome pretty quickly, so let's talk about better options.

#### No config templating

No config here just means no [custom renderer](#custom-renderer) i.e. the
templating solution deals with strings directly and doesn't require a build or
render step.

A great option for this is
[hyposcript](https://github.com/sure-thing/hyposcript). It's a
[hyperscript](https://github.com/hyperhype/hyperscript) library (another solid
option for templating), but focused only on server-side rendering, which means
it's faster.

> Looking for an all-in-one? With
> [hypobox](https://github.com/sure-thing/hypobox), you can write fast JSX
> template with familiar CSS-in-JS ergonomics.

#### Some config templating

If you have existing templates or libraries you'd like to source, you can
probably configure a [custom renderer](#custom-renderer) for the job. Here's an
incomplete list of possibilities that should work just fine.

- [hyperscript](https://github.com/hyperhype/hyperscript)
- [React](https://reactjs.org/)
- [Preact](https://preactjs.com/)
- [htm](https://github.com/developit/htm)
- [nanohtml](https://github.com/choojs/nanohtml)
- [mustache](https://github.com/janl/mustache.js/) (anything in this family)
- [pug](https://github.com/pugjs/pug)

#### Markdown

If you're using markdown exclusively – like via `.md` files in your repo – then
maybe you don't need templating at all. Below is a quick sketch of what a
homepage generated from markdown might look like:

```js
import fs from 'fs'
import md from 'marked'

export function getStaticPaths () {
  return ['/']
}

export function template () {
  return md(fs.readFileSync('../content/home.md', 'utf-8'))
}
```

## Examples

Check out our [repo of examples](https://github.com/sure-thing/presta-examples).
If you'd like a different example, shoot us a PR or [open a new
issue](https://github.com/sure-thing/presta-examples/issues/new/choose) there.

## Roadmap

> Presta is in active development, but still in the early stages. If you've got
> ideas or suggestions for where it should go, [drop us a
> line.](https://github.com/sure-thing/presta/issues/new/choose)

#### Next up

- Webpack and Babel extension
- Typescript
- serverless API routes

#### Future plans

Since Presta is extremely small, it's got room to grow. Future looking features
will be built in a way that they can be _layered_ or _composed_, instead of
opting into the full feature set for every project like some larger frameworks
do.

> However, Presta is small and aims to stay small. Look for it to be used a
> single tool inside a larger abstraction or framework.
