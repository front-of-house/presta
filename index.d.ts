import type {
  HandlerEvent as LambdaHandlerEvent,
  HandlerContext as LambdaHandlerContext,
  HandlerResponse as LambdaHandlerResponse,
} from '@netlify/functions'

import { createEmitter } from './lib/createEmitter'
import { Env } from './lib/config'

export type AWS = {
  HandlerEvent: LambdaHandlerEvent
  HandlerContext: LambdaHandlerContext
  HandlerResponse: LambdaHandlerResponse
}

export type Config = {
  files?: string | string[]
  output?: string
  assets?: string
}

export type CLI = {
  config?: string
} & Config

export type Presta = {
  pid: number
  cwd: string
  env: Env
  configFilepath: string
  functionsOutputDir: string
  staticOutputDir: string
  routesManifest: string
  events: ReturnType<typeof createEmitter>
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

declare global {
  namespace NodeJS {
    interface Global {
      __presta__: Presta
    }
  }
}
