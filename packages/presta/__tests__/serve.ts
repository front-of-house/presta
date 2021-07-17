import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'
import http from 'http'
import { makeFetch } from 'supertest-fetch'
// @ts-ignore
import proxy from 'proxyquire'

import { createConfig } from '../lib/config'
import { createServerHandler as base } from '../lib/serve'
import type { AWS } from '..'

type CreateServerHandler = {
  createServerHandler: typeof base
}

tap.test('createServerHandler - searches for static assets', async (t) => {
  const assets = './assets'

  const dirs: string[] = []
  let called = false

  const config = createConfig({
    cli: { assets, output: t.testdirName },
  })
  const expectedDirs = [path.join(process.cwd(), assets), config.staticOutputDir]
  const { createServerHandler }: CreateServerHandler = proxy('../lib/serve', {
    sirv: (dir: string) => (req: http.ClientRequest, res: http.ServerResponse, cb: () => {}) => {
      dirs.push(dir)
      cb()
    },
    './sendServerlessResponse': {
      sendServerlessResponse() {
        called = true
      },
    },
  })
  const serverHandler = createServerHandler({ port: 4000, config })
  const imageFilepath = path.join(config.staticOutputDir, 'image.png')

  fs.outputFileSync(imageFilepath, '')

  const server = http.createServer(async (req, res) => {
    await serverHandler(req, res)
    res.end()
  })

  const fetch = makeFetch(server)

  await fetch('/image.png') // would normally match

  t.same(dirs, expectedDirs)
  t.ok(called)

  fs.removeSync(imageFilepath)
})

tap.test('createServerHandler - resolves a static route', async (t) => {
  let found = false

  const config = createConfig({ cli: { output: t.testdirName } })
  const { createServerHandler }: CreateServerHandler = proxy('../lib/serve', {
    './sendServerlessResponse': {
      sendServerlessResponse() {
        found = true
      },
    },
  })
  const serverHandler = createServerHandler({ port: 4000, config })
  const indexRouteFilepath = path.join(config.staticOutputDir, 'index.html')

  fs.outputFileSync(indexRouteFilepath, '')

  const server = http.createServer(async (req, res) => {
    await serverHandler(req, res)
    res.end()
  })

  const fetch = makeFetch(server)

  await fetch('/')

  t.ok(found)

  fs.removeSync(indexRouteFilepath)
})

tap.test('createServerHandler - resolves a lambda', async (t) => {
  let responses: boolean[] = []

  const config = createConfig({ cli: { output: t.testdirName } })
  const { createServerHandler }: CreateServerHandler = proxy('../lib/serve', {
    './sendServerlessResponse': {
      sendServerlessResponse(_: http.ServerResponse, response: Partial<AWS['HandlerResponse']>) {
        if (response.statusCode !== 404) {
          responses.push(true)
        } else {
          responses.push(false)
        }
      },
    },
  })
  const serverHandler = createServerHandler({ port: 4000, config })

  const functionFilepath = path.join(config.functionsOutputDir, 'Route.js')
  const routesManifestFilepath = path.join(config.output, 'routes.json')
  fs.outputFileSync(
    routesManifestFilepath,
    JSON.stringify({
      '/:slug?': functionFilepath,
    })
  )
  fs.outputFileSync(functionFilepath, `module.exports = { handler () {} }`)

  const server = http.createServer(async (req, res) => {
    await serverHandler(req, res)
    res.end()
  })

  const fetch = makeFetch(server)

  await fetch('/') // found
  await fetch('/foo/bar/baz') // not found

  t.same(responses, [true, false])

  fs.removeSync(functionFilepath)
  fs.removeSync(routesManifestFilepath)
})

tap.test('createServerHandler - throws 500', async (t) => {
  let did500 = false

  const config = createConfig({ cli: { output: t.testdirName } })
  const { createServerHandler }: CreateServerHandler = proxy('../lib/serve', {
    './sendServerlessResponse': {
      sendServerlessResponse(_: http.ServerResponse, response: Partial<AWS['HandlerResponse']>) {
        if (response.statusCode === 500) {
          did500 = true
        }
      },
    },
  })
  const serverHandler = createServerHandler({ port: 4000, config })

  const functionFilepath = path.join(config.functionsOutputDir, 'Route.js')
  fs.outputFileSync(
    path.join(config.output, 'routes.json'),
    JSON.stringify({
      '*': functionFilepath,
    })
  )
  fs.outputFileSync(functionFilepath, `module.exports = { handler () { throw 'error' } }`)

  const server = http.createServer(async (req, res) => {
    await serverHandler(req, res)
    res.end()
  })

  const fetch = makeFetch(server)

  await fetch('/') // throws

  t.ok(did500)

  fs.removeSync(t.testdirName)
})
