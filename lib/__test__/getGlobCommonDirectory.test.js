const { getGlobCommonDirectory } = require('../getGlobCommonDirectory')

module.exports = async function (test, assert) {
  test('getGlobCommonDirectory', async () => {
    assert(getGlobCommonDirectory('/*.js') === '/')
    assert(getGlobCommonDirectory('/**/*.js') === '/')
    assert(getGlobCommonDirectory('/foo/*.js') === '/foo')
    assert(getGlobCommonDirectory('/foo/**/*.js') === '/foo')
    assert(getGlobCommonDirectory('foo/**/*.js') === 'foo')
  })
}
