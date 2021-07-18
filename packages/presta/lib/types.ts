import {
  HandlerEvent as LambdaHandlerEvent,
  HandlerContext as LambdaHandlerContext,
  HandlerResponse as LambdaHandlerResponse,
} from '@netlify/functions'

import { createEmitter } from './createEmitter'
import { wrapHandler } from './wrapHandler'
import { getCurrentPrestaInstance } from './currentPrestaInstance'

export enum Env {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export type AWS = {
  HandlerEvent: LambdaHandlerEvent
  HandlerContext: LambdaHandlerContext
  HandlerResponse: LambdaHandlerResponse
  Handler: (event: LambdaHandlerEvent, context: Partial<LambdaHandlerContext>) => Promise<LambdaHandlerResponse>
}

export type PluginInterface = any
export type Plugin = () => PluginInterface

export type Config = {
  files?: string | string[]
  output?: string
  assets?: string
  plugins?: Plugin[]
}

export type CLI = {
  config?: string
  debug?: boolean
} & Config

export type FunctionsManifest = {
  [route: string]: string
}

export type Hook<T> = (props: T) => void
export type PostbuildHook = Hook<{
  output: Presta['output']
  staticOutput: Presta['staticOutputDir']
  functionsOutput: Presta['functionsOutputDir']
  functionsManifest: FunctionsManifest
}>
export type Hooks = {
  postbuild(hook: PostbuildHook): () => void
}

export type Presta = {
  pid: number
  cwd: string
  env: Env
  debug: boolean
  configFilepath: string
  functionsOutputDir: string
  staticOutputDir: string
  routesManifest: string
  events: ReturnType<typeof createEmitter>
  hooks: Hooks
} & Required<Config>

export type RouteParams = { [param: string]: string }
export type Event = LambdaHandlerEvent & { params: RouteParams }
export type Context = LambdaHandlerContext
export type Response = LambdaHandlerResponse & {
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

export { getCurrentPrestaInstance }
export { wrapHandler }
