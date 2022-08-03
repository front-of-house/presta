/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */
import path from 'path'
import polka from 'polka'
import sirv from 'sirv'
import { Handler } from 'presta'
import { requestToEvent } from 'presta/utils/requestToEvent'
import { sendServerlessResponse } from 'presta/runtime/sendServerlessResponse'

import { Options, Context } from './types'

export function adapter(context: Context, options: Options) {
  const assets = sirv(path.resolve(__dirname, context.staticOutputDir))
  const app = polka().use(assets)

  for (const file of Object.values(context.manifest.functions)) {
    app.all(file.route, async (req, res) => {
      const event = await requestToEvent(req)
      const { handler } = require(file.dest) as { handler: Handler }
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
