import {
  Params,
  MultiValueParams,
  Event as LambdaEvent,
  Context as LambdaContext,
  Response as LambdaResponse,
} from 'lambda-types'

export type Headers = Params
export type MultiValueHeaders = MultiValueParams
export type QueryStringParameters = Params
export type MultiValueQueryStringParameters = MultiValueParams
export type PathParameters = Params

export type Event = Omit<LambdaEvent, 'requestContext' | 'resource'>
export type Context = LambdaContext
export type Response = Omit<LambdaResponse, 'statusCode'> & {
  statusCode?: number
  html?: string
  json?: object
  xml?: string
}

export type Handler = (event: Event, context: Context) => Promise<Response>
