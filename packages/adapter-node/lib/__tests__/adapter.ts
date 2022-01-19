import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

const test = suite('@presta/adapter-node - adapter')

test('adapter', async () => {
  let plan = 0

  const route = '/url'
  const fixture = afix({
    fn: ['build/functions/fn.js', 'export function handler() {}'],
  })

  const { adapter } = require('proxyquire')('../adapter', {
    sirv: (dir: string) => {
      plan++
      assert.equal(dir, path.join(fixture.root, 'build/static'))
    },
    polka() {
      return {
        use() {
          return {
            all(r: string, fn: any) {
              plan++
              assert.equal(r, route)
              fn()
            },
            listen() {
              plan++
            },
          }
        },
      }
    },
    '@presta/utils/requestToEvent': {
      requestToEvent() {
        plan++
        return {}
      },
    },
    '@presta/utils/sendServerlessResponse': {
      sendServerlessResponse() {
        plan++
      },
    },
  })

  adapter(
    {
      staticOutput: path.join(fixture.root, 'build/static'),
      functionsManifest: {
        [route]: fixture.files.fn.path,
      },
    },
    { port: 4000 }
  )

  assert.equal(plan, 4)
})

test.run()
