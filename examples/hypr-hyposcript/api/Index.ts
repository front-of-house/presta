import * as hypr from 'hypr'
import { helmet } from 'hypr/helmet'
import { bake, thaw } from 'hypr/cookies'
import { Handler } from 'presta'

export const route = '/api/*'

export const handler: Handler = hypr.stack([
  thaw(),
  (event) => {
    return {
      json: {
        foo: true,
      },
    }
  },
  bake(),
  helmet(),
])
