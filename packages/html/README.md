# @presta/html

Util for generating HTML pages.

## Usage

Have a look at the source code and tests for all supported properties.

```javascript
import { html } from '@presta/html'

export const route = '*'

export async function handler(ev, ctx) {
  return html({
    head: {
      title: 'Presta',
      image: '/social.png',
      description: 'SEO Description.',
      og: {
        url: 'https://presta.run',
      },
      twitter: {
        site: '@presta_run',
      },
      link: [{ rel: 'stylesheet', href: '/style.css' }],
      meta: [{ name: 'viewport', content: '' }],
      script: [{ src: '/critical.js' }],
    },
    body: '<h1>Hello world!</h1>',
    foot: {
      script: [{ src: '/critical.js' }],
    },
  })
}
```

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
