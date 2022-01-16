import fs from 'fs-extra'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
// @ts-ignore
import proxy from 'proxyquire'

import { Env } from '../constants'
import { create as createConfig } from '../config'
import { pathnameToFile, removeBuiltStaticFiles, buildStaticFile, buildStaticFiles } from '../buildStaticFiles'

const test = suite('presta - buildStaticFiles')

test('pathnameToFile', async () => {
  assert.equal(pathnameToFile('/foo'), '/foo/index.html')
  assert.equal(pathnameToFile('/foo/bar'), '/foo/bar/index.html')
  assert.equal(pathnameToFile('/baz.html'), '/baz.html')
  assert.equal(pathnameToFile('/baz.xml'), '/baz.xml')
  assert.equal(pathnameToFile('/foo', 'json'), '/foo.json')
  assert.equal(pathnameToFile('/foo.json', 'json'), '/foo.json')
})

test('removeBuiltStaticFiles', async () => {
  const fixture = afix({
    file: ['index.html', 'content'],
  })

  await removeBuiltStaticFiles([fixture.files.file.path])

  assert.not.ok(fs.existsSync(fixture.files.file.path))
})

test('buildStaticFile', async () => {
  const fixture = afix({
    page: [
      'page.js',
      `export const route = '/:slug?';
    export function getStaticPaths() {
      return ['/about']
    }
    export function handler({ pathParameters }) {
      return 'content' + pathParameters.slug
    }`,
    ],
  })
  const output = path.join(fixture.root, 'build/static')
  const builtFiles = await buildStaticFile(fixture.files.page.path, output, { footer: 'footer' })

  assert.equal(builtFiles, [path.join(output, 'about/index.html')])
  assert.equal(fs.readFileSync(builtFiles[0], 'utf8'), 'contentaboutfooter')
})

test('buildStaticFile - non-html', async () => {
  const fixture = afix({
    page: [
      'page.js',
      `export function getStaticPaths() {
      return ['/about.json']
    }
    export function handler() {
      return { json: { foo: true }}
    }`,
    ],
  })
  const output = path.join(fixture.root, 'build/static')
  const builtFiles = await buildStaticFile(fixture.files.page.path, output, { footer: 'footer' })

  assert.equal(builtFiles, [path.join(output, 'about.json')])
  assert.equal(fs.readFileSync(builtFiles[0], 'utf8'), JSON.stringify({ foo: true }))
})

test('buildStaticFile - nonsense', async () => {
  const fixture = afix({
    page: [
      'page.js',
      `export function getStaticPaths() {
      return ['/about']
    }
    export function handler() {
      return {
        headers: { 'content-type': 'foo/bar' },
        body: 'body'
      }
    }`,
    ],
  })
  const output = path.join(fixture.root, 'build/static')
  const builtFiles = await buildStaticFile(fixture.files.page.path, output, { footer: 'footer' })

  assert.equal(builtFiles, [path.join(output, 'about/index.html')])
  assert.equal(fs.readFileSync(builtFiles[0], 'utf8'), 'bodyfooter')
})

test('buildStaticFiles', async () => {
  const fixture = afix({
    page: [
      'page.js',
      `export function getStaticPaths() {
      return ['/']
    }
    export function handler() {
      return 'content'
    }`,
    ],
  })
  const config = createConfig(
    Env.DEVELOPMENT,
    {
      _: ['pages/*.js'],
    },
    {},
    fixture.root
  )

  const { staticFilesMap } = await buildStaticFiles([fixture.files.page.path], config, {
    [fixture.files.page.path]: [
      path.join(config.staticOutputDir, 'index.html'),
      path.join(config.staticOutputDir, 'about/index.html'), // will be cleaned up/removed
    ],
  })

  assert.equal(
    staticFilesMap[fixture.files.page.path],
    [path.join(config.staticOutputDir, 'index.html')],
    'Generated files should contain only one path'
  )
  assert.ok(
    /localhost:4000/.test(fs.readFileSync(path.join(config.staticOutputDir, 'index.html'), 'utf8')),
    'Live-reload client footer not applied'
  )
  assert.not.ok(
    fs.existsSync(path.join(config.staticOutputDir, 'about/index.html')),
    'File from last render was not removed'
  )
})

test('buildStaticFiles - no files to render', async () => {
  const fixture = afix({
    page: [
      'page.js',
      `export function getStaticPaths() {
      return []
    }
    export function handler() {
      return 'content'
    }`,
    ],
  })
  const config = createConfig(
    Env.DEVELOPMENT,
    {
      _: ['pages/*.js'],
    },
    {},
    fixture.root
  )

  const { staticFilesMap } = await buildStaticFiles([fixture.files.page.path], config)

  assert.equal(staticFilesMap, {}, 'Static files should be empty, nothing returned')
})

test('buildStaticFiles - exits on throw', async () => {
  const fixture = afix({
    page: [
      'page.js',
      `export function getStaticPaths() {
      return ['/']
    }
    export function handler() {
      console.log(foo)
      return 'content'
    }`,
    ],
  })
  const config = createConfig(
    Env.DEVELOPMENT,
    {
      _: ['pages/*.js'],
    },
    {},
    fixture.root
  )

  const { staticFilesMap } = await buildStaticFiles([fixture.files.page.path], config)

  assert.equal(staticFilesMap, {}, 'Static files should be empty, file threw')
})

test.run()
