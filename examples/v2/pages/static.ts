import { Handler } from 'presta'
import { html } from 'presta/serialize'

export function getStaticPaths() {
  return ['/static']
}

export const handler: Handler = async (ev, ctx) => {
  return html({
    body: 'static',
  })
}
