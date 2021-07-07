---
meta_title: Pages | Presta
sidebar_title: Pages
sidebar_order: 2
---

# Pages

Since Presta is just regular serverless functions, you can use it to build APIs
and even other file types. But to start off, let's look closer at building HTML
pages.

### Dynamic Pages

On the previous page, you saw how Presta can run a low level serverless
function. When talking about pages of a website, we can refer to these as
"dynamic pages", meaning they're generated on a server on each request.

Below is another working example of a homepage in Presta.

```javascript
export const route = '/'

export async function handler() {
  return `<h1>Hello world</h1>`
}
```

> Note, if you return a string, Presta assumes it's HTML and automatically
> appends the correct headers and such.

### Static Pages

To create static pages, you need to tell Presta what routes to render
statically.

To do this, export a `getStaticPaths` function that returns an array of URL
pathname strings. Below, an `/index.html` file will be generated.

```javascript
export async function getStaticPaths() {
  return ['/']
}

export async function handler() {
  return `<h1>Hello world</h1>`
}
```

> Static paths don't have to be just HTML. If you provide an extension — say
> `/products.json` — Presta will instead generate that file type.

### Hybrid Pages

Presta also supports files that are _both static and dynamic._ Just define your
route while simultaneously defining which paths should be built statically.

```javascript
export const route = ':slug'

export async function getStaticPaths() {
  return ['/']
}

export async function handler(props) {
  return `<h1>${props.path} and ${props.params.slug}</h1>`
}
```

A user hitting `/` will be served an `index.html` file, whereas any other route
will be rendered and served from a serverless function.

> The bonus you get when making hybrid pages is that Presta can parse route
> params for you based on your exported `route`. It also sets you up to do
> "preview routes", but we'll get to that later.

### Custom Document

Since Presta is so simple — it's just a lambda! — everything happens here in
your source files.

To render a custom HTML document, just return it from your `handler`.

```javascript
export const route = '/'

export async function handler() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Site</title>
        <meta name='description' content='My SEO description' />
      </head>
      <body>
        <h1>Hello world!</h1>
      </body>
    </html>
  `
}
```

This can get kind of cumbersome though, so Presta provides a handy util to build
up custom documents with ease.

```javascript
import { html } from 'presta/html'

export const route = '/'

export async function handler() {
  return html({
    head: {
      title: 'My Site',
      description: 'My SEO description',
    },
    body: `<h1>Hello world!</h1>`,
  })
}
```

> The `html` helper can also be used to define other `<head>` tags like `meta`,
> `style`, `link`, as well as tags like `script` that you may need to insert
> before the closing `</body>` tag. Check out the API section for more
> information.

### Custom Responses

For many pages, returning a string is all you need. But if you need to send
custom headers or a custom `statusCode`, don't forget you can always drop down
to a more regular serverless response.

```javascript
import { html } from 'presta/html'

export const route = '/'

export async function handler () {
  return {
    statusCode: 404,
    headers: { 'Content-Type': 'text/html' },
    body: html({ ... })
  }
}
```

And if that's too much typing, Presta provides a convenience prop that
automatically sets HTML content type headers.

```javascript
import { html } from 'presta/html'

export const route = '/'

export async function handler () {
  return {
    statusCode: 404,
    html: html({ ... })
  }
}
```

> Other convenience properties include `json` and `xml`.
