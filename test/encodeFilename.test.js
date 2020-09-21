import { encodeFilename } from '../lib/encodeFilename'

export default async function (test, assert) {
  test('encodeFilename', async () => {
    assert(encodeFilename('test.js') === 'test')
    assert(encodeFilename('/test.js') === '@test')
    assert(encodeFilename('/foo/bar/test.js') === '@foo@bar@test')
  })
}
