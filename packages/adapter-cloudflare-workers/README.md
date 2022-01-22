# @presta/adapter-cloudflare-workers

Cloudflare Workers deployment adapter plugin for Presta.

## Usage

Simply add to your Presta config (defaults to `presta.config.js`):

```javascript
import cloudflare from '@presta/adapter-cloudflare-workers'

export const plugins = [cloudflare()]
```

The plugin will output a `wrangler.toml` file if you don't have one, or a
`presta-wrangler.toml` file if you do, and you can copy over Presta-specific
settings.

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
