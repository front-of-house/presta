import { getValidFilesArray } from '../lib/getValidFilesArray'

export default async function (test, assert) {
  test('getValidFilesArray', async () => {
    const files = getValidFilesArray('./pages/**/*.js')
    assert(files.length === 1)
  })
}
