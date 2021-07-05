import fs from 'fs'
import { parse as parseUrl } from 'url'
import path from 'path'
import http from 'http'
import getPort from 'get-port'
import c from 'ansi-colors'
import sirv from 'sirv'
import chokidar from 'chokidar'
import { parse as parseQuery } from 'query-string'
import mime from 'mime-types'
import rawBody from 'raw-body'
import toRegExp from 'regexparam'
import type { HandlerResponse } from '@netlify/functions'

import { debug } from './debug'
import { timer } from './timer'
import { log, formatLog } from './log'
import { default404 } from './default404'
import { normalizeResponse } from './normalizeResponse'

import type { Presta, Lambda } from '..'

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
  'box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.04)'
]

const devServerIcon = `
  <div style="${style.join(';')}">~</div>
`

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function shouldBase64Encode (contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

function resolveHTML (dir: string, url: string) {
  let file = path.join(dir, url)

  // if no extension, it's probably intended to be an HTML file
  if (!path.extname(url)) {
    try {
      return fs.readFileSync(path.join(dir, url, 'index.html'), 'utf8')
    } catch (e) {}
  }

  return fs.readFileSync(file, 'utf8')
}

function createDevClient ({ port }: { port: number }) {
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
            socket.on('connect', function() { console.log('presta connected') })
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

export async function serve (config: Presta, { noBanner }: { noBanner: boolean }) {
  const port = await getPort({ port: 4000 })
  const devClient = createDevClient({ port })
  const staticDir = config.staticOutputDir
  const assetDir = config.assets

  const server = http
    .createServer(async (req, res) => {
      function send (r: Partial<HandlerResponse>) {
        const response = normalizeResponse(r)

        // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L73
        for (const key in r.multiValueHeaders) {
          res.setHeader(key, String(r.multiValueHeaders[key]))
        }

        for (const key in r.headers) {
          res.setHeader(key, String(r.headers[key]))
        }

        res.statusCode = response.statusCode
        res.write(response.body)
        res.end()
      }

      function send404 () {
        debug('serve', `failure, serve default 404 page ${req.url}`)

        /*
         * If no static 404, show default 404
         */
        formatLog({
          color: 'magenta',
          action: 'serve',
          meta: '⚠︎ ',
          description: req.url
        })

        send({
          statusCode: 404,
          body: default404 + devClient + devServerIcon
        })
      }

      /*
       * If this is an asset other than HTML files, just serve it
       */
      if (/^.+\..+$/.test(req.url) && !/\.html?$/.test(req.url)) {
        debug('serve', `serve asset ${req.url}`)

        /*
         * first check the vcs-tracked static folder,
         * then check the presta-built static folder
         *
         * @see https://github.com/sure-thing/presta/issues/30
         */
        sirv(assetDir, { dev: true })(req, res, () => {
          sirv(staticDir, { dev: true })(req, res, () => {
            send404()
          })
        })
      } else {
        /*
         * Try to resolve a static route normally
         */
        try {
          const file =
            resolveHTML(staticDir, req.url) + devClient + devServerIcon

          debug('serve', `serve static page ${req.url}`)

          send({ body: file })

          formatLog({
            action: 'serve',
            meta: '•',
            description: req.url
          })
        } catch (e) {
          debug('serve', e)

          // expect ENOENT, log everything else
          // EISDIR is probably due to lack of `/.presta/static` dir
          if (!e.message.includes('ENOENT') && !e.message.includes('EISDIR'))
            console.error(e)

          try {
            /*
             * No asset file, no static file, try dynamic
             */
            const manifest = require(config.routesManifest)
            const routes = Object.keys(manifest)
            const lambdaFilepath = routes
              .map(route => ({
                matcher: toRegExp(route),
                route,
              }))
              .filter(({ matcher }) => {
                return matcher.pattern.test(req.url.split('?')[0])
              })
              .map(({ route }) => manifest[route])[0]

            /**
             * If we have a serverless function, delegate to it, otherwise 404
             */
            if (lambdaFilepath) {
              debug('serve', `fallback, serve dynamic page ${req.url}`)

              const {
                handler,
              }: {
                handler: Lambda['handler'],
              } = require(lambdaFilepath)

              const time = timer()
              // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L208
              const remoteAddress =
                String(req.headers['x-forwarded-for']) || req.connection.remoteAddress
              const ip = remoteAddress
                .split(remoteAddress.includes('.') ? ':' : ',')
                .pop()
                .trim()
              const isBase64Encoded = shouldBase64Encode(
                req.headers['content-type']
              )
              const body = req.headers['content-length']
                ? await rawBody(req, {
                    limit: '1mb',
                    encoding:
                      mime.charset(req.headers['content-type']) || undefined
                  })
                : undefined
              const response = await handler(
                {
                  path: req.url,
                  httpMethod: req.method,
                  // @ts-ignore TODO test set-cookie coming in as array
                  headers: {
                    ...req.headers,
                    'client-ip': ip
                  },
                  // TODO should these headers be exclusively single value vs multi?
                  multiValueHeaders: Object.keys(req.headers).reduce(
                    (headers, key) => {
                      if (!req.headers[key].includes(',')) return headers // only include multi-value headers here
                      return {
                        ...headers,
                        // @ts-ignore TODO again, array headers
                        [key]: req.headers[key].split(',')
                      }
                    },
                    {}
                  ),
                  // @ts-ignore TODO do I need to keep these separate?
                  queryStringParameters: parseQuery(parseUrl(req.url).query),
                  body: body
                    ? new Buffer(body).toString(isBase64Encoded ? 'base64' : 'utf8')
                    : undefined,
                  isBase64Encoded
                },
                {}
              )

              const ok = response.statusCode < 300
              const redir =
                response.statusCode > 299 && response.statusCode < 399

              // get mime type
              const type = response.headers['Content-Type']
              const ext = type ? mime.extension(type) : 'html'

              formatLog({
                color: ok ? 'blue' : 'magenta',
                action: redir ? 'redir' : 'serve',
                meta: '⚡︎' + time(),
                description: String(redir ? response.headers.Location : req.url)
              })

              send({
                statusCode: response.statusCode,
                headers: response.headers,
                multiValueHeaders: response.multiValueHeaders,
                // only html can be live-reloaded, duh
                body:
                  ext === 'html'
                    ? response.body.split('</body>')[0] +
                      devClient +
                      devServerIcon
                    : response.body
              })
            } else {
              debug('serve', `fallback, serve static 404 page ${req.url}`)

              /*
               * Try to fall back to a static 404 page
               */
              try {
                const file =
                  resolveHTML(staticDir, '404') + devClient + devServerIcon

                formatLog({
                  color: 'magenta',
                  action: 'serve',
                  meta: '•',
                  description: req.url
                })

                send({
                  statusCode: 404,
                  body: file
                })
              } catch (e) {
                if (!e.message.includes('ENOENT')) {
                  console.error(e)
                }

                debug('serve', `failure, serve default 404 page ${req.url}`)

                send404()
              }
            }
          } catch (e) {
            send({
              statusCode: 500,
              body: '' + devClient + devServerIcon
            })

            log(`\n  ${c.red('error')} ${req.url}\n\n  > ${e.stack || e}\n`)
          }
        }
      }
    })
    .listen(port, () => {
      if (!noBanner) {
        log(`${c.blue(`presta serve`)} – http://localhost:${port}\n`)
      }
    })

  const socket = require('pocket.io')(server, { serveClient: false })

  config.events.on('refresh', () => {
    debug('serve', `refresh event received`)
    socket.emit('refresh')
  })

  chokidar
    .watch(config.assets, { ignoreInitial: true })
    .on('all', () => {
      config.events.emit('refresh')
    })

  return { port }
}
