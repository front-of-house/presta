import fs from 'fs-extra'
import path from 'path'
import proxyquire from 'proxyquire'

import * as fixtures from './fixtures'

import { OUTPUT_STATIC_DIR } from '../lib/constants'
import { renderStaticEntries } from '../lib/renderStaticEntries'
import { createStaticEntry } from '../lib/createEntries'

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

  const contents = fs.readFileSync(
    path.join(outDir, OUTPUT_STATIC_DIR, allGeneratedFiles[0]),
    'utf-8'
  )

  fsx.cleanup()

  return contents
}

export default async (test, assert) => {
  test('renderStaticEntries - base', async () => {
    const page = await createPageFromSourceFile({
      url: 'a',
      content: `
        export const getPaths = () => ([ 'path' ])
        export const Page = () => 'page'
      `
    })

    assert(page.includes('<body>page</body>'))
  })

  test('renderStaticEntries - user config overrides', async () => {
    const page = await createPageFromSourceFile(
      {
        url: 'b',
        content: `
        export const getPaths = () => ([ 'path.json' ])
        export const Page = (prop = '') => 'page' + prop
      `
      },
      {
        url: 'overrides.config',
        content: `
        export const render = (page, context) => page(' rendered')
        export const createDocument = (context) => context.body
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
        export const getPaths = () => ([ 'path.json' ])
        export const Page = (prop = '') => 'page' + prop
        export const render = (page, context) => page(' page rendered')
        export const createDocument = (context) => context.body + ' cd'
      `
      },
      {
        url: 'overrides-page-level.config',
        content: `
        export const render = (page, context) => page(' rendered')
        export const createDocument = (context) => context.body
      `
      }
    )

    assert(page === 'page page rendered cd')
  })
}
