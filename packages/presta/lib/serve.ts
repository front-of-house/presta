import { Socket } from 'net'
import http from 'http'
import sirv from 'sirv'
import mime from 'mime-types'
import toRegExp from 'regexparam'
import status from 'statuses'
import { WebSocketServer } from 'ws'
import { timer, requestToEvent, requireFresh, sendServerlessResponse, createDefaultHtmlResponse } from '@presta/utils'

import * as logger from './log'
import { createLiveReloadScript } from './utils'
import { Handler, Event, Response, Context } from './lambda'
import { Config } from './config'
import { Hooks } from './createEmitter'
import { normalizeResponse } from './normalizeResponse'
import { getDynamicFilesFromManifest, Manifest, ManifestDynamicFile } from './manifest'

export interface HttpError extends Error {
  statusCode?: number
  message: string
}

export function createHttpError(statusCode: number, message: string): HttpError {
  const error = new Error(message)
  // @ts-ignore
  error.statusCode = statusCode
  return error
}

export function getMimeType(response: Response) {
  const type = (response?.headers || {})['content-type']
  return mime.extension(type as string) || 'html'
}

export function loadLambdaFromManifest(url: string, manifest: Manifest): { handler: Handler } {
  const dynamicFiles = getDynamicFilesFromManifest(manifest)
  const lambda = dynamicFiles
    .map((file) => ({
      matcher: toRegExp(file.route),
      file,
    }))
    .filter(({ matcher }) => {
      return matcher.pattern.test(url.split('?')[0])
    })
    .map(({ file }) => file)[0]

  return lambda ? require(lambda.dest) : undefined
}

export async function processHandler(event: Event, lambda: { handler: Handler }) {
  const accept = event.headers.Accept || event.headers.accept
  const acceptsJson = accept && accept.includes('json')

  /*
   * No asset file, no static file, try dynamic
   */
  try {
    if (!lambda || !lambda.handler) {
      throw createHttpError(404, '')
    }

    return normalizeResponse(await lambda.handler(event, { awsRequestId: 'presta dev' } as Context))
  } catch (e) {
    const error = e as HttpError
    const { statusCode = 500 } = error

    if (statusCode > 499)
      logger.error({
        label: 'error',
        message: error.message || status.message[statusCode],
        error,
      })

    return normalizeResponse({
      statusCode: statusCode,
      html: acceptsJson ? undefined : createDefaultHtmlResponse({ statusCode }),
      json: acceptsJson ? { detail: status.message[statusCode] } : undefined,
    })
  }
}

export function createRequestHandler({ port, config }: { port: number; config: Config }) {
  return async function requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const time = timer()
    const event = await requestToEvent(req) // stock AWS Event shape
    const manifest = requireFresh(config.manifestFilepath) as Manifest
    const lambda = loadLambdaFromManifest(event.path, manifest)
    const response = await processHandler(event, lambda)
    const redir = response.statusCode > 299 && response.statusCode < 399
    const mime = getMimeType(response)

    if (mime === 'html') {
      response.body = (response.body || '').split('</body>')[0] + createLiveReloadScript({ port })
    }

    sendServerlessResponse(res, response)

    logger[response.statusCode < 299 ? 'info' : 'error']({
      label: 'serve',
      message: `${response.statusCode} ${redir ? response?.headers?.Location || event.path : event.path}`,
      duration: time(),
    })
  }
}

export function createServerHandler({ port, config }: { port: number; config: Config }) {
  const staticDir = config.staticOutputDir
  const assetDir = config.assets

  return async function serveHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const time = timer()
    const url = req.url as string

    logger.debug({
      label: 'debug',
      message: `handling ${url}`,
    })

    // hook into sirv for logging only
    /* c8 ignore start */
    function setHeaders(res: http.ServerResponse, pathname: string) {
      logger.info({
        label: 'serve',
        message: `${res.statusCode} ${pathname}`,
        duration: time(),
      })
    }
    /* c8 ignore end */

    /* c8 ignore next 2 */
    sirv(assetDir, { dev: true, setHeaders })(req, res, () => {
      sirv(staticDir, { dev: true, setHeaders })(req, res, async () => {
        createRequestHandler({ port, config })(req, res)
      })
    })
  }
}

export function serve(config: Config, hooks: Hooks) {
  const port = config.port
  const server = http.createServer(createServerHandler({ port, config })).listen(port)
  const websocket = new WebSocketServer({ server })
  const sockets: Socket[] = []

  server.on('connection', (socket) => {
    sockets.push(socket)
    socket.on('close', () => sockets.splice(sockets.indexOf(socket), 1))
  })

  hooks.onBrowserRefresh(() => {
    logger.debug({
      label: 'debug',
      message: `refresh event received`,
    })

    websocket.clients.forEach((ws) => ws.send('refresh'))
  })

  return {
    async close() {
      // so just always resolve OK
      return new Promise((y) => {
        server.close(() => y(1))
        // sockets includes ws sockets
        sockets.forEach((ws) => ws.destroy())
      })
    },
  }
}
