import { createCache } from '../lib/loadCache'

const wait = t => new Promise(r => setTimeout(r, t))

module.exports = async (test, assert) => {
  test('simple', async () => {
    const cache = createCache('simple')

    cache.set('foo', 'bar')

    assert('bar' === cache.get('foo'))

    cache.cleanup()
  })

  test('duration', async () => {
    const cache = createCache('duration')

    cache.set('foo', 'bar', 1000)

    await wait(1100)

    assert(undefined === cache.get('foo'))

    cache.cleanup()
  })

  test('clear', async () => {
    const cache = createCache('clear')

    cache.set('foo', 'bar')
    cache.clear('foo')

    assert(undefined === cache.get('foo'))

    cache.cleanup()
  })

  test('clearMemory', async () => {
    const cache = createCache('clearMemory')

    cache.set('foo', 'bar')
    cache.set('baz', 'qux', 5000)

    cache.clearAllMemory()

    assert(undefined === cache.get('foo'))
    assert('qux' === cache.get('baz'))

    cache.cleanup()
  })
}
