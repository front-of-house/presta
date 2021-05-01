const path = require('path')

const fixtures = require('./fixtures')
const { create, unmerge } = require('../lib/config')

module.exports = async function (test, assert) {
  test('config - defaults', async () => {
    const files = 'app/**/*.js'
    const cli = { files }
    const config = create(cli)

    assert(Array.isArray(config.cliArgs.files))
    assert.deepEqual(config.configFile, {})

    assert(config.files[0].includes(files))
    assert(path.isAbsolute(config.output))
    assert(path.isAbsolute(config.assets))
    assert(path.isAbsolute(config.cwd))
    assert(config.configFilepath === undefined)
    assert(config.dynamicEntryFilepath.includes(config.output))
  })

  test('config - no files', async () => {
    const cli = {}
    const config = create(cli)

    assert.deepEqual(config.files, [])
  })

  test('config - output', async () => {
    const files = 'app/**/*.js'
    const output = 'dist'
    const cli = { files, output }
    const config = create(cli)

    assert(config.output.includes(output))
    assert(path.isAbsolute(config.output))
  })

  test('config - assets', async () => {
    const files = 'app/**/*.js'
    const output = 'dist'
    const assets = 'assets'
    const cli = { files, output, assets }
    const config = create(cli)

    assert(config.assets.includes(assets))
    assert(path.isAbsolute(config.assets))
  })

  test('config - picks up default file if present', async () => {
    const files = 'files/*.js'
    const output = 'output'
    const fsx = fixtures.create({
      config: {
        url: 'presta.config.js',
        content: `export const files = '${files}'; export const output = '${output}'`
      }
    })

    const config = create({})

    assert(path.isAbsolute(config.configFilepath))
    assert(config.files[0].includes(files))
    assert(config.output.includes(output))

    fsx.cleanup()
  })

  test('config - picks up custom file if present', async () => {
    const files = 'files/*.js'
    const output = 'output'
    const fsx = fixtures.create({
      config: {
        url: 'presta-config.js',
        content: `export const files = '${files}'; export const output = '${output}'`
      }
    })

    const config = create({
      config: fsx.files.config
    })

    assert(config.configFilepath.includes(fsx.files.config))
    assert(path.isAbsolute(config.configFilepath))
    assert(config.files[0].includes(files))
    assert(config.output.includes(output))

    fsx.cleanup()
  })

  test('config - overriden by CLI args', async () => {
    const fsx = fixtures.create({
      config: {
        url: 'presta.config.js',
        content: `export const files = './files/*.js'; export const output = './output'`
      }
    })

    const config = create({
      files: 'foo',
      output: 'dist'
    })

    assert(config.files.find(p => p.includes('foo')))
    assert(config.output.includes('dist'))

    // should merge files
    assert(config.files.find(p => p.includes('files/*.js')))

    fsx.cleanup()
  })

  test('config - file is merged with internal config', async () => {
    const fsx = fixtures.create({
      config: {
        url: 'presta.merged.config.js',
        content: `export const output = 'public'`
      }
    })

    const config = create({
      files: 'foo',
      config: fsx.files.config
    })

    assert(config.output.includes('public'))
    assert(config.dynamicEntryFilepath.includes(config.output))

    fsx.cleanup()
  })

  test('config - unmerge', async () => {
    const fsx = fixtures.create({
      config: {
        url: 'presta.unmerged.config.js',
        content: `
          export const files = 'foo'
          export const output = 'output'
          export function createContent(context) {}
        `
      }
    })

    const curr = create({
      files: 'bar',
      config: 'presta.unmerged.config.js'
    })
    const prev = require(fsx.files.config)

    assert(curr.files.length === 2) // merged
    assert(curr.output.includes('output'))
    assert(curr.dynamicEntryFilepath.includes(curr.output))

    const unmerged = unmerge(curr, prev)

    assert(unmerged.files.length === 1)
    assert(unmerged.files[0].includes('bar'))
    assert(unmerged.output.includes('build'))
    assert(unmerged.dynamicEntryFilepath.includes(unmerged.output))

    fsx.cleanup()
  })
}
