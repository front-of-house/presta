import fs from 'fs-extra'
import path from 'path'

import * as fixtures from './fixtures'

import { OUTPUT_STATIC_DIR, OUTPUT_DYNAMIC_PAGES_ENTRY } from '../lib/constants'
import { build } from '../lib/build'

const outDir = path.join(fixtures.getRoot(), 'build/dist')

export default async (test, assert) => {
  test('build - static pages', async () => {
    const fsx = fixtures.create({
      a: {
        url: './build/a.js',
        content: `
          export const getStaticPaths = () => ([ 'path' ])
          export const template = () => 'page'
        `
      }
    })
    const config = {
      cwd: process.cwd(),
      pages: fsx.files.a,
      output: outDir
    }

    await build(config)

    const contents = fs.readFileSync(
      path.join(outDir, OUTPUT_STATIC_DIR, '/path/index.html'),
      'utf-8'
    )

    assert(contents.includes('page'))
  })

  test('build - dynamic pages', async () => {
    const fsx = fixtures.create({
      b: {
        url: './build/b.js',
        content: `
          export const route = 'path'
          export const template = () => 'page'
        `
      }
    })
    const config = {
      cwd: process.cwd(),
      pages: fsx.files.b,
      output: outDir,
      dynamicEntryFilepath: path.join(outDir, OUTPUT_DYNAMIC_PAGES_ENTRY)
    }

    await build(config)

    const contents = fs.readFileSync(
      path.join(outDir, OUTPUT_DYNAMIC_PAGES_ENTRY),
      'utf-8'
    )

    assert(contents.includes('build/b.js'))
  })
}
