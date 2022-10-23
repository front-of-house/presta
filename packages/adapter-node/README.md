# @presta/adapter-node

Node deployment adapter plugin for Presta.

## Usage

Simply add to your Presta config:

```javascript
import { createConfig } from 'presta'
import node from '@presta/adapter-node'

export default createConfig({
  plugins: [node({ port: 4000 })],
})
```

This will generate a `presta-node.js` file in the `.presta` output directory.
You can run this or deploy like any other node server:

```bash
node .presta/presta-node.js
```

## License

MIT License © [Front of House](https://github.com/front-of-house)
