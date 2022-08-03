import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { slugify } from '../core'

test('works', async () => {
  const cwd = process.cwd()
  const fixture = afix({
    basic: ['file.js', ``],
    nested: ['pages/file.js', ``],
    complex: ['pages/file-something.page.js', ``],
  })

  process.chdir(fixture.root)

  assert.equal(slugify(fixture.files.basic.path, fixture.root), 'file')
  assert.equal(slugify(fixture.files.nested.path, fixture.root), 'pages-file')
  assert.equal(slugify(fixture.files.complex.path, fixture.root), 'pages-file-something-page')

  process.chdir(cwd)
})

test.run()
