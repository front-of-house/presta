export const route = '/api/*'

export function handler(event) {
  return {
    json: event,
  }
}
