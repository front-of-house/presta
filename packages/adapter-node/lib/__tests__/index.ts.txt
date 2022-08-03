import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

const test = suite('@presta/adapter-node')

test('onPostBuild', async () => {})

test('createPlugin', async () => {
  let plan = 0
  const fixture = afix({})
  const output = path.join(fixture.root, 'build')

  const { default: createPlugin } = require('proxyquire')('../index', {
    esbuild: {
      build() {
        plan++
      },
    },
  })

  new Promise(async (y, n) => {
    createPlugin()(
      // @ts-ignore
      {},
      {
        async onPostBuild(fn: any) {
          plan++
          try {
            await fn({ output }, { port: 4000 })
            y(1)
          } catch (e) {
            n(e)
          }
        },
      }
    )
  })

  const server = fs.readFileSync(path.join(output, 'server.js'), 'utf8')

  assert.equal(plan, 2)
  assert.ok(server.includes(output))
  assert.ok(server.includes('4000'))
})

test.run()
