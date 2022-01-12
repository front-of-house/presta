/*
 * Any used exports of the core library need to be in this file
 */

import * as log from './log'
export const logger = log

export { Env } from './constants'
export * from './lambda'
export { Config, Options } from './config'
export { HookPostBuildPayload, HookBuildFilePayload } from './createEmitter'
export { createPlugin, PluginInit, Plugin, PluginInterface } from './plugins'
export { getRouteParams as parsePathParameters } from './getRouteParams'
export { requestToEvent } from './requestToEvent'

/*
 * for use in prod functions
 */
export { wrapHandler } from './wrapHandler'
