/*
 * Any used exports of the core library need to be in this file
 */

import * as log from './log'
export const logger = log

export { Env } from './constants'
export * from './lambda'
export { Config, Options } from './config'
export { createPlugin } from './plugins'

/*
 * for use in prod functions
 */
export { wrapHandler } from './wrapHandler'
