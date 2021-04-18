const { document: doc } = require('./document')

function html ({
  statusCode = 200,
  headers = {},
  multiValueHeaders = {},
  body = '',
  document = {},
  ...props
}) {
  const content = body ? body : document ? doc(document) : ''

  return {
    isBase64Encoded: false,
    statusCode,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...headers
    },
    multiValueHeaders,
    body: content,
    ...props
  }
}

module.exports = {
  html
}
