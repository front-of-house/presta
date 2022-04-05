# @presta/adapter-netlify

Netlify deployment adapter plugin for Presta. It copies generated files to the
paths specified in your local `netlify.toml` config, as well as handles
rewriting URLs to Netlify functions paths e.g. `/.netlify/functions`.

## Usage

Make sure you've got a `netlify.toml` config in your root directory. It should
look something like this:

```toml
[build]
  command = 'npm run build'
  publish = 'build/static'
  functions = 'build/functions'
```

Then, update your Presta config (defaults to `presta.config.js`):

```javascript
import netlify from '@presta/adapter-netlify'

export const plugins = [netlify()]
```

### Bundle size limit

Netlify's default bundler sometimes outputs lambda ZIP archives that are over
the 50MB limit imposed by AWS. To avoid this, you might want to try [configuring
Netlify to use `esbuild` as the
bundler](https://github.com/netlify/zip-it-and-ship-it#esbuild).

To do so, add this to your Netlify config:

```toml
[functions]
  node_bundler = 'esbuild'
```

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
