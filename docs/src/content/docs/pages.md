---
title: Pages
order: 2
---

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

> With the above example, make sure to only include one of `body`, `html`,
> `json` or `xml`. All of these map to `Response.body`, and set separate
> `Content-Type` headers for convenience.
