import { Handler } from 'presta'

export const route = '*'

export const handler: Handler = () => {
  return {
    statusCode: 302,
    headers: {
      Location: 'https://github.com/front-of-house/presta',
    },
  }
}
