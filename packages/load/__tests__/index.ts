import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { prime, load, flush, createLoadCache } from '../'

const test = suite('@presta/load')

const wait = (t: number) => new Promise((r) => setTimeout(r, t, null))

test('runs', async () => {
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

  assert.equal(content, 'runs')
  assert.equal(data.runs.value, 'runs')
  assert.equal(i, 2)
})

test('nested - cached', async () => {
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

  assert.equal(content, 'nested')
  assert.equal(data.nested.value, 'nested')
  assert.equal(i, 3)
})

test('nested - not cached', async () => {
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

  assert.equal(content, 'nested')
  assert.equal(data.nested_entry.value, 'nested')
  assert.equal(data.nested_child.value, 'nested')
  assert.equal(i, 5)
})

test('no recursion on error', async () => {
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

  assert.equal(i, 1)
})

test('prime', async () => {
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

  assert.equal(i, 1)
})

test('catches sync and async errors', async () => {
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
  assert.equal(one, 2)

  await flush(syncComponent)
  assert.equal(two, 1)
})

test('loadCache - simple', async () => {
  const cache = createLoadCache('simple')

  cache.set('foo', 'bar')

  assert.equal('bar', cache.get('foo'))

  cache.cleanup()
})

test('loadCache - duration', async () => {
  const cache = createLoadCache('duration')

  cache.set('foo', 'bar', 1000)

  await wait(1100)

  assert.not.ok(cache.get('foo'))

  cache.cleanup()
})

test('loadCache - clear', async () => {
  const cache = createLoadCache('clear')

  cache.set('foo', 'bar')
  cache.clear('foo')

  assert.not.ok(cache.get('foo'))

  cache.cleanup()
})

test('loadCache - clearMemory', async () => {
  const cache = createLoadCache('clearMemory')

  cache.set('foo', 'bar')
  cache.set('baz', 'qux', 5000)

  cache.clearAllMemory()

  assert.not.ok(cache.get('foo'))
  assert.equal('qux', cache.get('baz'))

  cache.cleanup()
})

test.run()
