import { Handler } from 'presta'
import { html } from 'presta/serialize'

export const route = '/dynamic'

export const handler: Handler = async (ev, ctx) => {
  return html({
    body: 'dynamic',
  })
}
