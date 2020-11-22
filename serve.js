import fs from 'fs'
import path from 'path'
import http from 'http'
import getPort from 'get-port'
import c from 'ansi-colors'
import sirv from 'sirv'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './lib/constants'
import { createDevClient } from './lib/devClient'
import * as events from './lib/events'

const fallbackPage = fs.readFileSync(
  path.join(__dirname, './lib/404.html'),
  'utf8'
)

const defaultHeaders = {
  'content-type': 'text/html; charset=utf-8'
}

function resolveHTML (dir, url) {
  let file = path.join(dir, url)

  if (!/\.html?$/.test(url)) {
    file = path.join(dir, url, 'index.html')
  }

  return fs.readFileSync(file, 'utf8')
}

export async function serve (config, { noBanner }) {
  const port = await getPort({ port: 4000 })
  const devClient = createDevClient({ port })
  const staticDir = path.join(config.output, 'static')

  const server = http
    .createServer(async (req, res) => {
      const { url } = req

      // static assets
      if (/^.+\..+$/.test(url) && !/\.html?$/.test(url)) {
        sirv(staticDir, { dev: true })(req, res, () => {
          console.log(`  ${c.magenta(`GET`.padEnd(8))}${url}`)

          res.writeHead(404, defaultHeaders)
          res.write(fallbackPage + devClient)
          res.end()
        })
      } else {
        try {
          const file = resolveHTML(staticDir, url) + devClient

          console.log(`  ${c.blue(`GET`.padEnd(8))}${url}`)

          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(file)
          res.end()
        } catch (e) {
          const { router, handler } = require(path.join(
            config.output,
            OUTPUT_DYNAMIC_PAGES_ENTRY
          ))
          const match = router(url)

          if (match) {
            const { statusCode, headers, body } = await handler(
              { path: url },
              {}
            )

            const ok = statusCode < 299

            console.log(
              `  ${c[ok ? 'blue' : 'magenta'](`GET`.padEnd(8))}${url}`
            )

            res.writeHead(statusCode, {
              ...defaultHeaders,
              ...headers
            })
            res.end(body + devClient)
          } else {
            console.log(`  ${c.magenta(`GET`.padEnd(8))}${url}`)

            res.writeHead(404, defaultHeaders)
            res.write(fallbackPage + devClient)
            res.end()
          }
        }
      }
    })
    .listen(port, () => {
      if (!noBanner) {
        console.log(c.blue(`presta serve`), `– http://localhost:${port}\n`)
      }
    })

  const socket = require('pocket.io')(server, {
    serveClient: false
  })

  events.on('refresh', route => {
    socket.emit('refresh', route)
  })

  return {
    port
  }
}
