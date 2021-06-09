import c from 'ansi-colors'

const { NODE_ENV } = process.env

let logs = ''

export const getLogs = () => {
  if (NODE_ENV !== 'test') {
    throw new Error('Internal method was called outside test mode')
  }
  return logs
}

export const log = (str: string) => {
  if (NODE_ENV === 'test') {
    logs += str
  } else {
    console.log(str)
  }
}

export const formatLog = ({ action, meta, description, color = 'blue' }: {
  action: string;
  meta: string;
  description: string;
  color?: string;
}) => {
  if (NODE_ENV === 'test') {
  } else {
    const message = `  ${c[color](action)} ${c.gray(meta)}`
    console.log(message.padEnd(40) + description)
  }
}
