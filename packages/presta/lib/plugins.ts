import * as logger from './log'
import { Hooks } from './createEmitter'
import { Config } from './config'

export type PluginInterface = {
  cleanup?(): void
}
export type Plugin = (config: Config, hooks: Hooks) => Promise<PluginInterface | void> | PluginInterface | void
export type PluginInit = (...props: any) => Plugin

export function createPlugin(init: PluginInit) {
  return init
}

export async function initPlugins(plugins: Plugin[], instance: Config, hooks: Hooks) {
  const instantiated = await Promise.all(
    plugins
      .map((p) => {
        try {
          return p(instance, hooks)
        } catch (e) {
          logger.error({
            label: 'error',
            error: e as Error,
          })
        }
      })
      .filter(Boolean) as PluginInterface[]
  )

  return {
    async cleanup() {
      return Promise.all(instantiated.map((p) => p && p.cleanup && p.cleanup()))
    },
  }
}
