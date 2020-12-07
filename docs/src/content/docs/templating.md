---
title: Templating
description: 'Presta renders strings. So really, anything that can generate a string with JavaScript should work.'
slug: templating
linkTitle: Templating
linkDescription: Have it your way
---

Presta renders strings. So really, anything that can generate a string with JavaScript should work as a templating solution - even plain strings themselves!

Strings get cumbersome pretty quickly, so let's talk about better options.

## No config templating

No config here just means no [custom renderer](/presta/docs/configuration#custom-renderers) i.e. the templating solution deals with strings directly and doesn't require a build or render step.

A great option for this is [hyposcript](https://github.com/sure-thing/hyposcript). It's a [hyperscript](https://github.com/hyperhype/hyperscript) library (another solid option for templating), but focused only on server-side rendering, which means it's faster.

> Looking for an all-in-one? With [hypobox](https://github.com/sure-thing/hypobox), you can write fast JSX template with familiar CSS-in-JS ergonomics.

## Some config templating

If you have existing templates or libraries you'd like to source, you can probably configure a [custom renderer](/presta/docs/configuration#custom-renderers) for the job. Here's an incomplete list of possibilities that should work just fine.

- [hyperscript](https://github.com/hyperhype/hyperscript)
- [React](https://reactjs.org/)
- [Preact](https://preactjs.com/)
- [htm](https://github.com/developit/htm)
- [nanohtml](https://github.com/choojs/nanohtml)
- [mustache](https://github.com/janl/mustache.js/) (anything in this family)
- [pug](https://github.com/pugjs/pug)

## Markdown

If you're using markdown exclusively – like via `.md` files in your repo – then maybe you don't need templating at all. Below is a quick sketch of what a homepage generated from markdown might look like:

```js
import fs from 'fs'
import md from 'marked'

export function getPaths () {
  return ['/']
}

export function Page () {
  return md(fs.readFileSync('../content/home.md', 'utf-8'))
}
```

## Recipes: coming soon!

Looking for a specific stack? [Drop us a line.](https://github.com/sure-thing/presta/issues/new/choose)
