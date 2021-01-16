const fs = require('fs-extra')
const path = require('path')

const fixtures = require('./fixtures')

const { OUTPUT_STATIC_DIR } = require('../lib/constants')
const { renderStaticEntries } = require('../lib/renderStaticEntries')
const { createStaticEntry } = require('../lib/createEntries')
const { getLogs } = require('../lib/log')

/*
 * Think of this as basically creating a page/config pair.
 *
 * It then renders the page or file and returns the contents of that file.
 */
async function createPageFromSourceFile (page, conf = {}) {
  const outDir = path.join(fixtures.getRoot(), 'renderStaticEntries/dist')
  const fsx = fixtures.create({
    a: {
      url: `./renderStaticEntries/${page.url}.js`,
      content: page.content
    },
    config: {
      url: `./renderStaticEntries/${conf.url || 'presta.config'}.js`,
      content: conf.content || ''
    }
  })
  const config = { output: outDir, configFilepath: fsx.files.config }
  const entry = createStaticEntry(fsx.files.a, outDir, config)
  const entries = [entry]

  const { allGeneratedFiles } = await renderStaticEntries(entries, config)

  if (!allGeneratedFiles.length) return ''

  const contents = fs.readFileSync(
    path.join(outDir, OUTPUT_STATIC_DIR, allGeneratedFiles[0]),
    'utf-8'
  )

  fsx.cleanup()

  return contents
}

module.exports = async (test, assert) => {
  test('renderStaticEntries - base', async () => {
    const page = await createPageFromSourceFile({
      url: 'a',
      content: `
        export const getStaticPaths = () => ([ 'path' ])
        export const template = () => 'page'
      `
    })

    assert(page.includes('page</body>'))
  })

  test('renderStaticEntries - user config overrides', async () => {
    const page = await createPageFromSourceFile(
      {
        url: 'b',
        content: `
        export const getStaticPaths = () => ([ 'path.json' ])
        export const template = (prop = '') => 'page' + prop
      `
      },
      {
        url: 'overrides.config',
        content: `
        export const render = (page, context) => page(' rendered')
        export const createContent = (context) => context.content
      `
      }
    )

    assert(page === 'page rendered')
  })

  test('renderStaticEntries - page level overrides', async () => {
    const page = await createPageFromSourceFile(
      {
        url: 'c',
        content: `
        export const getStaticPaths = () => ([ 'path.json' ])
        export const template = (prop = '') => 'page' + prop
        export const render = (page, context) => page(' page rendered')
        export const createContent = (context) => context.content + ' cd'
      `
      },
      {
        url: 'overrides-page-level.config',
        content: `
        export const render = (page, context) => page(' rendered')
        export const createContent = (context) => context.content
      `
      }
    )

    assert(page === 'page page rendered cd')
  })

  test('renderStaticEntries - entry prep errors', async () => {
    await createPageFromSourceFile({
      url: 'syntax',
      content: `
        export const getStaticPaths = () => ([ 'path' ]
        export const template = () => 'page'
      `
    })

    assert(getLogs().includes('SyntaxError'))

    await createPageFromSourceFile({
      url: 'getStaticPaths',
      content: `
        export const template = () => 'page'
      `
    })

    assert(getLogs().includes('getStaticPaths'))
  })

  test('renderStaticEntries - render errors', async () => {
    await createPageFromSourceFile({
      url: 'renderError',
      content: `
        export const getStaticPaths = () => ([ 'path' ])
        export const template = () => 'page'
        export const render = () => { throw 'render error' }
      `
    })

    assert(getLogs().includes('render error'))
  })
}
