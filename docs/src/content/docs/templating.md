---
title: Templating
order: 5
---

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
