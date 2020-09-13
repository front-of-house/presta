const fs = require('fs-extra')
const path = require('path')

const { CWD } = require('../constants')
const { isStaticallyExportable } = require('../isStaticallyExportable')

const no = path.join(CWD, '/pages/NotStaticallyExportable.js')
const yes = path.join(CWD, '/pages/IsStaticallyExportable.js')

module.exports = async function (test, assert) {
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
