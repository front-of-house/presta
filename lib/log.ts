import c from 'ansi-colors'

import { getCurrentConfig, Env } from './config'

let logs = ''

export function getLogs () {
  if (getCurrentConfig().env !== Env.TEST) {
    throw new Error('Internal method was called outside test mode')
  }
  return logs
}

export function log (message: string) {
  if (getCurrentConfig().env === Env.TEST) {
    logs += message
  } else {
    console.log(message)
  }
}

export function formatLog ({
  action,
  meta,
  description,
  color = 'blue'
}: {
  action: string
  meta: string
  description: string
  color?: string
}) {
  if (getCurrentConfig().env === Env.TEST) return

  const message = `  ${c[color](action)} ${c.gray(meta)}`
  console.log(message.padEnd(40) + description)
}
