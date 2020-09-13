const sinon = require('sinon')
const proxy = require('proxyquire')

const { createConfigFromCLI } = require('../createConfigFromCLI')

// const args = {
//   _: [],
//   c: '', // config
//   r: '', // runtime
//   i: '', // in
//   o: '', // out
//   inc: false, // incremental
// }

const i = 'pages/**/*.js'
const o = 'output'
const c = 'presta-config.js'
const r = 'presta-runtime.js'

module.exports = async function (test, assert) {
  test('createConfigFromCLI - throws with no input', async () => {
    try {
      const config = createConfigFromCLI({
        output: o
      })
    } catch (e) {
      assert(e)
    }
  })

  test('createConfigFromCLI - input', async () => {
    const config = createConfigFromCLI({
      pages: i,
      output: o
    })

    assert(config)
  })

  test('createConfigFromCLI - output', async () => {
    const config = createConfigFromCLI({
      pages: i,
      output: 'test'
    })

    assert(/\/test$/.test(config.output))
  })

  test('createConfigFromCLI - baseDir', async () => {
    const config = createConfigFromCLI({
      pages: i,
      output: o
    })

    assert(/\/pages$/.test(config.baseDir))

    const config2 = createConfigFromCLI({
      pages: '/foo/bar/pages/*.js',
      output: o
    })

    assert(/\/pages$/.test('/foo/bar/pages'))
  })

  test('createConfigFromCLI - incremental', async () => {
    const config = createConfigFromCLI({
      pages: i,
      output: o,
      incremental: true
    })

    assert(config.incremental)
  })

  test('createConfigFromCLI - c, config args', async () => {
    const spy = sinon.spy()

    const { createConfigFromCLI } = proxy('../createConfigFromCLI', {
      './safeConfigFilepath': {
        safeConfigFilepath: spy
      }
    })

    createConfigFromCLI({
      pages: i,
      output: o,
      config: c
    })
  })

  test('createConfigFromCLI - r, runtime args', async () => {
    const spy = sinon.spy()

    const { createConfigFromCLI } = proxy('../createConfigFromCLI', {
      './safeConfigFilepath': {
        safeConfigFilepath: spy
      }
    })

    createConfigFromCLI({
      pages: i,
      output: o,
      runtime: r
    })

    assert(spy.calledWith(r))
  })

  test('createConfigFromCLI - config file', async () => {
    const { createConfigFromCLI } = proxy('../createConfigFromCLI', {
      './safeConfigFilepath': {
        safeConfigFilepath (filepath) {
          return filepath
        }
      },
      './safeRequire': {
        safeRequire () {
          return {
            input: i,
            output: o,
            incremental: true
          }
        }
      }
    })

    const config = createConfigFromCLI({
      pages: i,
      config: c
    })

    assert.equal(config.input, i)
    assert(config.output.indexOf(o) > -1)
    assert(config.incremental)
    assert.equal(config.configFilepath, c)
  })
}
