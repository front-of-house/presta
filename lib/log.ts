import c from 'ansi-colors'

const { NODE_ENV } = process.env

let logs = ''

export function getLogs () {
  if (NODE_ENV !== 'test') {
    throw new Error('Internal method was called outside test mode')
  }
  return logs
}

export function log (message: string) {
  if (NODE_ENV === 'test') {
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
  if (NODE_ENV === 'test') {
  } else {
    const message = `  ${c[color](action)} ${c.gray(meta)}`
    console.log(message.padEnd(40) + description)
  }
}
