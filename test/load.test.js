const { prime, load, flush } = require('../lib/load')

const wait = t => new Promise(r => setTimeout(r, t))

module.exports = async (test, assert) => {
  test('runs', async () => {
    let i = 0

    const loader = async () => {
      await wait(100)
      return { value: 'runs' }
    }

    function component () {
      i++
      const data = load(loader, { key: 'runs' })
      return data ? data.value : null
    }

    const { content, data } = await flush(component)

    assert(content === 'runs')
    assert(data.runs.value === 'runs')
    assert(i === 2)
  })

  test('nested - cached', async () => {
    let i = 0

    const loader = async () => {
      await wait(100)
      return { value: 'nested' }
    }

    function child () {
      i++
      const data = load(loader, { key: 'nested' })
      return data ? data.value : null
    }

    function entry () {
      i++
      const data = load(loader, { key: 'nested' })
      return data ? child() : null
    }

    const { content, data } = await flush(entry)

    assert(content === 'nested')
    assert(data.nested.value === 'nested')
    assert(i === 3)
  })

  test('nested - not cached', async () => {
    let i = 0

    const loader = async () => {
      await wait(100)
      return { value: 'nested' }
    }

    function child () {
      i++
      const data = load(loader, { key: 'nested_child' })
      return data ? data.value : null
    }

    function entry () {
      i++
      const data = load(loader, { key: 'nested_entry' })
      return data ? child() : null
    }

    const { content, data } = await flush(entry)

    assert(content === 'nested')
    assert(data.nested_entry.value === 'nested')
    assert(data.nested_child.value === 'nested')
    assert(i === 5)
  })

  test('no recursion on error', async () => {
    let i = 0

    const loader = async () => {
      await wait(100)
      throw 'error'
      return { value: 'runs' }
    }

    function component () {
      i++
      const data = load(loader, { key: 'runs' })
      return data ? data.value : null
    }

    await flush(component)

    assert(i === 1)
  })

  test('prime', async () => {
    let i = 0

    const loader = async () => {
      return { value: 'val' }
    }

    function component () {
      i++
      const data = load(loader, { key: 'runs' })
      return data ? data.value : null
    }

    prime('runs', 'val')

    await flush(component)

    assert(i === 1)
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

    function asyncComponent () {
      one++
      const data = load(asyncLoader, { key: 'async' })
      return data ? data.value : null
    }
    function syncComponent () {
      two++
      const data = load(syncLoader, { key: 'async' })
      return data ? data.value : null
    }

    await flush(asyncComponent)
    assert(one === 2)

    await flush(syncComponent)
    assert(two === 1)
  })
}
