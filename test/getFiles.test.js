import fs from 'fs-extra'
import path from 'path'

import { CWD } from '../lib/constants'
import { isStatic, isDynamic, getFiles } from '../lib/getFiles'

const A = path.join(CWD, '/pages/getFilesA.js')
const B = path.join(CWD, '/pages/getFilesB.js')

export default async function (test, assert) {
  test('getFiles - isStatic', async () => {
    fs.outputFileSync(A, `export function Page() {}`)
    fs.outputFileSync(
      B,
      `export const route = '/';export function getPaths() {};export function Page() {}`
    )

    assert(isStatic(A) === false)
    assert(isStatic(B) === true)
    assert(isDynamic(A) === false)
    assert(isDynamic(B) === true)

    fs.outputFileSync(
      B,
      `export const getPaths = () => {};export function Page() {}`
    )

    assert(isStatic(B) === true)

    fs.removeSync(A)
    fs.removeSync(B)
  })

  test('getFiles - getFiles', async () => {
    const files = getFiles(['./pages/**/*.js'])
    assert(files.length === 2)
  })
}
