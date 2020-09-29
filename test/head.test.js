import PQueue from 'p-queue'

import { render } from '../load'

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
      one = await render(({ head }) => {
        head({ title: 'title' })
        return 'component'
      }, {})
    })
    queue.add(async () => {
      two = await render(({ head }) => {
        head({ description: 'description' })
        return 'component'
      }, {})
    })

    await t

    assert(one.head.title)
    assert(!one.head.description)
    assert(!two.head.title)
    assert(two.head.description)
  })
}
