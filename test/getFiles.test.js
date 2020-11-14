import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { isStatic, isDynamic, getFiles } from '../lib/getFiles'

export default async function (test, assert) {
  test('getFiles - isStatic', async () => {
    const files = {
      A: {
        url: './getFiles/isStaticA.js',
        content: `export function Page() {}`,
      },
      B: {
        url: './getFiles/isStaticB.js',
        content: `export function getPaths() {};export function Page() {}`,
      },
      C: {
        url: './getFiles/isStaticC.js',
        content: `export const getPaths = () => {};export function Page() {}`,
      }
    }

    const cleanup = fixtures.create(files)

    assert(isStatic(files.A.url) === false)
    assert(isStatic(files.B.url) === true)
    assert(isStatic(files.C.url) === true)

    cleanup()
  })

  test('getFiles - isDynamic', async () => {
    const files = {
      A: {
        url: './getFiles/isStaticA.js',
        content: `export function Page() {}`,
      },
      B: {
        url: './getFiles/isStaticB.js',
        content: `export const route = '/';export function Page() {}`,
      },
    }

    const cleanup = fixtures.create(files)

    assert(isDynamic(files.A.url) === false)
    assert(isDynamic(files.B.url) === true)

    cleanup()
  })

  test('getFiles - getFiles', async () => {
    const files = {
      A: {
        url: './getFiles/A.js',
        content: `export function Page() {}`,
      },
      B: {
        url: './getFiles/B.js',
        content: `export const route = '/';export function getPaths() {};export function Page() {}`,
      },
      C: {
        url: './getFiles/C.js',
        content: `export const getPaths = () => {};export function Page() {}`,
      }
    }

    const cleanup = fixtures.create(files)

    const results = getFiles(['./getFiles/*.js'])
    assert(results.length === 3)

    cleanup()
  })
}
