---
meta_title: source() | API | Presta
sidebar_title: source()
sidebar_order: 13
sidebar_pill: WIP
---

# source()

Many sites source content from markdown files (like this site) or other locally originating data
sources. For those cases, Presta provides a utility to read and watch arbitrary
files on your local system. When those files change, the file sourcing them will
be re-rendered.

Here's an example similar to what this site uses with [Litebook](https://litebook.netlify.app/).

```javascript
import md from 'marked'
import { source } from 'presta/source-filesystem'

/**
 * Base against which paths are resolved
 */
const baseDir = '../content'

/**
 * Files to match
 */
const globs = '**/*.md'

/**
 * Initialize
 */
 const {
   paths,
   sources
 } = source(baseDir, globs[, options])(__filename)

export function getStaticPaths() {
  return paths
}

export function handler ({ path }) {
  const html = md(sources[path])
  return { html }
}
```

> The `__filename` above is important because it initializes `source()` within
> the context of this file. Otherwise, Presta wouldn't know which file depends on
> these sourced markdown files, and should be re-rendered when they change.
