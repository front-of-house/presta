# HTML Generation

Since HTML is a common use-case fo Presta, we've got a helper for that too. Pass
it HTML document properties and it will generate a string for you to pass as
your `Response['body']` property.

## At a Glance

Here's an example based on the Presta site's source code. All properties are
optional.

```typescript
import { html } from 'presta/html'

const body: string = html({
  htmlAttributes: {
    lang: 'en',
  },
  bodyAttributes: {
    id: 'main',
    class: 'main mb2',
    style: 'background: var(--light)',
  },
  head: {
    title: 'Presta | Minimalist Serverless Framework',
    description: `Minimalist serverless framework for APIs, server-rendered apps, static sites, and more.`,
    image: 'https://presta.run/og.png',
    twitter: {
      card: 'summary_large_image',
      site: 'presta_run',
    },
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'icon', type: 'image/svg', href: '/favicon.svg' },
      `<link rel="preconnect" href="https://fonts.googleapis.com">`,
      `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
      `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap" rel="stylesheet">`,
      { rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' },
      { rel: 'stylesheet', href: '/style.css' },
    ],
  },
  body: '<h1>Hello world</h1>',
})
```

> TypeScript is a huge help here at the moment, but we'll add more extensive
> docs in the future. Probably.
