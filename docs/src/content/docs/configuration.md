---
title: Configuration
description: 'Presta supports a simple config file where you can define what pages you want rendered and your output directory, as well as augment the render and file creation process.'
slug: configuration
linkTitle: Configuration
linkDescription: Sane defaults, easy extension
---

Presta supports a simple config file where you can define what pages you want rendered and your output directory, as well as augment the render and file creation process.

By default, the config file is called `presta.config.js` and is located in your project's root. If you want to use a custom file, you can pass the file path as an option to the CLI:

```bash
$ npx presta build About.js -c path/to/config.js
```

## Pages and output

Instead of using the CLI to define your pages and output directory every time, you can set these options using the config file.

```js
// presta.config.js
export const pages = 'src/pages/**/*.js'
export const output = 'dist'
```

## Document creation

By default, Presta will automatically interpolate your template into a predefined HTML document, which is then written to a file. To customize how this document is created, you can define a simple `createDocument` export in your config file.

Presta provides a `document` helper for this purpose. In fact, it's used internally as the default. Here's what it looks like at its most basic:

```js
// presta.config.js
import { document } from 'presta/document'

export function createDocument (context) {
  return document(context)
}
```

The `context` param is an object with the following properties:

- `pathname` - the path string being rendered, returned from `getPaths`
- `body` - the result of the template
- `head` - any metadata added using the `head()` helper within the template
- `data` - any data loaded with `presta/load`, indexed by `key`

#### The `document` helper

The `document` helper accepts three properties:

- `body` - the `string` you want output between the `<body>` tags of your document
- `head` - an `object` with the same API as the [page `head` helper](/presta/docs/pages#Metadata), output between the `<head>` tags
- `foot` - an `object`, same API as `head`, but output just before the closing `</body>` tag

For example, imagine you want to define a root element to wrap all your pages, and a default page title in case a child page doesn't define its own.

```js
export function createDocument (context) {
  return document({
    body: `<div id="root">${context.body}</div>`,
    head: {
      title: 'Presta',
      ...context.head
    }
  })
}
```

As you can see, you can simply manually merge values to generate your document. However, for convenience, you can also pass multiple objects and they'll be merged in order. This allows you to define defaults as the first object, and override with greater specificity by layering on top of the defaults.

A more robust example:

```js
export function createDocument (context) {
  return document(
    {
      head: {
        title: 'Presta',
        og: { type: 'website' }
      },
      foot: {
        scripts: [{ src: '/static/index.js' }]
      }
    },
    context,
    { body: `<div id="root">${context.body}</div>` }
  )
}
```

#### What if I'm not rendering HTML?

`createDocument` should simply return a string, and the filename depends on what you return from `getPaths`. So if you're rendering, say, JSON, those files might look like this:

```js
// MyJSONFile.js
export function getPaths () {
  return ['my-file.json']
}
export function Page ({ pathname }) {
  return JSON.stringify({ pathname })
}
```

```js
// presta.config.js
export function createDocument ({ body }) {
  return body
}
```

**Note:** eventually we aim to support exporting `createDocument` from the "page" itself, so that you can override the document creation step on a per-file basis.

## Custom renderers

Most likely, you won't actually be using strings as templates, as they can get pretty verbose. Maybe you have a favorite templating language and are wondering, "how can I use X?".

Presta will also look for a `render` export from your config file, and if present, run that function _prior_ to `createDocument`. The returned value of `render` should be a string, and then becomes the `body` value passed to `createDocument`.

Presta's default render looks like this:

```js
export function render (Page, context) {
  return Page(context)
}
```

But, say you're using React:

```js
import { renderToStaticMarkup } from 'react-dom/server'

export function render (Page, context) {
  return renderToStaticMarkup(<Page {...context} />)
}
```

Easy as that. Soon we'll include more examples here! If you have suggestions, [drop us a line.](https://github.com/sure-thing/presta/issues/new/choose)

## FAQ

#### What properties are required in my config file?

None of them.

#### Can I define a custom `render` without a custom `createDocument`?

Of course! If you need to render a templating language like React, you can define a custom `render` and leave out `createDocument`: it'll fallback to Presta's default, but use your newly rendered React markup.

And it goes both ways. A custom `createDocument` does not require a custom `render` handler.

#### Can I define an array of pages?

You bet. `export const pages = [ 'page/to/Page.js' ]` is just as valid as `[ 'path/to/*.js' ]` or `[ 'path/to/*.js', 'some/new/Page.js']`.
