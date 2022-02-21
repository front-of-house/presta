import type { Event, Context } from 'presta'

export const route = '/api/*'

export function handler(event: Event, context: Context) {
  return {
    json: {
      event,
      context,
    },
  }
}
