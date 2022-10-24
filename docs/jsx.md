# JSX

Yes, you can use JSX with Presta. Just make sure to configure your `tsconfig.json` if
you're using TS, and name your files using the JSX variety of extensions: `.jsx`
and `.tsx`.

## React

Pretty standard setup. Just call `renderToStaticMarkup` in your `handler`.

```typescript
import { Handler } from 'presta'
import { renderToStaticMarkup } from 'react-dom/server'

export const route = '*'

export const handler: Handler = () => {
  return renderToStaticMarkup(<h1>Hello world!</h1>)
}
```

## Preact

Haven't used Preact in years, could use someone's help here.

## Hyposcript

Solutions like Hyposcript are designed for the server, and therefore return
strings on their own. Just update the pragma in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "h"
  }
}
```
