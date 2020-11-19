import fs from 'fs-extra'
import path from 'path'
import sirv from 'sirv'
import polka from 'polka'
import port from 'get-port'
import c from 'ansi-colors'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './lib/constants'

// TODO pass data through to final handler so we can log what's happening, dont' end() early
export async function serve (config, { noBanner } = {}) {
  polka({
    onNoMatch (req, res) {
      res.writeHead(404, { 'content-type': 'text/html' })
      res.write(`<h1>Presta 404</h1>`)
      res.end()
    }
  })
    .use(
      sirv(path.join(config.output, 'static'), { dev: true }),
      sirv(config.public, { dev: true })
    )
    .use(async (req, res, next) => {
      const pathname = req.url

      // some missing asset
      if (/^.+\..+$/.test(pathname)) {
        res.writeHead(404)
        res.end()
      }

      const { router, handler } = require(path.join(
        config.output,
        OUTPUT_DYNAMIC_PAGES_ENTRY
      ))
      const match = router(pathname)

      if (match) {
        const { statusCode, headers, body } = await handler(
          { path: pathname },
          {}
        )

        const ok = statusCode < 299

        console.log(
          `  ${c[ok ? 'blue' : 'magenta'](`GET`.padEnd(8))}${pathname}`
        )

        res.writeHead(statusCode, headers)
        res.end(body)
      } else {
        next()
      }
    })
    .listen(await port({ port: 4000 }), err => {
      if (err) throw err
      if (!noBanner) {
        console.log(c.blue(`presta serve`), `– http://localhost:${port}\n`)
      }
    })
}
