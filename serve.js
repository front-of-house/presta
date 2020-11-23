import fs from 'fs'
import path from 'path'
import http from 'http'
import getPort from 'get-port'
import c from 'ansi-colors'
import sirv from 'sirv'
import chokidar from 'chokidar'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './lib/constants'
import { createDevClient } from './lib/devClient'
import * as events from './lib/events'
import { debug } from './lib/debug'
import { timer } from './lib/timer'
import { log, formatLog } from './lib/log'

const default404 = fs.readFileSync(
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
  const assetDir = config.assets

  const server = http
    .createServer(async (req, res) => {
      const { url } = req

      /*
       * If this is an asset other than HTML files, just serve it
       */
      if (/^.+\..+$/.test(url) && !/\.html?$/.test(url)) {
        debug('serve', `attempt to serve asset ${url}`)

        sirv(staticDir, { dev: true })(req, res, () => {
          sirv(assetDir, { dev: true })(req, res, () => {
            formatLog({
              color: 'magenta',
              action: 'serve',
              meta: '⚠︎',
              description: url
            })

            res.writeHead(404, defaultHeaders)
            res.write(default404 + devClient)
            res.end()
          })
        })
      } else {
        debug('serve', `attempt to serve static page ${url}`)

        /*
         * Try to resolve a static route normally
         */
        try {
          const file = resolveHTML(staticDir, url) + devClient

          res.writeHead(200, defaultHeaders)
          res.write(file)
          res.end()

          formatLog({
            action: 'serve',
            meta: '•',
            description: url
          })
        } catch (e) {
          if (!e.message.includes('ENOENT')) {
            console.error(e)
          }

          debug('serve', `attempt to serve dynamic page ${url}`)

          const time = timer()

          /*
           * Fall back to serverless dynamic rendering
           */
          const { router, handler } = require(path.join(
            config.output,
            OUTPUT_DYNAMIC_PAGES_ENTRY
          ))
          const match = router(url)

          /*
           * If route match, render route
           */
          if (match) {
            const { statusCode, headers, body } = await handler(
              { path: url },
              {}
            )

            const ok = statusCode < 299

            res.writeHead(statusCode, {
              ...defaultHeaders,
              ...headers
            })
            res.end(body + devClient)

            formatLog({
              color: ok ? 'blue' : 'magenta',
              action: 'serve',
              meta: '⚡︎' + time(),
              description: url
            })
          } else {
            debug('serve', `attempt to serve static 404 page ${url}`)

            /*
             * Try to fall back to a static 404 page
             */
            try {
              const file = resolveHTML(staticDir, '404') + devClient

              formatLog({
                color: 'magenta',
                action: 'serve',
                meta: '•',
                description: url
              })

              res.writeHead(404, defaultHeaders)
              res.write(file)
              res.end()
            } catch (e) {
              if (!e.message.includes('ENOENT')) {
                console.error(e)
              }

              debug('serve', `serve default 404 page ${url}`)

              /*
               * If no static 404, show default 404
               */
              formatLog({
                color: 'magenta',
                action: 'serve',
                meta: '⚠︎ ',
                description: url
              })

              res.writeHead(404, defaultHeaders)
              res.write(default404 + devClient)
              res.end()
            }
          }
        }
      }
    })
    .listen(port, () => {
      if (!noBanner) {
        log(c.blue(`presta serve`), `– http://localhost:${port}\n`)
      }
    })

  const socket = require('pocket.io')(server, { serveClient: false })

  events.on('refresh', route => {
    debug('serve', `refresh event received`)
    socket.emit('refresh', route)
  })

  chokidar.watch(config.assets, { ignoreInitial: true }).on('all', () => {
    socket.emit('refresh')
  })

  return { port }
}
