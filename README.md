# Presta

[![npm version](https://img.shields.io/npm/v/presta?style=flat&colorA=4488FF&colorB=4488FF)](https://www.npmjs.com/package/presta)

Minimalist serverless framework.

### Features

- **flexible** — APIs, server-rendered apps, static sites, etc
- **unopinionated** — build whatever you want
- **no runtime** — use any frontend framework
- **thin** — not many features
- **small** — easy to contribute to
- **extensible** — simple plugin API
- **future-proof** — TypeScript + deploy anywhere

### Quick Start

Presta is just thin wrapper around AWS-flavored serverless functions + a simple
local dev server. Here's a simple Presta file, which you can run right now with
`npx presta dev index.ts`:

```typescript
// index.ts
import { Handler } from 'presta'

export const route: string = '*'

export const getStaticPaths: string[] = () => {
  return ['/']
}

export const handler: Handler = (ev, ctx) => {
  return {
    statusCode: 200,
    body: `You're looking at path ${ev.path}`,
  }
}
```

### Documentation

Docs can be found [here in the repo](docs). For the rest of the
ecosystem, see the following READMEs:

- [@presta/adapter-netlify]() — builds Presta for deployment to Netlify
- [@presta/adapter-vercel]() — builds Presta for deployment to Vercel
- [@presta/adapter-node]() — builds Presta for deployment to a custom node

## Contributing

We'd love your help getting Presta to `v1.0.0`. Have a look at the [contributing](https://github.com/sure-thing/presta/blob/master/CONTRIBUTING.md) doc or say hello in a [new Issue](https://github.com/sure-thing/presta/issues). Also please review our [code of conduct](https://github.com/sure-thing/presta/blob/master/CODE_OF_CONDUCT.md).

## License

MIT License © [Front of House](https://github.com/front-of-house)
