# @presta/adapter-vercel

Vercel deployment adapter plugin for Presta.

## Usage

Simply add to your Presta config:

```javascript
import { createConfig } from 'presta'
import vercel from '@presta/adapter-vercel'

export default createConfig({
  plugins: [vercel()],
})
```

## License

MIT License © [Front of House](https://github.com/front-of-house)
