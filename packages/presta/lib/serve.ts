import fs from 'fs'
import path from 'path'
import http from 'http'
import getPort from 'get-port'
import sirv from 'sirv'
import chokidar from 'chokidar'
import mime from 'mime-types'
import toRegExp from 'regexparam'

import { timer } from './timer'
import * as logger from './log'
import { default404 } from './default404'
import { requestToEvent } from './requestToEvent'
import { sendServerlessResponse } from './sendServerlessResponse'

import type { AWS, Presta } from './types'

const style = [
  'position: fixed',
  'bottom: 24px',
  'right: 24px',
  'width: 32px',
  'height: 32px',
  'border-radius: 32px',
  'background: white',
  'color: #FF7A93',
  'font-size: 20px',
  'font-weight: bold',
  'text-align: center',
  'line-height: 31px',
  'box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.04)',
]

const devServerIcon = `
  <div style="${style.join(';')}">~</div>
`

function resolveHTML(dir: string, url: string) {
  let file = path.join(dir, url)

  // if no extension, it's probably intended to be an HTML file
  if (!path.extname(url)) {
    try {
      return fs.readFileSync(path.join(dir, url, 'index.html'), 'utf8')
    } catch (e) {}
  }

  return fs.readFileSync(file, 'utf8')
}

function createDevClient({ port }: { port: number }) {
  return `
    <script>
      (function (global) {
        try {
          const socketio = document.createElement('script')
          socketio.src = 'https://unpkg.com/pocket.io@0.1.4/min.js'
          socketio.onload = function init () {
            var disconnected = false
            var socket = io('http://localhost:${port}', {
              reconnectionAttempts: 3
            })
            socket.on('connect', function() { console.log('presta connected on port ${port}') })
            socket.on('refresh', function() {
              global.location.reload()
            })
            socket.on('disconnect', function() {
              disconnected = true
            })
            socket.on('reconnect_failed', function(e) {
              if (disconnected) return
              console.error("presta - connection to server on :${port} failed")
            })
          }
          document.head.appendChild(socketio)
        } catch (e) {}
      })(this);
    </script>
  `
}

export function createServerHandler({ port, config }: { port: number; config: Presta }) {
  const devClient = createDevClient({ port })
  const staticDir = config.staticOutputDir
  const assetDir = config.assets

  return async function serveHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const time = timer()
    const url = req.url as string

    /*
     * If this is an asset other than HTML files, just serve it
     */
    if (/^.+\..+$/.test(url) && !/\.html?$/.test(url)) {
      logger.debug({
        label: 'debug',
        message: `attempting to serve static asset ${url}`,
      })

      /*
       * first check the vcs-tracked static folder,
       * then check the presta-built static folder
       *
       * @see https://github.com/sure-thing/presta/issues/30
       */
      sirv(assetDir, { dev: true })(req, res, () => {
        sirv(staticDir, { dev: true })(req, res, () => {
          logger.warn({
            label: 'serve',
            message: `404 ${url}`,
            duration: time(),
          })

          sendServerlessResponse(res, {
            statusCode: 404,
            body: default404 + devClient + devServerIcon,
          })
        })
      })
    } else {
      /*
       * Try to resolve a static route normally
       */
      try {
        logger.debug({
          label: 'debug',
          message: `attempting to render static HTML for ${url}`,
        })

        const file = resolveHTML(staticDir, url) + devClient + devServerIcon

        logger.info({
          label: 'serve',
          message: `200 ${url}`,
          duration: time(),
        })

        sendServerlessResponse(res, { body: file })
      } catch (e) {
        logger.debug({
          label: 'debug',
          message: `static route failed`,
          error: e as Error,
        })

        // expect ENOENT, log everything else
        if (!/ENOENT|EISDIR/.test((e as Error).message)) {
          console.error(e)
        }

        try {
          /*
           * No asset file, no static file, try dynamic
           */
          delete require.cache[config.functionsManifest]
          const manifest = require(config.functionsManifest)
          const routes = Object.keys(manifest)
          const lambdaFilepath = routes
            .map((route) => ({
              matcher: toRegExp(route),
              route,
            }))
            .filter(({ matcher }) => {
              return matcher.pattern.test(url.split('?')[0])
            })
            .map(({ route }) => manifest[route])[0]

          /**
           * If we have a serverless function, delegate to it, otherwise 404
           */
          if (lambdaFilepath) {
            logger.debug({
              label: 'debug',
              message: `attempting to render lambda for ${url}`,
            })

            const { handler }: { handler: AWS['Handler'] } = require(lambdaFilepath)
            const event = await requestToEvent(req)
            const response = await handler(event, {})
            const headers = response.headers || {}
            const redir = response.statusCode > 299 && response.statusCode < 399

            // get mime type
            const type = headers['Content-Type'] as string
            const ext = type ? mime.extension(type) : 'html'

            logger.info({
              label: 'serve',
              message: `${response.statusCode} ${redir ? headers.Location : url}`,
              duration: time(),
            })

            sendServerlessResponse(res, {
              statusCode: response.statusCode,
              headers: response.headers,
              multiValueHeaders: response.multiValueHeaders,
              // only html can be live-reloaded, duh
              body:
                ext === 'html' ? (response.body || '').split('</body>')[0] + devClient + devServerIcon : response.body,
            })
          } else {
            logger.debug({
              label: 'debug',
              message: `attempting to render static 404.html page for ${url}`,
            })

            /*
             * Try to fall back to a static 404 page
             */
            try {
              const file = resolveHTML(staticDir, '404') + devClient + devServerIcon

              logger.warn({
                label: 'serve',
                message: `404 ${url}`,
                duration: time(),
              })

              sendServerlessResponse(res, {
                statusCode: 404,
                body: file,
              })
            } catch (e) {
              if (!(e as Error).message.includes('ENOENT')) {
                console.error(e)
              }

              logger.debug({
                label: 'debug',
                message: `rendering default 404 HTML page for ${url}`,
              })

              logger.warn({
                label: 'serve',
                message: `404 ${url}`,
                duration: time(),
              })

              sendServerlessResponse(res, {
                statusCode: 404,
                body: default404 + devClient + devServerIcon,
              })
            }
          }
        } catch (e) {
          logger.debug({
            label: 'debug',
            message: `rendering default 500 HTML page for ${url}`,
          })

          logger.error({
            label: 'serve',
            message: `500 ${url}`,
            error: e as Error,
            duration: time(),
          })

          sendServerlessResponse(res, {
            statusCode: 500,
            body: '' + devClient + devServerIcon, // TODO default 500 screen
          })
        }
      }
    }
  }
}

export async function serve(config: Presta) {
  const port = await getPort({ port: config.port })
  const server = http.createServer(createServerHandler({ port, config })).listen(port)
  const socket = require('pocket.io')(server, { serveClient: false })

  config.events.on('refresh', () => {
    logger.debug({
      label: 'debug',
      message: `refresh event received`,
    })

    socket.emit('refresh')
  })

  chokidar.watch(config.assets, { ignoreInitial: true }).on('all', () => {
    config.events.emit('refresh')
  })

  return { port }
}
