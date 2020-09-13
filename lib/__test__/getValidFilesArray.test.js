const { getValidFilesArray } = require('../getValidFilesArray')

module.exports = async function (test, assert) {
  test('getValidFilesArray', async () => {
    const files = getValidFilesArray('./pages/**/*.js')
    const findsRoot = files.filter(f => f.includes('pages/Root'))
    assert(!!findsRoot.length)
  })
}
