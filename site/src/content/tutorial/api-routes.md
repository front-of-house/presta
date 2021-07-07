---
meta_title: API Routes | Presta
sidebar_title: API Routes
sidebar_order: 3
---

# API Routes

You're probably starting to see how easy it is to generate HTML pages with
Presta, as well as drop-down to a more low-level serverless pattern.

For API routes, that's what we're dealing with: serverless functions.

Below is a working example.

```javascript
export const route = '/api/posts'

export async function handler() {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      posts: [{ title: 'Hello world!' }],
    }),
  }
}
```

As you saw in the previous section, Presta provides a convenience property for
`json`, that makes this a little more concise.

In fact, Presta will populate other required fields for serverless responses for
you, so to send a successful JSON response, all you really need is this:

```javascript
export const route = '/api/posts'

export async function handler() {
  return {
    json: {
      posts: [{ title: 'Hello world!' }],
    },
  }
}
```

> This goes for other responses too. Simply return the type of response you'd
> like using a convenience property, and Presta will take care of stringifying and
> setting required headers and status properties.

> You can actually generate static JSON files like this as well, if that
> interests you. Just export a `getStaticPaths` function and return filepaths
> with `.json` extensions.
