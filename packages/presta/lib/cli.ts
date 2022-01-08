import fs from 'fs-extra'
import path from 'path'
import chokidar from 'chokidar'

import * as logger from './log'
import { Options, create, getConfigFile, defaultConfigFilepath, getAvailablePort } from './config'
import { watch } from './watch'
import { initPlugins } from './plugins'
import { createEmitter, createHooks } from './createEmitter'
import { build } from './build'
import { serve } from './serve'
import { Env } from './constants'

export type PrestaCLIOptions = {
  config?: string
  output?: string
  debug?: boolean
} & Partial<Options>

export type PrestaCLIBuildOptions = PrestaCLIOptions & {
  _: string[]
}

export type PrestaCLIServeOptions = PrestaCLIBuildOptions & {
  port?: string
  'no-serve': boolean
}

export type PrestaCLIDevOptions = PrestaCLIServeOptions

export async function buildCommand(options: PrestaCLIBuildOptions) {
  const configFile = getConfigFile(options.config, true)
  const port = await getAvailablePort(options.port || configFile.port || 4000)

  const emitter = createEmitter()
  const hooks = createHooks(emitter)
  const config = create(Env.PRODUCTION, { ...options, port }, configFile)
  await initPlugins(config.plugins, config, hooks)

  fs.emptyDirSync(config.output)

  logger.info({
    label: 'build',
  })

  await build(config, hooks)
}

export async function devCommand(options: PrestaCLIDevOptions) {
  const noServe = options['no-serve']
  let devServer: any
  let port: number
  let restarting = false

  async function startDevServer() {
    let watchTask: any
    let httpServer: ReturnType<typeof serve>
    let staticAssetWatcher: ReturnType<typeof chokidar.watch>

    const userConfigFile = getConfigFile(options.config)

    if (!port || (userConfigFile.port && port !== userConfigFile.port)) {
      port = await getAvailablePort(options.port || userConfigFile.port || 4000)
      process.env.PRESTA_SERVE_URL = `http://localhost:${port}`
    }

    const emitter = createEmitter()
    const hooks = createHooks(emitter)
    const config = create(Env.DEVELOPMENT, { ...options, port }, userConfigFile)
    const plugins = await initPlugins(config.plugins, config, hooks)

    logger.debug({
      label: 'debug',
      message: `config created ${JSON.stringify(config)}`,
    })

    if (!noServe) {
      httpServer = serve(config, hooks)

      staticAssetWatcher = chokidar.watch(config.assets, { ignoreInitial: true }).on('all', () => {
        hooks.emitBrowserRefresh()
      })
    }

    logger.info({
      label: restarting ? 'restart' : 'start',
      message: !noServe ? `http://localhost:${config.port}` : '',
    })

    watchTask = await watch(config, hooks)

    return {
      config,
      async close() {
        emitter.clear()
        await plugins.cleanup()
        await staticAssetWatcher.close()
        await watchTask.close()

        if (httpServer) {
          await httpServer.close()
        }
      },
    }
  }

  const configWatcher = chokidar
    .watch(path.resolve(options.config || defaultConfigFilepath), { ignoreInitial: true })
    .on('all', async () => {
      if (restarting) return

      restarting = true

      try {
        await devServer.close()
      } catch (e) {
        console.error(e)
      }

      console.clear()

      devServer = await startDevServer()

      restarting = false
    })

  devServer = await startDevServer()

  return {
    async close() {
      await configWatcher.close()
      await devServer.close()
    },
  }
}

export async function serveCommand(options: PrestaCLIServeOptions) {
  const configFile = getConfigFile(options.config, true)
  const port = await getAvailablePort(options.port || configFile.port || 4000)

  const emitter = createEmitter()
  const hooks = createHooks(emitter)
  const config = create(Env.PRODUCTION, { ...options, port }, configFile)
  await initPlugins(config.plugins, config, hooks)

  serve(config, hooks)

  logger.info({
    label: 'serve',
    message: `http://localhost:${config.port}`,
  })
}
