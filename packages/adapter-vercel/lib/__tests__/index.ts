import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
import { build as esbuild } from 'esbuild'

import createPlugin, { vercelConfig, requireSafe, onPostBuild } from '../index'

const test = suite('@presta/adapter-vercel')

test('requireSafe', async () => {
  const fixture = afix({
    error: ['index.js', 'export default () => {'],
  })
  assert.equal(requireSafe(fixture.files.error.path), {})
})

test('onPostBuild', async () => {
  const cwd = process.cwd()

  const fixture = afix({
    static: ['build/static/index.html', 'html'],
  })

  process.chdir(fixture.root)

  const output = path.join(fixture.root, 'build')
  onPostBuild({
    output,
    staticOutput: path.join(output, 'static'),
    functionsOutput: path.join(output, 'functions'),
    functionsManifest: {},
  })

  assert.ok(fs.existsSync(path.join(fixture.root, './.output/static/index.html')))

  process.chdir(cwd)
})

test('createPlugin', async () => {
  const cwd = process.cwd()
  const fixture = afix({})

  process.chdir(fixture.root)

  let plan = 0

  await createPlugin()(
    // @ts-ignore
    {},
    {
      onPostBuild(fn) {
        plan++
      },
    }
  )

  assert.equal(plan, 1)
  assert.equal(JSON.parse(fs.readFileSync(path.join(fixture.root, 'vercel.json'), 'utf8')), vercelConfig)

  process.chdir(cwd)
})

test('generateRoutes', async () => {
  const cwd = process.cwd()
  const fixture = afix({
    index: [
      'build/functions/home.js',
      `export const route = '/';
    export function handler () {
      return ''
    }`,
    ],
    page: [
      'build/functions/page.js',
      `export const route = '*';
    export function handler () {
      return ''
    }`,
    ],
  })

  process.chdir(fixture.root)

  const prestaOutput = path.join(fixture.root, 'build')
  const prestaFunctionsManifest = {
    '/': path.join(prestaOutput, 'functions/home.js'),
    '*': path.join(prestaOutput, 'functions/page.js'),
  }

  const { generateRoutes } = require('proxyquire')('../index', {
    esbuild: {
      async build(config: any) {
        await esbuild({
          ...config,
          external: ['@presta/adapter-vercel'],
        })
      },
    },
  })

  await generateRoutes(prestaOutput, prestaFunctionsManifest)

  const routesManifestPath = path.join(process.cwd(), './.output/routes-manifest.json')
  const routesManifest = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'))

  assert.equal(
    routesManifest.dynamicRoutes.map((r: any) => r.page),
    ['/index', '/page']
  )
  assert.ok(fs.existsSync(path.join(process.cwd(), './.output/server/pages/index.js')))
  assert.ok(fs.existsSync(path.join(process.cwd(), './.output/server/pages/page.js')))

  process.chdir(cwd)
})

test.run()
