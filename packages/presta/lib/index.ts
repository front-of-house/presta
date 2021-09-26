/*
 * Any used exports of the core library go here
 */
import { Env as EnvEnum } from './types'

export const Env = {
  PRODUCTION: EnvEnum.PRODUCTION,
  DEVELOPMENT: EnvEnum.DEVELOPMENT,
}
export { wrapHandler } from './wrapHandler'
export { getCurrentPrestaInstance } from './currentPrestaInstance'
