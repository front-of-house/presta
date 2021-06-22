import path from 'path'

import * as fixtures from './fixtures'

import { createConfig } from '../lib/config'
import { createDynamicEntry } from '../lib/createDynamicEntry'

export default (test, assert) => {
  test('createDynamicEntry', () => {
    const fsx = fixtures.create({
      a: {
        url: './createDynamicEntry/a.js',
        content: ''
      },
      b: {
        url: './createDynamicEntry/b.js',
        content: ''
      }
    })
    const config = createConfig({
      cliArgs: {
        files: './createDynamicEntry/*.js',
        output: path.join(fixtures.getRoot(), 'output')
      }
    })

    const entry = createDynamicEntry([fsx.files.a, fsx.files.b], config)

    assert(entry.includes(config.merged.output))

    fsx.cleanup()
  })
}
