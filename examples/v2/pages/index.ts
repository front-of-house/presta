import { Handler } from 'presta'
import { json } from 'presta/serialize'

export const route = '/'

export function getStaticPaths() {
  return ['/']
}

export const handler: Handler = async (ev, ctx) => {
  return json({
    body: ev,
  })
}
