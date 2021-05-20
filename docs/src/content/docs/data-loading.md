---
title: Data Loading
order: 4
---

As you've seen, Presta is very much like a normal serverless function. So
loading data looks about the same in most cases.

```javascript
export const route = '/products/:category'

export async function handler (props) {
  const products = await getProducts({ category: props.params.category })

  return {
    html: `
      <ul>
        ${producs.map(
          prod => `
          <li>${prod.title}</li>
        `
        )}
      </ul>
    `
  }
}
```

In cases where you don't want to hit your APIs on every reload during
development, Presta provides a handy file cache. Just pass a `key` to specify
the data to be stored, and a `duration` in milliseconds to cache the response to
disk.

```javascript
import { cache } from 'presta/load'

// ...

export async function handler (props) {
  const products = cache(
    () => await getProducts({ category: props.params.category }),
    { key: 'products', duration: 60 * 1000 }
  )

  return {
    ...
  }
}
```
