import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
import chokidar from 'chokidar'

const test = suite('presta - cli')

test('buildCommand', async () => {
  let plan = 0

  const { buildCommand } = require('proxyquire')('../cli', {
    './config': {
      getConfigFile() {
        plan++
        return {}
      },
      getAvailablePort() {
        plan++
        return 4000
      },
      create() {
        plan++
        return {}
      },
    },
    './plugins': {
      initPlugins() {
        plan++
      },
    },
    'fs-extra': {
      emptyDirSync() {
        plan++
      },
    },
    './build': {
      build() {
        plan++
      },
    },
  })

  await buildCommand({})

  assert.equal(plan, 6)
})

test('devCommand', async () => {
  let plan = 0

  const { devCommand } = require('proxyquire')('../cli', {
    chokidar: {
      watch() {
        plan++
        return {
          on() {
            plan++
          },
        }
      },
    },
    './config': {
      getConfigFile() {
        plan++
        return {}
      },
      getAvailablePort() {
        plan++
        return 4000
      },
      create() {
        plan++
        return {}
      },
    },
    './plugins': {
      initPlugins() {
        plan++
      },
    },
    './serve': {
      serve() {
        plan++
        return {}
      },
    },
    './watch': {
      watch() {
        plan++
      },
    },
    'fs-extra': {
      emptyDirSync() {
        plan++
      },
    },
    './build': {
      build() {
        plan++
      },
    },
  })

  await devCommand({})

  assert.equal(plan, 10)

  plan = 0

  await devCommand({
    'no-serve': true,
  })

  assert.equal(plan, 7)
})

test('serveCommand', async () => {
  let plan = 0

  const { serveCommand } = require('proxyquire')('../cli', {
    './config': {
      getConfigFile() {
        plan++
        return {}
      },
      getAvailablePort() {
        plan++
        return 4000
      },
      create() {
        plan++
        return {}
      },
    },
    './plugins': {
      initPlugins() {
        plan++
      },
    },
    './serve': {
      serve() {
        plan++
        return { port: 4000 }
      },
    },
  })

  await serveCommand({})

  assert.equal(plan, 5)
})

/*
 * E2E test, runs servers and closes them
 */
test('devCommand E2E', async () => {
  let plan = 0

  const fixture = afix({
    config: ['presta.config.js', ``],
  })

  const { devCommand } = require('proxyquire')('../cli', {
    './watch': {
      watch() {
        return {
          close() {
            plan++
          },
        }
      },
    },
    './serve': {
      serve() {
        return {
          port: 4000,
          close() {
            plan++
          },
        }
      },
    },
  })

  const { close } = await devCommand({
    _: [],
    config: fixture.files.config.path,
    output: path.join(fixture.root, 'build'),
    assets: path.join(fixture.root, 'assets'),
  })

  fs.writeFileSync(fixture.files.config.path, 'export const port = 4000', 'utf8')

  let watcherWatcher: ReturnType<typeof chokidar.watch>

  // gotta wait for fs watch events
  await new Promise((r) => {
    watcherWatcher = chokidar.watch(fixture.files.config.path, { ignoreInitial: true }).on('all', () => {
      // wait for re-startDevServer, gross, TODO
      setTimeout(() => {
        r(1)
      }, 1000)
    })
  })

  try {
    assert.equal(plan, 2)
    await close()
    await watcherWatcher.close()
  } catch (e) {
    await close()
    await watcherWatcher.close()
    throw e
  }
})

test.run()
