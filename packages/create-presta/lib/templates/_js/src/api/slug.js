export const route = '/api/*'

export function handler(event, context) {
  return {
    json: {
      event,
      context,
    },
  }
}
