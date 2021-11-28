import http from 'http'
import { parse as parseUrl } from 'url'
import { parse as parseQuery } from 'query-string'
import rawBody from 'raw-body'
import mime from 'mime-types'
import { AWS } from './types'

// @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L167
const BASE_64_MIME_REGEXP = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function shouldBase64Encode(contentType: string) {
  return Boolean(contentType) && BASE_64_MIME_REGEXP.test(contentType)
}

export async function requestToEvent(req: http.IncomingMessage): Promise<AWS['HandlerEvent']> {
  // @see https://github.com/netlify/cli/blob/27bb7b9b30d465abe86f87f4274dd7a71b1b003b/src/utils/serve-functions.js#L208
  const remoteAddress = String(req.headers['x-forwarded-for']) || req.connection.remoteAddress || ''
  const ip = remoteAddress
    .split(remoteAddress.includes('.') ? ':' : ',')
    .pop()
    ?.trim()
  const isBase64Encoded = shouldBase64Encode(req.headers['content-type'] || '')
  const body = req.headers['content-length']
    ? await rawBody(req, {
        limit: '1mb',
        encoding: mime.charset(req.headers['content-type'] || '') || undefined,
      })
    : undefined

  // TODO lowercase headers

  return {
    path: req.url as string,
    httpMethod: req.method as string,
    // @ts-ignore TODO test set-cookie coming in as array
    headers: {
      ...req.headers,
      'client-ip': ip,
    },
    // TODO should these headers be exclusively single value vs multi?
    multiValueHeaders: Object.keys(req.headers).reduce((headers, key) => {
      if (req.headers[key] && !(req.headers[key] as string).includes(',')) return headers // only include multi-value headers here

      return {
        ...headers,
        // @ts-ignore TODO again, array headers
        [key]: req.headers[key].split(','),
      }
    }, {}),
    // @ts-ignore TODO do I need to keep these separate?
    queryStringParameters: parseQuery(parseUrl(req.url).query),
    body: body ? new Buffer(body).toString(isBase64Encoded ? 'base64' : 'utf8') : null,
    isBase64Encoded,
  }
}
