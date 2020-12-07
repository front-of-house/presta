import fs from 'fs'
import { parse as parseUrl } from 'url'
import path from 'path'
import http from 'http'
import getPort from 'get-port'
import c from 'ansi-colors'
import sirv from 'sirv'
import chokidar from 'chokidar'
import { parse as parseQuery } from 'query-string'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './lib/constants'
import { createDevClient } from './lib/devClient'
import * as events from './lib/events'
import { debug } from './lib/debug'
import { timer } from './lib/timer'
import { log, formatLog } from './lib/log'
import { devServerIcon } from './lib/devServerIcon'

const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i

const default404 = fs.readFileSync(
  path.join(__dirname, './lib/404.html'),
  'utf8'
)

const defaultHeaders = {
  'content-type': 'text/html; charset=utf-8'
}

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
function shouldBase64Encode (contentType) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
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
      /*
       * If this is an asset other than HTML files, just serve it
       */
      if (/^.+\..+$/.test(req.url) && !/\.html?$/.test(req.url)) {
        debug('serve', `serve asset ${req.url}`)

        sirv(staticDir, { dev: true })(req, res, () => {
          sirv(assetDir, { dev: true })(req, res, () => {
            formatLog({
              color: 'magenta',
              action: 'serve',
              meta: '⚠︎',
              description: req.url
            })

            res.writeHead(404, defaultHeaders)
            res.write(default404 + devClient + devServerIcon)
            res.end()
          })
        })
      } else {
        debug('serve', `serve static page ${req.url}`)

        /*
         * Try to resolve a static route normally
         */
        try {
          const file =
            resolveHTML(staticDir, req.url) + devClient + devServerIcon

          res.writeHead(200, defaultHeaders)
          res.write(file)
          res.end()

          formatLog({
            action: 'serve',
            meta: '•',
            description: req.url
          })
        } catch (e) {
          // expect ENOENT, log everything else
          if (!e.message.includes('ENOENT')) console.error(e)

          /*
           * No asset file, no static file, try dynamic
           */
          const { handler, pages, config: userConfig } = require(path.join(
            config.output,
            OUTPUT_DYNAMIC_PAGES_ENTRY
          ))
          const hasServerConfigured = !!pages.length || userConfig.onRequest

          /**
           * If we have a serverless function, delegate everything to that, like it would be in prod
           */
          if (hasServerConfigured) {
            debug('serve', `fallback, serve dynamic page ${req.url}`)

            const time = timer()
            // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L208
            const remoteAddress =
              req.headers['x-forwarded-for'] || req.connection.remoteAddress
            const ip = remoteAddress
              .split(remoteAddress.includes('.') ? ':' : ',')
              .pop()
              .trim()
            const isBase64Encoded = shouldBase64Encode(
              req.headers['content-type']
            )
            const response = await handler(
              {
                path: req.url,
                httpMethod: req.method,
                headers: {
                  ...req.headers,
                  'client-ip': ip
                },
                multiValueHeaders: Object.keys(req.headers).reduce(
                  (headers, key) => {
                    if (!req.headers[key].includes(',')) return headers // only include multi-value headers here
                    return {
                      ...headers,
                      [key]: req.headers[key].split(',')
                    }
                  },
                  {}
                ),
                queryStringParameters: parseQuery(parseUrl(req.url).query),
                multiValueQueryStringParameters: {},
                body: req.headers['content-length']
                  ? req.body.toString(isBase64Encoded ? 'base64' : 'utf8')
                  : undefined,
                isBase64Encoded
              },
              {}
            )

            const ok = response.statusCode < 299

            // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L73
            for (const key in response.multiValueHeaders) {
              res.setHeader(key, response.multiValueHeaders[key])
            }

            res.writeHead(response.statusCode, {
              ...defaultHeaders,
              ...response.headers
            })
            res.write(response.body + devClient + devServerIcon)
            res.end()

            formatLog({
              color: ok ? 'blue' : 'magenta',
              action: 'serve',
              meta: '⚡︎' + time(),
              description: req.url
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

              res.writeHead(404, defaultHeaders)
              res.write(file)
              res.end()
            } catch (e) {
              if (!e.message.includes('ENOENT')) {
                console.error(e)
              }

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

              res.writeHead(404, defaultHeaders)
              res.write(default404 + devClient + devServerIcon)
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
