# Presta

[![npm version](https://img.shields.io/npm/v/presta?style=flat&colorA=4488FF&colorB=4488FF)](https://www.npmjs.com/package/presta) [![test coverage](https://img.shields.io/coveralls/github/sure-thing/presta?style=flat&colorA=223355&colorB=223355)](https://coveralls.io/github/sure-thing/presta?branch=main) [![npm bundle size](https://badgen.net/packagephobia/install/presta?color=223355&labelColor=223355)](https://packagephobia.com/result?p=presta)

Minimalist serverless framework for SSR, SSG, serverless APIs and more.

## Usage

In each file, define a route:

```js
export const route = '/products/:sku'
```

Or generate an array of static paths:

```js
export async function getStaticPaths() {
  return ['/products/book']
}
```

Or both, as a fallback for static files that aren't matched.

```js
export const route = '/products/:sku'

export async function getStaticPaths() {
  return ['/products/book']
}
```

Handlers are just... serverless handlers.

```js
export async function handler(event, context) {}
```

Return a string to render HTML:

```js
export async function handler(event, context) {
  return `<h1>Hello world!</h1>`
}
```

Or a normal serverless response object:

```js
export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `<h1>Hello world!</h1>`,
  }
}
```

For convenience, you can use a few shortcuts that automatically set
`Content-Type` headers, including `html`, `json`, and `xml`:

```js
export async function handler(event, context) {
  return {
    html: `<h1>Hello world!</h1>`,
  }
}
```

## Config

Peep the CLI with `npx presta -h` for more info. You can also define a config
file with any CLI options predefined:

```js
export const files = ['index.tsx', 'pages/*.jsx']
export const output = 'build'
export const assets = 'public'
```

## Deployment

Presta builds everything to `config.output`.

- static paths and assets to `<config.output>/static`
- serverless functions to `<config.output>/functions`

## Ecosystem

- [@presta/html](https://github.com/sure-thing/presta/tree/main/packages/html) — util for creating HTML pages
- [@presta/adapter-netlify](https://github.com/sure-thing/presta/tree/main/packages/adapter-netlify) — deployment adapter for Netlify
- [@presta/adapter-vercel](https://github.com/sure-thing/presta/tree/main/packages/adapter-vercel) — deployment adapter for Vercel
- [@presta/source-filesystem](https://github.com/sure-thing/presta/tree/main/packages/source-filesystem) — source and watch local files

## Contributing

We'd love your help getting Presta to `v1.0.0`. Have a look at the [contributing](https://github.com/sure-thing/presta/blob/master/CONTRIBUTING.md) doc or say hello in a [new Issue](https://github.com/sure-thing/presta/issues). Also please review our [code of conduct](https://github.com/sure-thing/presta/blob/master/CODE_OF_CONDUCT.md).

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
