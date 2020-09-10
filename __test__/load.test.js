const { prime, cache, load, render, expire } = require('../load')

function createComponent ({ key, duration, loadCb }) {
  return ({ children }) => {
    const loaded = load(
      async () => {
        loadCb()

        return {
          [key]: true
        }
      },
      { key, duration }
    )

    return JSON.stringify({
      ...loaded,
      children: children && loaded ? children({}) : null
    })
  }
}

module.exports = async (test, assert) => {
  test('requires a key', async () => {
    function component () {
      load(async () => ({ component: true }))
      return ''
    }

    try {
      await render(component, {})
    } catch (e) {
      assert(!!e)
    }
  })

  test('memory - loads', async () => {
    let loads = 0

    const comp = createComponent({
      key: 'a',
      loadCb () {
        loads++
      }
    })

    const { body } = await render(comp, {})
    const json = JSON.parse(body)

    assert(json.a)
    assert(loads === 1)
  })

  test('memory - multiple', async () => {
    let loads = 0

    const comp = createComponent({
      key: 'b',
      loadCb () {
        loads++
      }
    })

    const { body } = await render(comp, { children: comp })
    const json = JSON.parse(body)

    assert(json.b)

    // `b` should be cached
    assert(loads === 1)
  })

  test('memory - multiple separate', async () => {
    let loads = 0

    const c = createComponent({
      key: 'c',
      loadCb () {
        loads++
      }
    })

    const d = createComponent({
      key: 'd',
      loadCb () {
        loads++
      }
    })

    const { body } = await render(c, { children: d })
    const json = JSON.parse(body)

    assert(json.c)
    assert(json.children)

    // `c` and `d` should each have been loaded
    assert(loads === 2)
  })

  test('disk - loads', async () => {
    let loads = 0

    expire('disk')

    const comp = createComponent({
      key: 'disk',
      duration: '1m',
      loadCb () {
        loads++
      }
    })

    const { body } = await render(comp, { children: comp })
    const json = JSON.parse(body)

    assert(json.disk)
    assert(loads === 1)
  })

  test('memory - no recursion on error', async () => {
    let loads = 0

    function component () {
      loads++

      load(
        async () => {
          throw 'error'
          return 'data'
        },
        { key: 'recursion error' }
      )

      return 'component'
    }

    try {
      await render(component, {})
      throw 'unreachable'
    } catch (e) {
      assert((loads = 1))
    }
  })

  test('disk - no recursion on error', async () => {
    let loads = 0

    function component () {
      loads++

      load(
        async () => {
          throw 'error'
          return 'data'
        },
        { key: 'recursion error', duration: '1m' }
      )

      return 'component'
    }

    try {
      await render(component, {})
      throw 'unreachable'
    } catch (e) {
      assert((loads = 1))
    }
  })

  test('prime to memory', async () => {
    let loads = 0

    prime({ memory: true }, { key: 'memory' })

    const comp = createComponent({
      key: 'memory',
      loadCb () {
        loads++
      }
    })

    const { body } = await render(comp, { children: comp })
    const json = JSON.parse(body)

    assert(json.memory)
    assert(loads === 0)
  })

  test('prime to disk', async () => {
    let loads = 0

    expire('disk')

    prime({ disk: true }, { key: 'disk', duration: '1m' })

    const comp = createComponent({
      key: 'disk',
      duration: '1m',
      loadCb () {
        loads++
      }
    })

    const { body } = await render(comp, { children: comp })
    const json = JSON.parse(body)

    assert(json.disk)
    assert(loads === 0)
  })

  test('memory - catches sync error', async () => {
    let loads = 0

    function component () {
      loads++

      load(
        () => {
          throw 'error'
          return 'data'
        },
        { key: 'sync error' }
      )

      return 'component'
    }

    try {
      await render(component, {})
      throw 'unreachable'
    } catch (e) {
      assert((loads = 1))
    }
  })

  test('memory - catches async error', async () => {
    let loads = 0

    function component () {
      loads++

      load(
        async () => {
          throw 'error'
          return 'data'
        },
        { key: 'async error' }
      )

      return 'component'
    }

    try {
      await render(component, {})
      throw 'unreachable'
    } catch (e) {
      assert((loads = 1))
    }
  })
}
