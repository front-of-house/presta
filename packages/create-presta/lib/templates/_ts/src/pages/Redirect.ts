import { Handler } from 'presta'

export const route = '/redirect'

export const handler: Handler = () => {
  return {
    statusCode: 302,
    headers: { location: '/' },
  }
}
