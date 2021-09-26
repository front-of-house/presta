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
export type PluginInit = (context: typeof getCurrentPrestaInstance) => PluginInterface
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

export type Actions = {
  build(file: string): void
}

export type Presta = {
  pid: number
  cwd: string
  env: Env
  port: number
  debug: boolean
  configFilepath: string
  staticOutputDir: string
  functionsOutputDir: string
  functionsManifest: string
  events: ReturnType<typeof createEmitter>
  hooks: Hooks
  actions: Actions
} & Required<Config>

export type RouteParams = { [param: string]: string }
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
