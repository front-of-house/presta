Presta is a _minimalist_ web framework. It provides a thin layer on top of familiar
serverless patterns to enable devs to build APIs and HTML pages extremely easily
and quickly.

#### Features

🔥 really really fast<br />
🍰 build serverless APIs<br />
📂 render HTML files (or any other format)<br />
📡 fetch data however you like<br />
📡 optionally co-locate data loading with components<br />
🙅 no browser runtime (it's a feature!)<br />
⚙️ TypeScript and JSX support built in<br />

#### Upcoming Features

- plugins API
- API actions API — like programatically trigger renders
- deploy adapters — like Netlify, Vercel

# Usage

You can get started with Presta directly from the command line:

```bash
npx presta watch index.js
```

`npx` will install Presta, and `watch` will boot a live-reloading dev server.
Then, create your `index.js` file.

We'll go into more detail on the anotomy of a Presta file soon, but for now,
this should get you started.

```javascript
/**
 * Define your route here — and name your file whatever you want!
 */
export const route = '/:slug?'

/**
 * Essentially an AWS-flavored serverless function
 *
 *    path             the URL
 *    headers          all request headers
 *    params           any route params, like :slug
 *    query            any query params, as an object
 *    lambda.event     the full lambda event
 *    lambda.context   the full lambda context
 */
export async function handler ({
  path,
  headers,
  params,
  query,
  lambda: { event, context }
}) {
  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'max-age=3600, public'
    },
    /*
     * You can return a response as a string,
     * like a normal serverless function
     */
    body: `<h1>Hello world!</h1>`,
    /*
     * Or you can use one of the shortcuts.
     * For example, `html` will set appropriate
     * headers and render HTML.
     */
    html: `<h1>I'm an HTML response</h1>`,
    /*
     * Similarly, `json` will set headers and
     * serialize an object into JSON.
     */
    json: {
      posts: [{ title: 'My First Blog Post' }]
    },
    /*
     * There's even an `xml` option for sitemaps!
     */
    xml: generateSitemap()
  }
}
```

At this point, you can visit the served URL (probably `localhost:4000`) in your
browser to view your HTML page or API response.

## Static Responses

So you've seen how to create a serverless function with Presta. But what if you
wanted to render one of those HTML files or JSON responses to a static file?

Add a `getStaticPaths` export. Any paths returned from this method will be
compared against `route`, passed to the `handler`, and saved to files for
deployment.

```javascript
export const route = '/:slug?'

export async function getStaticPaths () {
  return ['/']
}

export async function handler (props) {
  return {
    html: `<div>You're on ${props.path} page</div>`
  }
}
```

> What's neat about this approach is that the above acts as a _hybrid_ page.
> Requests for `/` will return the static HTML file. Any other requests, like
> `/about` or `/blog/posts/my-post` will render on the sever.

You can also specify extensions in the paths returned from `getStaticPaths`. To
generate static JSON, you could return `'/products.json'`, use the `json`
response shortcut, and you'll get a `products.json` file in your output
directory.

## HTML Helper

Since HTML response are such a large part of what Presta does, we've provided a
handy util. As you can see below, it's a simple interface for generating `head`
tags and such. More docs coming soon!

```javascript
import { html } from 'presta/html'

export async function handler (props) {
  return {
    html: html({
      title: 'Document Title',
      image: '/path/to/social-image.jpg',
      head: {
        meta: [{ name: 'description', content: 'Meta description' }],
        link: [{ rel: 'stylesheet', href: '/styles.css' }]
      },
      body: `<h1>Hello world!</h1>`,
      foot: {
        script: [{ src: '/index.js' }]
      }
    })
  }
}
```

## Data Loading

As you've seen, Presta is very much like a normal serverless function. So
loading data looks about the same in most cases.

```javascript
export const route = '/products/:category'

export async function handler (props) {
  const products = await getProducts({ category: props.params.category })

  return {
    html: `
      <ul>
        ${producs.map(
          prod => `
          <li>${prod.title}</li>
        `
        )}
      </ul>
    `
  }
}
```

In cases where you don't want to hit your APIs on every reload during
development, Presta provides a handy file cache. Just pass a `key` to specify
the data to be stored, and a `duration` in milliseconds to cache the response to
disk.

```javascript
import { cache } from 'presta/load'

// ...

export async function handler (props) {
  const products = cache(
    () => await getProducts({ category: props.params.category }),
    { key: 'products', duration: 60 * 1000 }
  )

  return {
    ...
  }
}
```

## React, TypeScript, etc

What about React or other javascript-based templating? TypeScript? We've got you covered.
Presta uses `esbuild` under the hood, which supports JSX and TS out of the box.
Just use the appropriate file extension i.e. `jsx` or `ts` and `tsx`.

Since Presta doesn't do any of the rendering for you, depending on the
templating library you'd like to use, you'll need to convert it to a string
first.

React, for example:

```javascript
// index.jsx
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function getStaticPaths () {
  return ['/']
}

export function handler () {
  return {
    html: renderToStaticMarkup(<div>Hello world!</div>)
  }
}
```

# FAQ

### What's this about co-located data fetching?

`presta/load` also exports a special `load` function which can be used _in
nested files_ throughout your project. You can then use another export, `flush`
to resolve all data and return your rendered templates. This is great because it
avoids extensive prop-drilling, and keeps your template files clean and concise.
Docs for this are coming soon.

### Will Presta ever build a frontend JavaScript runtime for me?

Probably. We're working on a React companion library for automatic partial
hydration and co-located data in the browser and on the server. At any rate, a
client-side runtime will _always_ be optional, and you can always BYOB.

### Additional Questions

If there's anything else you're curious about, [drop us a
line](https://github.com/sure-thing/presta/issues/new/choose). We'd love to hear
from you!
