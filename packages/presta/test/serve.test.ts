import fs from 'fs-extra'
import path from 'path'
import http from 'http'
import { makeFetch } from 'supertest-fetch'

import { createConfig } from '../lib/config'
import { createServerHandler as base } from '../lib/serve'

type CreateServerHandler = {
  createServerHandler: typeof base
}

export default async (test, assert) => {
  test('createServerHandler - searches for static assets', async () => {
    const assets = './assets'

    const dirs = []
    let called = false

    const config = createConfig({
      cli: { assets },
    })
    const expectedDirs = [path.join(process.cwd(), assets), config.staticOutputDir]
    const { createServerHandler }: CreateServerHandler = require('proxyquire')('../lib/serve', {
      sirv: (dir) => (req, res, cb) => {
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

    assert.deepEqual(dirs, expectedDirs)
    assert(called)

    fs.removeSync(imageFilepath)
  })

  test('createServerHandler - resolves a static route', async () => {
    let found = false

    const config = createConfig({})
    const { createServerHandler }: CreateServerHandler = require('proxyquire')('../lib/serve', {
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

    assert(found)

    fs.removeSync(indexRouteFilepath)
  })

  test('createServerHandler - resolves a lambda', async () => {
    let responses = []

    const config = createConfig({})
    const { createServerHandler }: CreateServerHandler = require('proxyquire')('../lib/serve', {
      './sendServerlessResponse': {
        sendServerlessResponse(_, response) {
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

    assert.deepEqual(responses, [true, false])

    fs.removeSync(functionFilepath)
    fs.removeSync(routesManifestFilepath)
  })

  test('createServerHandler - throws 500', async () => {
    let did500 = false

    const config = createConfig({})
    const { createServerHandler }: CreateServerHandler = require('proxyquire')('../lib/serve', {
      './sendServerlessResponse': {
        sendServerlessResponse(_, response) {
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

    assert(did500)
  })
}
