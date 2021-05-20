---
title: Static Pages
order: 3
---

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
