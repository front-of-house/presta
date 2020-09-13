const { encodeFilename } = require('../encodeFilename')

module.exports = async function (test, assert) {
  test('encodeFilename', async () => {
    assert(encodeFilename('test.js') === 'test')
    assert(encodeFilename('/test.js') === '@test')
    assert(encodeFilename('/foo/bar/test.js') === '@foo@bar@test')
  })
}
