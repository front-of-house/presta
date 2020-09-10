const { NODE_ENV } = process.env

function log (str) {
  if (NODE_ENV === 'test') return
  console.log(str)
}

module.exports = { log }
