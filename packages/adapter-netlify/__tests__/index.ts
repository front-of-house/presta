import tap from 'tap'
import {
  createPlugin,
  toAbsolutePath,
  normalizeNetlifyRoute,
  prestaRoutesToNetlifyRedirects,
  generateRedirectsString,
} from '../'

tap.test('toAbsolutePath', async (t) => {
  t.equal(toAbsolutePath('/foo', 'bar'), '/foo/bar')
})

tap.test('normalizeNetlifyRoute', async (t) => {
  t.equal(normalizeNetlifyRoute('/foo'), '/foo')
  t.equal(normalizeNetlifyRoute('/*'), '/*')
  t.equal(normalizeNetlifyRoute('*'), '/*')
  t.equal(normalizeNetlifyRoute('/foo/*'), '/foo/*')
})

tap.test('prestaRoutesToNetlifyRedirects', async (t) => {
  t.same(prestaRoutesToNetlifyRedirects([['*', 'Func']])[0], {
    from: '/*',
    to: '/.netlify/functions/Func',
    status: 200,
  })
})

tap.test('generateRedirectsString', async (t) => {
  t.same(
    generateRedirectsString([
      {
        from: '/*',
        to: '/.netlify/functions/Func',
        status: 200,
      },
    ]),
    `/* /.netlify/functions/Func 200`
  )

  t.same(
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

tap.test('createPlugin', async (t) => {
  try {
    // @ts-ignore
    await createPlugin()()
    throw 'err'
  } catch (e) {
    t.ok(e !== 'err')
  }
})
