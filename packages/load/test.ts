import { prime, load, flush, createLoadCache } from './index'

const wait = (t: number) => new Promise((r) => setTimeout(r, t))

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

  expect(content).toEqual('runs')
  expect(data.runs.value).toEqual('runs')
  expect(i).toEqual(2)
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

  expect(content).toEqual('nested')
  expect(data.nested.value).toEqual('nested')
  expect(i).toEqual(3)
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

  expect(content).toEqual('nested')
  expect(data.nested_entry.value).toEqual('nested')
  expect(data.nested_child.value).toEqual('nested')
  expect(i).toEqual(5)
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

  expect(i).toEqual(1)
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

  expect(i).toEqual(1)
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
  expect(one).toEqual(2)

  await flush(syncComponent)
  expect(two).toEqual(1)
})

describe('loadCache', () => {
  test('simple', async () => {
    const cache = createLoadCache('simple')

    cache.set('foo', 'bar')

    expect('bar').toEqual(cache.get('foo'))

    cache.cleanup()
  })

  test('duration', async () => {
    const cache = createLoadCache('duration')

    cache.set('foo', 'bar', 1000)

    await wait(1100)

    expect(cache.get('foo')).toBeUndefined()

    cache.cleanup()
  })

  test('clear', async () => {
    const cache = createLoadCache('clear')

    cache.set('foo', 'bar')
    cache.clear('foo')

    expect(cache.get('foo')).toBeUndefined()

    cache.cleanup()
  })

  test('clearMemory', async () => {
    const cache = createLoadCache('clearMemory')

    cache.set('foo', 'bar')
    cache.set('baz', 'qux', 5000)

    cache.clearAllMemory()

    expect(cache.get('foo')).toBeUndefined()
    expect('qux').toEqual(cache.get('baz'))

    cache.cleanup()
  })
})
