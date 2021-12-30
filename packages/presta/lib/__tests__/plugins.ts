import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { Config } from '../config'
import { Hooks } from '../createEmitter'
import { createPlugin, initPlugins } from '../plugins'

const test = suite('presta - config')

test('initPlugins', async () => {
  let plan = 0

  const context = {
    foo: true,
  } as unknown as Config
  const hooks = {
    hook: true,
  } as unknown as Hooks

  const plugin = createPlugin(() => (ctx, hks) => {
    assert.equal(ctx, context)
    assert.equal(hks, hooks)
    plan++
    return {
      cleanup() {
        plan++
      },
    }
  })
  const plugins = [plugin()]

  const plugs = await initPlugins(plugins, context, hooks)

  await plugs.cleanup()

  assert.equal(plan, 2)
})

test.run()
