# @presta/adapter-netlify

Netlify deployment adapter plugin for Presta. It copies generated files to the
paths specified in your local `netlify.toml` config, as well as handles
rewriting URLs to Netlify functions paths e.g. `/.netlify/functions`.

## Usage

Simply add to your Presta config (defaults to `presta.config.js`):

```javascript
import { createPlugin as netlify } from '@presta/adapter-netlify'

export const plugins = [netlify()]
```

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
