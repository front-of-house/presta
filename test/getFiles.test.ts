import * as fixtures from './fixtures'

import { isStatic, isDynamic, getFiles } from '../lib/getFiles'

import type { Presta } from '../'

export default function (test, assert) {
  test('getFiles - isStatic', async () => {
    const files = {
      A: {
        url: './getFiles/isStaticA.js',
        content: `export function template() {}`
      },
      B: {
        url: './getFiles/isStaticB.js',
        content: `export function getStaticPaths() {};export function template() {}`
      },
      C: {
        url: './getFiles/isStaticC.js',
        content: `export const getStaticPaths = () => {};export function template() {}`
      }
    }

    const fsx = fixtures.create(files)

    assert(isStatic(files.A.url) === false)
    assert(isStatic(files.B.url) === true)
    assert(isStatic(files.C.url) === true)

    fsx.cleanup()
  })

  test('getFiles - isDynamic', async () => {
    const files = {
      A: {
        url: './getFiles/isStaticA.js',
        content: `export function template() {}`
      },
      B: {
        url: './getFiles/isStaticB.js',
        content: `export const route = '/';export function template() {}`
      }
    }

    const fsx = fixtures.create(files)

    assert(isDynamic(files.A.url) === false)
    assert(isDynamic(files.B.url) === true)

    fsx.cleanup()
  })

  test('getFiles - getFiles', async () => {
    const files = {
      A: {
        url: './getFiles/A.js',
        content: `export function template() {}`
      },
      B: {
        url: './getFiles/B.js',
        content: `export const route = '/';export function getStaticPaths() {};export function template() {}`
      },
      C: {
        url: './getFiles/C.js',
        content: `export const getStaticPaths = () => {};export function template() {}`
      }
    }

    const fsx = fixtures.create(files)

    const results = getFiles({
      cwd: process.cwd(),
      merged: { files: ['./getFiles/*.js'] }
    } as Presta)
    assert(results.length === 3)

    fsx.cleanup()
  })
}
