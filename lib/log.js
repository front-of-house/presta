const { NODE_ENV } = process.env

export function log (str) {
  if (NODE_ENV === 'test') return
  console.log(str)
}
