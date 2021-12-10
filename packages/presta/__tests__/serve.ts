import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'
import http from 'http'
import { makeFetch } from 'supertest-fetch'
// @ts-ignore
import proxy from 'proxyquire'

import { createConfig } from '../lib/config'
import { createHttpError, getMimeType, loadLambdaFroManifest, processHandler } from '../lib/serve'
import type { AWS } from '../lib/types'

const event = {
  path: '/',
  headers: {},
} as AWS['HandlerEvent']

tap.test('createHttpError', async (t) => {
  const e = createHttpError(404, 'oops')
  t.equal(e.statusCode, 404)
  t.equal(e.message, 'oops')
})

tap.test('getMimeType', async (t) => {
  const html = getMimeType({
    headers: { 'Content-Type': 'text/html' },
  })

  t.equal(html, 'html')

  const none = getMimeType({
    headers: {},
  })

  t.equal(none, 'html')
})

tap.test('loadLambdaFroManifest', async (t) => {
  const dir = t.testdir({
    'lambda.js': `module.exports = { handler: true }`,
  })
  const manifest = {
    '/page': path.join(dir, 'lambda.js'),
    '/page/:slug': path.join(dir, 'lambda.js'),
  }

  t.same(loadLambdaFroManifest('/page', manifest), { handler: true })
  t.same(loadLambdaFroManifest('/page/path', manifest), { handler: true })
  t.same(loadLambdaFroManifest('/page?query', manifest), { handler: true })
})

tap.test('processHandler - works', async (t) => {
  const res = await processHandler(event, {
    async handler(event, ctx) {
      return {
        statusCode: 204,
      }
    },
  })

  t.equal(res.statusCode, 204)
})

tap.test('processHandler - no lambda', async (t) => {
  // @ts-expect-error
  const res = await processHandler(event)
  t.equal(res.statusCode, 404)
})

tap.test('processHandler - no handler', async (t) => {
  // @ts-expect-error
  const res = await processHandler(event, {})
  t.equal(res.statusCode, 404)
})

tap.test('processHandler - throws', async (t) => {
  const res = await processHandler(event, {
    async handler(ev, ctx) {
      throw new Error('error')
    },
  })
  t.equal(res.statusCode, 500)
  // @ts-ignore
  t.ok(res.headers['Content-Type'].includes('text/html'))
})

tap.test('processHandler - throws as json', async (t) => {
  const e = Object.assign({}, event, {
    headers: {
      Accept: 'application/json',
    },
  })
  const res = await processHandler(e, {
    async handler(ev, ctx) {
      throw new Error('error')
    },
  })
  t.equal(res.statusCode, 500)
  // @ts-ignore
  t.ok(res.headers['Content-Type'].includes('application/json'))
})

tap.test('createRequestHandler', async (t) => {
  t.plan(3)

  const dir = t.testdir({
    'lambda.js': `export function handler() {
      return { statusCode: 204 }
    }`,
  })
  const config = await createConfig({ cli: { output: t.testdirName } })
  const manifest = {
    '/': path.join(dir, 'lambda.js'),
  }
  const { createRequestHandler } = proxy('../lib/serve', {
    './timer': {
      timer() {
        t.pass()

        return () => {
          t.pass()
        }
      },
    },
    './requestToEvent': {
      requestToEvent() {
        return event
      },
    },
    './utils': {
      requireFresh() {
        return manifest
      },
    },
    './sendServerlessResponse': {
      sendServerlessResponse() {
        t.pass()
      },
    },
  })

  const requestHandler = createRequestHandler({ port: 4000, config })
  // @ts-ignore
  const req = new http.IncomingMessage(null)
  const res = new http.ServerResponse(req)

  requestHandler(req, res)
})

tap.test('createServerHandler', async (t) => {
  t.plan(2)

  const config = await createConfig({ cli: { output: t.testdirName } })
  const { createServerHandler } = proxy('../lib/serve', {
    sirv: (dir: string, options: any) => {
      t.ok(options.dev)
      return () => {
        t.pass()
      }
    },
  })
  const serveHandler = createServerHandler({ port: 4000, config })

  // @ts-ignore
  serveHandler({ url: '' }, {})
})

tap.test('serve', async (t) => {
  t.plan(3)

  const { serve } = proxy('../lib/serve', {
    http: {
      createServer() {
        return {
          listen() {
            t.pass()
          },
        }
      },
    },
    'pocket.io': () => {
      t.pass()
    },
    chokidar: {
      watch() {
        t.pass()
        return {
          on() {},
        }
      },
    },
  })
  const config = await createConfig({ cli: { output: t.testdirName } })

  serve(config)
})
