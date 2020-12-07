import { theme as defaultTheme, configure, getCss } from 'hypobox'
import { document } from 'presta/document'
import { merge } from 'presta/utils/merge'

import { theme } from '@/src/lib/theme'

configure({ theme })

const name = `sure thing`
const image = `/og.png`

export const pages = 'src/pages/**/*.js'

export function createContent (ctx) {
  return document({
    head: merge(ctx.head, {
      image,
      og: {
        site_name: name,
        image,
        url: `https://sure-thing.net${ctx.pathname}`
      },
      twitter: {
        site_name: name,
        image,
        card: 'summary_large_image',
        creator: '@estrattonbailey'
      },
      meta: [{ name: 'author', content: '@estrattonbailey' }],
      link: [
        { rel: 'icon', type: 'image/png', href: '/presta-favicon.png' },
        { rel: 'stylesheet', href: '/style.css' }
      ],
      style: [{ id: 'style', children: getCss() }]
    }),
    body: `<div id="bg"></div><div id="root">${ctx.content}</div>`,
    foot: {
      script: [{ src: '/client.js' }]
    }
  })
}

export function onRequest (event) {
  if (event.path === '/docs') {
    return {
      statusCode: 302,
      headers: {
        Location: '/docs/overview'
      }
    }
  }
}
