import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import {
  createPlugin,
  toAbsolutePath,
  normalizeNetlifyRoute,
  prestaRoutesToNetlifyRedirects,
  generateRedirectsString,
} from '../'

const test = suite('@presta/adapter-netlify')

test('toAbsolutePath', async () => {
  assert.equal(toAbsolutePath('/foo', 'bar'), '/foo/bar')
})

test('normalizeNetlifyRoute', async () => {
  assert.equal(normalizeNetlifyRoute('/foo'), '/foo')
  assert.equal(normalizeNetlifyRoute('/*'), '/*')
  assert.equal(normalizeNetlifyRoute('*'), '/*')
  assert.equal(normalizeNetlifyRoute('/foo/*'), '/foo/*')
})

test('prestaRoutesToNetlifyRedirects', async () => {
  assert.equal(prestaRoutesToNetlifyRedirects([['*', 'Func']])[0], {
    from: '/*',
    to: '/.netlify/functions/Func',
    status: 200,
  })
})

test('generateRedirectsString', async () => {
  assert.equal(
    generateRedirectsString([
      {
        from: '/*',
        to: '/.netlify/functions/Func',
        status: 200,
      },
    ]),
    `/* /.netlify/functions/Func 200`
  )

  assert.equal(
    generateRedirectsString([
      {
        from: '/*',
        to: '/.netlify/functions/Func',
        status: 200,
        force: true,
      },
    ]),
    `/* /.netlify/functions/Func 200!`
  )
})

test('createPlugin', async () => {
  try {
    // @ts-ignore
    await createPlugin()()
    throw 'err'
  } catch (e) {
    assert.ok(e !== 'err')
  }
})

test.run()
