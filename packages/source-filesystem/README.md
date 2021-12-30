# @presta/source-filesystem

Source and watch local files, rebuilding pages on change.

## Usage

First, set up the plugin in your config file:

```javascript
import sourceFs from '@presta/source-filesystem'

export const plugins = [sourceFs()]
```

Then source files using globs in your individual pages:

```javascript
import { source } from '@presta/source-filesystem'

const posts = source('blog/*.md', __filename)
```

> `__filename` here is important — it tells this library where to resolve globs
> from and ensures that adding and removing sourced files is picked up by the file
> watcher.

`source` returns an array of tuples `[filepath, content]`. You can use these to
generate static paths, or render in a serverless function.

```javascript
import path from 'path'
import { source } from '@presta/source-filesystem'

const posts = source('blog/*.md', __filename)

const routes = posts.map((post) => {
  const filename = path.basename(post[0], '.md')
  return {
    [`/blog/${filename}`]: post[1],
  }
})

export function getStaticPaths() {
  return Object.keys(routes)
}

export function handler({ path }) {
  const post = routes[path]
  return markdown(post) // render markdown as needed
}
```

### Other file types

It also works with other natively supported extensions like `.js` and `.json`,
as well as those supported by esbuild like `.jsx`, `.ts` and `.tsx`.

Instead of returning the file content as a string, it will be read as a normal
node `module`, so the tuple will be `[filepath, module]`.

### Multiple source

You can also source multiple globs or even call `source` more than once.

```javascript
const jsons = source('configs/*.json', __filename)
const markdowns = source(['blog/*.md', 'docs/**/*.md'], __filename)
```

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
