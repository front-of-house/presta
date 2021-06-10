---
meta_title: Getting Started | Presta
sidebar_title: Getting Started
sidebar_order: 1
---

# Getting Started

Presta is very simple, and we aim to keep it that way. To get up and running,
there are only a few things you need to know.

### Install

For most projects, you'll probably want to just install Presta as a
dev-dependency.

```bash
npm i presta -D
```

**Want to just test it out?** Try using Presta via `npx` to spin up an instant
live-reloading Presta server.

```bash
npx presta watch index.js
```

Then, just create your page `index.js` and started editing!

### CLI

Presta is run via a simple CLI. At the moment, there are only two commands:

```bash
presta watch [...files] [...options]
presta build [...files] [...options]
```

> Run `presta help` to see all available options.

### Files

Presta is a serverless-first web framework. It's little more than a dev/build
workflow for regular serverless functions (with a few bells and whistles).

That means, when you're writing pages or API routes, you're essentially defining
a serverless handler.

Below is a working example of a HTML page in Presta.

```javascript
export const route = '*'

export async function handler (props) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<h1>You're on ${props.path}</h1>`
  }
}
```

Similarly, here's an API route that returns JSON.

```javascript
export const route = '/api/posts'

export async function handler (props) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      posts: [{ title: 'Hello world!' }]
    })
  }
}
```

You get the idea. We'll go into more depth in the next few pages.
