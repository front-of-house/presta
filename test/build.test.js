const fs = require('fs-extra')
const path = require('path')

const fixtures = require('./fixtures')

const {
  OUTPUT_STATIC_DIR,
  OUTPUT_DYNAMIC_PAGES_ENTRY
} = require('../lib/constants')
const { build } = require('../lib/build')

const outDir = path.join(fixtures.getRoot(), 'build/dist')

module.exports = async (test, assert) => {
  test.skip('build - static files', async () => {
    const fsx = fixtures.create({
      a: {
        url: './build/a.js',
        content: `
          export const getStaticPaths = () => ([ 'path' ])
          export const handler = () => 'page'
        `
      }
    })
    const config = {
      env: 'production',
      cwd: process.cwd(),
      files: fsx.files.a,
      output: outDir
    }

    await build(config)

    const contents = fs.readFileSync(
      path.join(outDir, OUTPUT_STATIC_DIR, '/path/index.html'),
      'utf-8'
    )

    assert(contents.includes('page'))
  })

  test.skip('build - dynamic files', async () => {
    const fsx = fixtures.create({
      b: {
        url: './build/b.js',
        content: `
          export const route = 'path'
          export const handler = () => 'page'
        `
      }
    })
    const config = {
      env: 'production',
      cwd: process.cwd(),
      files: fsx.files.b,
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
