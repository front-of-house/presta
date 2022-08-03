import { Handler } from 'presta'
import { html } from 'presta/serialize'

export const route = '/noop'

export function getStaticPaths() {
  return ['/noop']
}

export const handler: Handler = async (ev, ctx) => {
  return html({
    body: 'noop',
  })
}
