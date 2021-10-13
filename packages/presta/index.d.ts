import { getCurrentPrestaInstance } from './lib/currentPrestaInstance'
import { wrapHandler } from './lib/wrapHandler'
import * as log from './lib/log'

export { Plugin, Config, Presta, Event, Context, Response, Route, GetStaticPaths, Handler } from './lib/types'

export { getCurrentPrestaInstance }
export { wrapHandler }
export const logger = log
