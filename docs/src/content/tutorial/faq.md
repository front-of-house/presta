---
meta_title: FAQ
sidebar_title: FAQ
sidebar_order: 7
---

# FAQ

### Typescript? JSX?

Presta uses esbuild, which has built-in support for `.ts` `.tsx` and `.jsx` file
extensions. To opt in, simply name your files accordingly. `tsconfig.json` and
other files are supported according to the [esbuild docs](https://esbuild.github.io/).

### What about React?

React is a great option for templating — but you could use any other
javascript-based library that can be rendered to a string e.g.
[hyposcript](https://github.com/sure-thing/hyposcript),
[preact](https://github.com/preactjs/preact),
[htm](https://github.com/developit/htm), [pelo](https://github.com/shuhei/pelo),
etc.

Here's what using React could look like:

```javascript
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function getStaticPaths () {
  return ['/']
}

export function handler () {
  return renderToStaticMarkup(<div>Hello world!</div>)
}
```

### Will Presta ever build a frontend JavaScript runtime for me?

Probably. We're working on a React companion library for automatic partial
hydration and co-located data in the browser and on the server. At any rate, a
client-side runtime will _always_ be optional, and you can always BYOB.

### Additional Questions

If there's anything else you're curious about, [drop us a
line](https://github.com/sure-thing/presta/issues/new/choose). We'd love to hear
from you!
