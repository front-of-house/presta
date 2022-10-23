# Serialization

Presta ships with a few default serializers to get you off the ground faster.
All serializers accept a normal lambda `Response` and return a `Response`
decorated with appropriate headers.

## `html`

```typescript
import { html, Response } from 'presta/serialize'

const response: Response = html({
  statusCode: 200,
  body: 'Hello world',
})
```

## `json`

```typescript
import { json, Response } from 'presta/serialize'

const response: Response = json({
  statusCode: 200,
  body: { title: 'Hello world' },
})
```

## `xml`

```typescript
import { xml, Response } from 'presta/serialize'

const response: Response = xml({
  statusCode: 200,
  body: `...`,
})
```
