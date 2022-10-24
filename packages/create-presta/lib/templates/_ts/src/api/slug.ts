import type { Handler } from 'presta'
import { json } from 'presta/serialize'

export const route = '/api/*'

export const handler: Handler = (event, context) => {
  return json({
    body: {
      event,
      context,
    },
  })
}
