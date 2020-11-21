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
