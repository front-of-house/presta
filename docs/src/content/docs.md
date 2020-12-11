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

## Pages

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
render a fresh `template`.

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

#### Transforming Content

Out of the box, Presta will wrap your content in a basic HTML document. If you
need to customize this, or output a different type of document, define a
`createContent` export.

`createContent` is passed the full Presta context, and is required to return a
`string`. The default looks like this:

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
