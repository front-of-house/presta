export const route = '/redirect'

export const config = {}

export function handler() {
  return {
    statusCode: 302,
    headers: { location: '/' },
  }
}
