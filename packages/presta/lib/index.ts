/**
 * This is main export of the Presta library. It's used by most end-users
 * within their applications, so we need to keep it as small as possible. It
 * should mostly-re-export types and utils for end-user use.
 */
import type { PrestaConfig, Handler, Plugin } from './core'

export type Config = PrestaConfig

export type {
  Event,
  Context,
  Handler,
  Response,
  Headers,
  Plugin,
  PluginContext,
  PluginInterface,
  Manifest,
} from './core'

export enum Mode {
  Dev = 'dev',
  Build = 'build',
  Serve = 'serve',
}

export class HttpError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)

    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

export const createConfig = (conf: Partial<Config>) => conf
export const createPlugin = <T>(fn: (options: T) => Plugin) => fn
export const createRoute = (route: string) => route
export const createGetStaticPaths = (getStaticPaths: () => string[]) => getStaticPaths
export const createHandler = (handler: Handler) => handler
