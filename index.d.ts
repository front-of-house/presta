import type {
  HandlerEvent as LambdaHandlerEvent,
  HandlerContext as LambdaHandlerContext,
  HandlerResponse as LambdaHandlerResponse,
} from '@netlify/functions'

import { createEmitter } from './lib/createEmitter'
import { Env } from './lib/config'

export type lambda = {
  HandlerEvent: LambdaHandlerEvent
  HandlerContext: LambdaHandlerContext
  HandlerResponse: LambdaHandlerResponse
}

export type PrestaConfig = {
  files?: string | string[]
  output?: string
  assets?: string
}

export type CLIArgs = {
  files?: string | string[]
  output?: string
  assets?: string
  config?: string
}

export type Presta = {
  pid: number
  cwd: string
  env: Env
  cliArgs: CLIArgs
  configFile: PrestaConfig
  merged: PrestaConfig
  configFilepath: string
  dynamicEntryFilepath: string
  staticOutputDir: string
  emitter: ReturnType<typeof createEmitter>
}

export type RouteParams = { [param: string]: string }
export type HandlerEvent = LambdaHandlerEvent & { params: RouteParams }
export type HandlerContext = LambdaHandlerContext
export type HandlerResponse = LambdaHandlerResponse & {
  html?: string
  json?: object
  xml?: string
}

export type Route = string
export type GetStaticPaths = () => Promise<string[]>
export type Handler = (event: HandlerEvent, context: HandlerContext) => Promise<HandlerResponse>

export type PrestaStaticFile = {
  getStaticPaths: GetStaticPaths
  handler: Handler
}

export type PrestaDynamicFile = {
  route: Route
  handler: Handler
}
