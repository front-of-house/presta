import PQueue from 'p-queue'

import { render } from '../load'

export default async (test, assert) => {
  test('head - separate objects', async () => {
    // to mimic render
    const queue = new PQueue({ concurrency: 2 })

    let one
    let two

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

    await new Promise((y, n) => {
      queue.on('idle', () => {
        try {
          assert(one.head.title)
          assert(!one.head.description)
          assert(!two.head.title)
          assert(two.head.description)
        } catch (e) {
          n(e)
        }
      })
    })
  })
}
