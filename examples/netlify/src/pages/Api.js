import { json } from 'presta/serialize'

export const route = '/api/:slug?'

export function handler(event) {
  return json({
    body: event,
  })
}
