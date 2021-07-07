---
meta_title: Data Loading
sidebar_title: Data Loading
sidebar_order: 4
---

# Data Loading

As you've seen, Presta is very much like a normal serverless function. So
loading data should look pretty familiar in most cases.

```javascript
export const route = '/products/:category'

export async function handler(props) {
  const products = await getProducts({
    category: props.params.category,
  })

  return {
    html: `
      <ul>
        ${products.map((prod) => `<li>${prod.title}</li>`)}
      </ul>
    `,
  }
}
```

In cases where you don't want to hit your APIs on every reload during
development, Presta provides a handy file cache. Just pass a `key` as a way to
reference the data to be stored, and a `duration` in milliseconds to cache the
response to disk.

```javascript
import { cache } from 'presta/load'

export const route = '/products/:category'

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

### Co-located Data Loading

Presta also provides a method of co-locating your data with your components. We
don't go into much detail just yet, but to give you an idea what it looks like,
here's a rough non-working example.

```javascript
import { html } from 'presta/html'
import { load, cache, flush } from 'presta/load'

export const route = '/posts/:category'

function Nav() {
  const links = load(getNav, { key: 'nav', duration: 60 * 1000 })

  return `
    <ul>
      ${links.map((link) => `<li><a href='${link.href}'>${link.label}</a></li>`)}
    </ul>
  `
}

export async function handler() {
  const posts = cache(() => await getPosts({ category: props.params.category }), { key: 'posts', duration: 60 * 1000 })

  const body = flush(
    () => `
    ${Nav()}

    <ul>
      ${posts.map((post) => `<li>${post.title}</li>`)}
    </ul>
  `
  )

  return html({
    head: { title: 'Blog' },
    body,
  })
}
```
