export const route = '/redirect'

export const handler = () => {
  return {
    statusCode: 302,
    headers: { location: '/' },
  }
}
