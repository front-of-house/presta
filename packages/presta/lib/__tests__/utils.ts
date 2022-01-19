import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import * as utils from '../utils'

const test = suite('presta - utils')

test('createLiveReloadScript', () => {
  const script = utils.createLiveReloadScript({ port: 4000 })
  assert.type(script, 'string')
  assert.ok(/localhost:4000/.test(script))
})

test.run()
