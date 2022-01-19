/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */

import path from 'path'
import polka from 'polka'
import sirv from 'sirv'
import { Handler } from 'lambda-types'
import { requestToEvent } from '@presta/utils/requestToEvent'
import { sendServerlessResponse } from '@presta/utils/sendServerlessResponse'
import { HookPostBuildPayload } from 'presta'

import { Options } from './types'

export function adapter(props: HookPostBuildPayload, options: Options) {
  const assets = sirv(path.resolve(__dirname, props.staticOutput))
  const app = polka().use(assets)

  for (const route in props.functionsManifest) {
    app.all(route, async (req, res) => {
      const event = await requestToEvent(req)
      const { handler } = require(props.functionsManifest[route]) as { handler: Handler }
      // @ts-ignore
      const response = await handler(event, {})
      // @ts-ignore
      sendServerlessResponse(res, response)
    })
  }

  app.listen(options.port, () => {
    console.log(`presta server running on http://localhost:${options.port}`)
  })
}
