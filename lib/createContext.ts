import merge from 'deepmerge'
import { HandlerEvent, HandlerContext } from '@netlify/functions'

export type PrestaContext = {
  path: string
  method?: string
  body?: string
  headers?: {
    [header: string]: string | string[]
  }
  params?: { [param: string]: string }
  query?: {
    [param: string]: string | string[]
  }
  lambda?: {
    event: HandlerEvent
    context: HandlerContext
  }
}

export function createContext (context: PrestaContext): PrestaContext {
  return merge(
    {
      path: '',
      headers: {},
      params: {},
      query: {},
      lambda: {
        event: {},
        context: {}
      }
    },
    context
  )
}
