import c from 'ansi-colors'

const { NODE_ENV } = process.env

let logs = ''

export function getLogs () {
  if (!NODE_ENV === 'test') {
    throw new Error('Internal method was called outside test mode')
  }
  return logs
}

export function log (str) {
  if (NODE_ENV === 'test') {
    logs += str
  } else {
    console.log(str)
  }
}

export function formatLog ({ action, meta, description, color = 'blue' }) {
  if (NODE_ENV === 'test') {
    logs += str
  } else {
    const message = `  ${c[color](action)} ${c.gray(meta)}`
    console.log(message.padEnd(40) + description)
  }
}
