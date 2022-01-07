import { Event } from 'presta'

export const route = '/api/*'

export function handler(event: Event) {
  return {
    json: {
      presta: true,
    },
  }
}
