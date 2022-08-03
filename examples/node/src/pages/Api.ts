import { Event } from 'presta'
import { json } from 'presta/serialize'

export const route = '/api/*'

export function handler(event: Event) {
  return json({
    body: event,
  })
}
