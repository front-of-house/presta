# Anatomy of a Presta file

Presta files are basically AWS-lambda flavored serverless functions with a thin
abstraction on layered on top. You can use them as purely serverless functions,
or purely as a way to generate static files.

### At a Glance

```typescript
import { Handler } from 'presta'

export const route = '*'

export const getStaticPaths: string[] = () => {
  return ['/', '/about']
}

export const handler: Handler = (ev, ctx) => {
  return {
    statusCode: 200,
    body: `You're on page ${ev.path}`,
  }
}
```

Running `presta dev` with the following file will start a server at
`localhost:4000`. It will generate static HTML files (the default static file
type) for the `/` and `/about` URL paths, and fall back to the serverless
`handler` function for all other requests.

### Routing

Presta doesn't use filesystem routing, leaving you free to use whatever
structure you'd prefer. Just specify the `files` globs in your config.

To build routes, Presta looks for a `route` export from each file. This value
can contain globs and path params, and depending on the platform, optional path
params. The following are all valid.

```typescript
export const route = '*'
export const route = '/'
export const route = '/path'
export const route = '/path/:slug'
export const route = '/:category/:slug'
export const route = '/:category/*'
export const route = '/:optional?'
```

> We do our best with optional params, but some platforms don't have a direct
> way to support them, like Netlify. In these cases, you may need to adjust your
> URL structure to make use of wildcards.

### Static Files

Even though Presta runs serverless functions, you can specify static paths that
will be fed to the function, rendered, and saved to disk as static files.

```typescript
export const getStaticPaths: string[] = () => {
  return ['/', '/about', '/sitemap.xml']
}
```

These static paths can contain extensions, just be sure to return a `body`
containing an XML document for `.xml` extensions, serialized JSON for `.json`,
etc.

Files with `getStaticPaths` don't _need_ to export a `route`, but they can. See
next section for details.

### Hybrid Files

As mentioned above, a single file can be used to generate static files AND serve
dynamic requests. This opens up a handful of usecases, like fallbacks for
recently published content that hasn't been statically generated yet, content
previews, and even the ability for other framework authors to integrate static
and dynamic functionality within a single Presta file.

### Route and Query Params

In line with AWS standards and other frameworks, the `event` passed to all
`handlers` contains route and query parameters.

- `pathParameters` — any `/:slug` route params defined in your `route` export
- `queryStringParameters` — parsed query params
- `multiValueQueryStringParameters` — parsed query params that contain more than
  one value

> If your file exports a `route` and the static paths returned from
> `getStaticPaths` match any route params or contain query params, your static
> files will recieve these properties as well!

### Convenience Methods

By default, if you return a string from a Presta `handler`, it will be served
and/or rendered as HTML with a `statusCode` of `200`.

```typescript
export const handler: Handler = (ev) => {
  return `<h1>I'm an HTML document</h1>`
}
```

However, a generic `Response` object will be handled by the browser. Here,
Presta doesn't want to make assumptions.

```typescript
export const handler: Handler = (ev) => {
  return {
    statusCode: 404,
    body: `<h1>I'm an HTML document</h1>`,
  }
}
```

This makes it convenient to use Presta as a site generator, as well as provides
a decent fallback state for errors.
