import c, { Kleur } from 'kleur'

import { getCurrentConfig, Env } from './config'

export enum Levels {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Err = 'error'
}

export type Message = {
  level?: Levels
  label: string | number
  message?: string
  duration?: string | number
  error?: Error
}

let logs: any[] = []

const colors = {
  [Levels.Debug]: 'magenta',
  [Levels.Info]: 'blue',
  [Levels.Warn]: 'yellow',
  [Levels.Err]: 'red'
}

export { c as colors }

export function getLogs () {
  if (getCurrentConfig().env !== Env.TEST) {
    throw new Error('Internal method was called outside test mode')
  }

  return logs
}

export function logger (message: Message) {
  if (getCurrentConfig().env === Env.TEST) {
    logs.push(message)
  } else {
    const debug = getCurrentConfig().debug
    const context = getCurrentConfig().env === Env.PRODUCTION ? 'prod' : 'dev'

    if (!debug && message.level === Levels.Debug) return

    console.log(
      [
        c.gray(context),
        c[colors[message.level || 'info'] as keyof Kleur](message.label),
        message.message,
        message.duration ? c.gray('+' + message.duration) : '',
        message.error ? `\n\n${message.error.stack || message.error}\n\n` : ''
      ]
        .filter(Boolean)
        .join(' ')
    )
  }
}

export function debug (message: Message) {
  logger({ level: Levels.Debug, ...message })
}

export function info (message: Message) {
  logger({ level: Levels.Info, ...message })
}

export function warn (message: Message) {
  logger({ level: Levels.Warn, ...message })
}

export function error (message: Message) {
  logger({ level: Levels.Err, ...message })
}

export function raw (...args: any[]) {
  if (getCurrentConfig().env === Env.TEST) {
    logs.push(args)
  } else {
    console.log(...args)
  }
}

export function newline () {
  if (getCurrentConfig().env === Env.TEST) return
  console.log('')
}
