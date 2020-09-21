import fs from 'fs-extra'
import path from 'path'

import { CWD } from '../lib/constants'
import { isStaticallyExportable } from '../lib/isStaticallyExportable'

const no = path.join(CWD, '/pages/NotStaticallyExportable.js')
const yes = path.join(CWD, '/pages/IsStaticallyExportable.js')

export default async function (test, assert) {
  test('isStaticallyExportable', async () => {
    fs.outputFileSync(no, `export function Page() {}`)
    fs.outputFileSync(
      yes,
      `export function getPaths() {};export function Page() {}`
    )

    assert(isStaticallyExportable(no) === false)
    assert(isStaticallyExportable(yes) === true)

    fs.outputFileSync(
      yes,
      `export const getPaths = () => {};export function Page() {}`
    )

    assert(isStaticallyExportable(yes) === true)

    fs.removeSync(no)
    fs.removeSync(yes)
  })
}
