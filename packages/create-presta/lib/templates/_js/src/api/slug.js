import { json } from 'presta/serialize'

export const route = '/api/*'

export const handler = (event, context) => {
  return json({
    body: {
      event,
      context,
    },
  })
}
