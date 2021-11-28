import fs from 'fs'
import path from 'path'
import http from 'http'
import getPort from 'get-port'
import sirv from 'sirv'
import chokidar from 'chokidar'
import mime from 'mime-types'
import toRegExp from 'regexparam'
import status from 'statuses'

import { timer } from './timer'
import * as logger from './log'
import { createDefaultHtmlResponse } from './createDefaultHtmlResponse'
import { requestToEvent } from './requestToEvent'
import { sendServerlessResponse } from './sendServerlessResponse'
import { createLiveReloadScript } from './liveReloadScript'
import { AWS, Presta } from './types'
import { normalizeResponse } from './normalizeResponse'

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

export function createServerHandler({ port, config }: { port: number; config: Presta }) {
  const devClient = createLiveReloadScript({ port })
  const staticDir = config.staticOutputDir
  const assetDir = config.assets

  return async function serveHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const time = timer()
    const url = req.url as string

    logger.debug({
      label: 'debug',
      message: `handling ${url}`,
    })

    /*
     * first check the vcs-tracked static folder,
     * then check the presta-built static folder
     *
     * @see https://github.com/sure-thing/presta/issues/30
     */
    sirv(assetDir, { dev: true })(req, res, () => {
      logger.debug({
        label: 'debug',
        message: `attempting to serve generated static asset ${url}`,
      })

      sirv(staticDir, { dev: true })(req, res, async () => {
        const event = await requestToEvent(req) // stock AWS Event shape
        const accept = event.headers.Accept || event.headers.accept
        const acceptsJson = accept && accept.includes('json')

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
            let response: AWS['HandlerResponse']

            try {
              response = normalizeResponse(await handler(event, {})) // wrapped in ./wrapHandler.ts
            } catch (e) {
              logger.error({
                label: 'serve',
                message: `lambda`,
                error: e as Error,
              })

              response = normalizeResponse({
                statusCode: 500,
                html: acceptsJson ? undefined : createDefaultHtmlResponse({ statusCode: 500 }),
                json: acceptsJson ? { detail: status.message[500] } : undefined,
              })
            }

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
              ...response,
              // only html can be live-reloaded, duh
              body: ext === 'html' ? (response.body || '').split('</body>')[0] + devClient : response.body,
            })
          } else {
            logger.warn({
              label: 'serve',
              message: `404 ${url}`,
              duration: time(),
            })

            sendServerlessResponse(
              res,
              normalizeResponse({
                statusCode: 404,
                html: acceptsJson ? undefined : createDefaultHtmlResponse({ statusCode: 404 }) + devClient,
                json: acceptsJson ? { detail: status.message[404] } : undefined,
              })
            )
          }
        } catch (e) {
          logger.error({
            label: 'serve',
            message: `500 ${url}`,
            error: e as Error,
            duration: time(),
          })

          sendServerlessResponse(
            res,
            normalizeResponse({
              statusCode: 500,
              html: acceptsJson ? undefined : createDefaultHtmlResponse({ statusCode: 500 }) + devClient,
              json: acceptsJson ? { detail: status.message[500] } : undefined,
            })
          )
        }
      })
    })
  }
}

export async function serve(config: Presta) {
  const port = await getPort({ port: config.port })
  const server = http.createServer(createServerHandler({ port, config })).listen(port)
  const socket = require('pocket.io')(server, { serveClient: false })

  config.hooks.onBrowserRefresh(() => {
    logger.debug({
      label: 'debug',
      message: `refresh event received`,
    })

    socket.emit('refresh')
  })

  chokidar.watch(config.assets, { ignoreInitial: true }).on('all', () => {
    config.hooks.emitBrowserRefresh()
  })

  return { port }
}
