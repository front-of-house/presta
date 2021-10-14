import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'
import http from 'http'
import { makeFetch } from 'supertest-fetch'
// @ts-ignore
import proxy from 'proxyquire'

import { createConfig } from '../lib/config'
import { createServerHandler as base } from '../lib/serve'
import type { AWS } from '../lib/types'

type CreateServerHandler = {
  createServerHandler: typeof base
}

tap.test('createServerHandler - searches for static assets', async (t) => {
  const assets = './assets'

  const dirs: string[] = []
  let called = false

  const config = await createConfig({
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

/**
 * Sirv handles these now https://github.com/lukeed/sirv/tree/master/packages/sirv#optsextensions
 */
tap.test('createServerHandler - resolves a static index route', async (t) => {
  let found = false

  const config = await createConfig({ cli: { output: t.testdirName } })
  const { createServerHandler }: CreateServerHandler = proxy('../lib/serve', {
    './sendServerlessResponse': {
      sendServerlessResponse() {
        // should never hit this, picked up by sirv
        found = true
      },
    },
  })
  const serverHandler = createServerHandler({ port: 4000, config })
  const indexRouteFilepath = path.join(config.staticOutputDir, 'index.html')

  fs.outputFileSync(indexRouteFilepath, '')

  const server = http.createServer(async (req, res) => {
    await serverHandler(req, res)
  })

  const fetch = makeFetch(server)

  await fetch('/')

  t.notOk(found)

  fs.removeSync(indexRouteFilepath)
})

tap.test('createServerHandler - resolves a lambda', async (t) => {
  let responses: boolean[] = []

  const config = await createConfig({ cli: { output: t.testdirName } })
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
  const functionsManifestFilepath = path.join(config.output, 'routes.json')
  fs.outputFileSync(
    functionsManifestFilepath,
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
  fs.removeSync(functionsManifestFilepath)
})

tap.test('createServerHandler - wildcards can pick up extensions too', async (t) => {
  let responses: boolean[] = []

  const config = await createConfig({ cli: { output: t.testdirName } })
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

  const functionFilepath = path.join(config.functionsOutputDir, 'Wild.js')
  const functionsManifestFilepath = path.join(config.output, 'routes.json')
  fs.outputFileSync(
    functionsManifestFilepath,
    JSON.stringify({
      '*': functionFilepath,
    })
  )
  fs.outputFileSync(functionFilepath, `module.exports = { handler () {} }`)

  const server = http.createServer(async (req, res) => {
    await serverHandler(req, res)
    res.end()
  })

  const fetch = makeFetch(server)

  await fetch('/example.png')
  await fetch('/example.json')

  t.same(responses, [true, true])

  fs.removeSync(functionFilepath)
  fs.removeSync(functionsManifestFilepath)
})

tap.test('createServerHandler - throws 500', async (t) => {
  let did500 = false

  const config = await createConfig({ cli: { output: t.testdirName } })
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
