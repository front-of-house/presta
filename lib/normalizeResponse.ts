export const stringify = (obj: any) => {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj
}

export const normalizeResponse = (response: any) => {
  const {
    isBase64Encoded = false,
    statusCode = 200,
    headers = {},
    multiValueHeaders = {},
    body,
    html = {},
    json = {},
    xml = {}
  } =
    typeof response === 'object'
      ? response
      : {
          body: response
        }

  let contentType = 'text/html; charset=utf-8'

  if (!!json) {
    contentType = 'application/json; charset=utf-8'
  } else if (!!xml) {
    contentType = 'application/xml; charset=utf-8'
  }

  return {
    isBase64Encoded,
    statusCode,
    headers: {
      'Content-Type': contentType,
      ...headers
    },
    multiValueHeaders,
    body: stringify(body || html || json || xml || '')
  }
}
