import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { Events, createEmitter, createHooks } from '../createEmitter'

const test = suite('presta - hooks')

test('createEmitter', async () => {
  const emitter = createEmitter()

  let plan = 0

  const remove = emitter.on(Events.PostBuild, () => plan++)

  emitter.emit(Events.PostBuild)

  remove()

  emitter.emit(Events.PostBuild)

  emitter.on(Events.PostBuild, () => plan++)

  emitter.emit(Events.PostBuild)

  assert.equal(emitter.listeners.length, 1)

  emitter.clear()

  emitter.emit(Events.PostBuild)

  assert.equal(plan, 2)
})

test('createHooks', async () => {
  const emitter = createEmitter()
  const hooks = createHooks(emitter)

  let plan = 0

  const remove = hooks.onBrowserRefresh(() => plan++)

  hooks.emitBrowserRefresh()

  remove()

  hooks.emitBrowserRefresh()

  hooks.onBrowserRefresh(() => plan++)

  hooks.emitBrowserRefresh()

  emitter.clear()

  hooks.emitBrowserRefresh()

  assert.equal(plan, 2)
})

test.run()
