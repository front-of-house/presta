import {
  HandlerEvent as LambdaHandlerEvent,
  HandlerContext as LambdaHandlerContext,
  HandlerResponse as LambdaHandlerResponse,
} from '@netlify/functions'
import { ParsedQuery } from 'query-string'

import * as log from './log'
import { createEmitter } from './createEmitter'
import { wrapHandler } from './wrapHandler'
import { getCurrentPrestaInstance } from './currentPrestaInstance'

export type AWS = {
  HandlerEvent: LambdaHandlerEvent
  HandlerContext: LambdaHandlerContext
  HandlerResponse: LambdaHandlerResponse
  Handler: (event: LambdaHandlerEvent, context: Partial<LambdaHandlerContext>) => Promise<LambdaHandlerResponse>
}

export type Callable = (...args: any[]) => void

export type ContextGetter = typeof getCurrentPrestaInstance

export type PluginInterface = any
export type PluginInit = (context: ContextGetter) => PluginInterface
export type Plugin = (props: Record<string, unknown>) => PluginInit

export type Config = {
  files?: string | string[]
  output?: string
  assets?: string
  plugins?: PluginInit[]
  port?: number
}

export type CLI = {
  config?: string
  debug?: boolean
  port?: string
} & Config

export type FunctionsManifest = {
  [route: string]: string
}

export type HookPostBuild = {
  output: Presta['output']
  staticOutput: Presta['staticOutputDir']
  functionsOutput: Presta['functionsOutputDir']
  functionsManifest: FunctionsManifest
}
export type HookBuildFile = {
  file: string
}

export type DestroyHookCallback = () => void
export type Hooks = {
  emitPostBuild(props: HookPostBuild): void
  onPostBuild(cb: (props: HookPostBuild) => void): DestroyHookCallback
  emitBuildFile(props: HookBuildFile): void
  onBuildFile(cb: (props: HookBuildFile) => void): DestroyHookCallback
  emitBrowserRefresh(): void
  onBrowserRefresh(cb: () => void): DestroyHookCallback
}

export type Presta = {
  pid: number
  cwd: string
  env: string
  port: number
  debug: boolean
  configFilepath: string
  staticOutputDir: string
  functionsOutputDir: string
  functionsManifest: string
  events: ReturnType<typeof createEmitter>
  hooks: Hooks
} & Required<Config>

export type RouteParams = ParsedQuery<string | boolean | number>
export type Event = LambdaHandlerEvent & { params: RouteParams }
export type Context = LambdaHandlerContext
export type Response = Partial<LambdaHandlerResponse> & {
  html?: string
  json?: object
  xml?: string
}

export type Route = string
export type GetStaticPaths = () => Promise<string[]>
export type Handler = (event: Event, context: Context) => Promise<Response>

export type StaticLambda = {
  getStaticPaths: GetStaticPaths
  handler: Handler
}

export type Lambda = {
  route: Route
  handler: Handler
}

export type PrestaError = Error & {
  status?: number
  statusCode?: number
  source?: string
  title?: string
  details?: string
}

export { getCurrentPrestaInstance }
export { wrapHandler }
export const logger = log
