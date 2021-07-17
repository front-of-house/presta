import tap from 'tap'
import path from 'path'

import { isStatic, isDynamic, getFiles } from '../lib/getFiles'
import type { Presta } from '..'

tap.test('getFiles - isStatic', async (t) => {
  const fixtures = {
    no: 'noGetStaticPaths.js',
    yes: 'getStaticPaths.js',
    arrow: 'getStaticPathsArrow.js',
  }

  t.testdir({
    [fixtures.no]: `export function handler () {}`,
    [fixtures.yes]: `export function getStaticPaths () {}`,
    [fixtures.arrow]: `export const getStaticPaths = () => {}`,
  })

  t.equal(isStatic(path.join(t.testdirName, fixtures.no)), false)
  t.equal(isStatic(path.join(t.testdirName, fixtures.yes)), true)
  t.equal(isStatic(path.join(t.testdirName, fixtures.arrow)), true)
})

tap.test('getFiles - isDynamic', async (t) => {
  const fixtures = {
    no: 'noRoute.js',
    yes: 'route.js',
  }

  t.testdir({
    [fixtures.no]: `export function handler() {}`,
    [fixtures.yes]: `export const route = '/';`,
  })

  t.equal(isDynamic(path.join(t.testdirName, fixtures.no)), false)
  t.equal(isDynamic(path.join(t.testdirName, fixtures.yes)), true)
})

tap.test('getFiles - getFiles', async (t) => {
  t.testdir({
    'noMatch.getFiles.js': 'export function handler() {}',
    'hybrid.getFiles.js': `export const route = '*';export function getStaticPaths() {};`,
    'static.getFiles.js': `export function getStaticPaths() {};`,
  })

  const results = getFiles({
    cwd: process.cwd(),
    files: [path.join(t.testdirName, '*.getFiles.js')],
  } as Presta)

  t.equal(results.length, 3)
})
