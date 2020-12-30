import PQueue from 'p-queue'

import { render } from '../load'
import { head } from '../lib/pluginHead'

export default async (test, assert) => {
  test('head - separate objects', async () => {
    // to mimic render
    const queue = new PQueue({ concurrency: 2 })

    let one
    let two

    const t = new Promise(y => {
      queue.on('idle', y)
    })

    queue.add(async () => {
      const context = { plugins: {}, props: {} }

      context.plugins.head = head()(context)

      one = await render(({ plugins }) => {
        plugins.head({ title: 'title' })
        return 'component'
      }, context)
    })
    queue.add(async () => {
      const context = { plugins: {}, props: {} }

      context.plugins.head = head()(context)

      two = await render(({ plugins }) => {
        plugins.head({ description: 'description' })
        return 'component'
      }, context)
    })

    await t

    assert(one.props.head.title)
    assert(!one.props.head.description)
    assert(!two.props.head.title)
    assert(two.props.head.description)
  })
}
