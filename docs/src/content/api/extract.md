---
meta_title: extract() | API | Presta
sidebar_title: extract()
sidebar_order: 12
sidebar_pill: WIP
---

# extract()

We'll add more on this soon, but Presta supports extracting static files at
build time, right from your serverless handler.

This could be handy for CSS-in-JS solutions, or even compiling JS bundles on the
fly with something like esbuild.

```javascript
import { extract } from 'presta/extract'

export const route = '*'

export async function handler() {
  const body = '<h1>Hello world</h1>'

  const stylesheet = extract(
    'h1 { color: tomato }', // file content
    'css', // extension
    'styles' // name of file
  ) // returns "/styles.css"

  return html({
    head: {
      link: [{ rel: 'stylesheet', href: stylesheet }],
    },
    body,
  })
}
```
