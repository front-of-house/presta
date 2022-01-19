# @presta/adapter-node

Node deployment adapter plugin for Presta.

## Usage

Simply add to your Presta config (defaults to `presta.config.js`):

```javascript
import node from '@presta/adapter-node'

export const plugins = [node({ port: 4000 })]
```

This will generate a `server.js` file in your output directory. You can run it
like any other node server:

```bash
node build/server.js
```

## License

MIT License © [Sure Thing](https://github.com/sure-thing)
