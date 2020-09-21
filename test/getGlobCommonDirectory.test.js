import { getGlobCommonDirectory } from '../lib/getGlobCommonDirectory'

export default async function (test, assert) {
  test('getGlobCommonDirectory', async () => {
    assert(getGlobCommonDirectory('/*.js') === '/')
    assert(getGlobCommonDirectory('/**/*.js') === '/')
    assert(getGlobCommonDirectory('/foo/*.js') === '/foo')
    assert(getGlobCommonDirectory('/foo/**/*.js') === '/foo')
    assert(getGlobCommonDirectory('foo/**/*.js') === 'foo')
  })
}
