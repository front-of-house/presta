# Configuration

Presta by default looks for a `presta.config.js` or a `presta.config.ts` file in
the root of your project. You can pass a different file entirely using the
`--config` CLI arg.

```typescript
import { createConfig } from 'presta'

export default createConfig({ ...options })
```

## Options

### `files`

A array of strings pointing to individual files or globs. Paths can optionally
specify extensions, otherwise Presta will process all `.js`, `.ts`, `.jsx`, and
`.tsx` files.

```typescript
export default createConfig({
  files: ['pages/index.js', 'api/*.ts', 'site/*'],
})
```

### `assets`

A string representing the path to your static assets directory. These files will
be served by Presta in dev mode, and copied along with the rest of your static
outputs when building for production.

```typescript
export default createConfig({
  assets: '/public',
})
```

### `plugins`

An array of Presta plugins.

```typescript
import netlify from '@presta/adapter-netlify'

export default createConfig({
  plugins: [netlify()],
})
```

### `port`

Which port to serve from during dev. Defaults to `4000`.

```typescript
export default createConfig({
  port: 3333,
})
```

### `cwd`

The current working directory of your project. Might be useful for monorepos,
but otherwise you probably don't need to touch this. Defaults to
`process.cwd()`.

```typescript
export default createConfig({
  cwd: path.join(__dirname, 'site'),
})
```

### `serve`

Whether or not to serve files during dev mode. Defaults to `true`.

```typescript
export default createConfig({
  serve: false,
})
```

## Other Config

### Aliases

Configure these in your `jsconfig.json` or `tsconfig.json` files like so:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
