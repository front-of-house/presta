export const route = '/redirect'

export function handler() {
  return {
    statusCode: 302,
    headers: { location: '/' },
  }
}
