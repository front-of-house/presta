import tap from 'tap'
import { prime, load, flush, createLoadCache } from '../'

const wait = (t: number) => new Promise((r) => setTimeout(r, t, null))

tap.test('runs', async (t) => {
  let i = 0

  const loader = async () => {
    await wait(100)
    return { value: 'runs' }
  }

  function component() {
    i++
    const data = load(loader, { key: 'runs' })
    return data ? data.value : null
  }

  const { content, data } = await flush(component)

  t.equal(content, 'runs')
  t.equal(data.runs.value, 'runs')
  t.equal(i, 2)
})

tap.test('nested - cached', async (t) => {
  let i = 0

  const loader = async () => {
    await wait(100)
    return { value: 'nested' }
  }

  function child() {
    i++
    const data = load(loader, { key: 'nested' })
    return data ? data.value : null
  }

  function entry() {
    i++
    const data = load(loader, { key: 'nested' })
    return data ? child() : null
  }

  const { content, data } = await flush(entry)

  t.equal(content, 'nested')
  t.equal(data.nested.value, 'nested')
  t.equal(i, 3)
})

tap.test('nested - not cached', async (t) => {
  let i = 0

  const loader = async () => {
    await wait(100)
    return { value: 'nested' }
  }

  function child() {
    i++
    const data = load(loader, { key: 'nested_child' })
    return data ? data.value : null
  }

  function entry() {
    i++
    const data = load(loader, { key: 'nested_entry' })
    return data ? child() : null
  }

  const { content, data } = await flush(entry)

  t.equal(content, 'nested')
  t.equal(data.nested_entry.value, 'nested')
  t.equal(data.nested_child.value, 'nested')
  t.equal(i, 5)
})

tap.test('no recursion on error', async (t) => {
  let i = 0

  const loader = async () => {
    await wait(100)
    throw 'error'
    return { value: 'runs' }
  }

  function component() {
    i++
    const data = load(loader, { key: 'runs' })
    return data ? data.value : null
  }

  await flush(component)

  t.equal(i, 1)
})

tap.test('prime', async (t) => {
  let i = 0

  const loader = async () => {
    return { value: 'val' }
  }

  function component() {
    i++
    const data = load(loader, { key: 'runs' })
    return data ? data.value : null
  }

  prime('runs', 'val')

  await flush(component)

  t.equal(i, 1)
})

tap.test('catches sync and async errors', async (t) => {
  let one = 0
  let two = 0

  const asyncLoader = async () => {
    throw 'async'
    return { value: 'async' }
  }
  const syncLoader = () => {
    throw 'sync'
    return { value: 'sync' }
  }

  function asyncComponent() {
    one++
    const data = load(asyncLoader, { key: 'async' })
    return data ? data.value : null
  }
  function syncComponent() {
    two++
    // @ts-ignore
    const data = load(syncLoader, { key: 'async' })
    return data ? data.value : null
  }

  await flush(asyncComponent)
  t.equal(one, 2)

  await flush(syncComponent)
  t.equal(two, 1)
})

tap.test('loadCache - simple', async (t) => {
  const cache = createLoadCache('simple')

  cache.set('foo', 'bar')

  t.equal('bar', cache.get('foo'))

  cache.cleanup()
})

tap.test('loadCache - duration', async (t) => {
  const cache = createLoadCache('duration')

  cache.set('foo', 'bar', 1000)

  await wait(1100)

  t.notOk(cache.get('foo'))

  cache.cleanup()
})

tap.test('loadCache - clear', async (t) => {
  const cache = createLoadCache('clear')

  cache.set('foo', 'bar')
  cache.clear('foo')

  t.notOk(cache.get('foo'))

  cache.cleanup()
})

tap.test('loadCache - clearMemory', async (t) => {
  const cache = createLoadCache('clearMemory')

  cache.set('foo', 'bar')
  cache.set('baz', 'qux', 5000)

  cache.clearAllMemory()

  t.notOk(cache.get('foo'))
  t.equal('qux', cache.get('baz'))

  cache.cleanup()
})
