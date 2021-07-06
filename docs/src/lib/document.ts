import { PrestaContext } from 'presta'

const name = 'Presta'
const image = `/og.png`

export function head (context: PrestaContext) {
  return {
    image,
    og: {
      site_name: name,
      image,
      url: `https://presta.run${context.path}`
    },
    twitter: {
      site_name: name,
      image,
      card: 'summary_large_image',
      creator: '@estrattonbailey'
    },
    meta: [{ name: 'author', content: '@estrattonbailey' }],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      `<link href="https://unpkg.com/nord-highlightjs@0.1.0/dist/nord.css" rel="stylesheet" type="text/css" />`,
      `<link rel="preconnect" href="https://fonts.gstatic.com">`,
      `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">`
    ]
  }
}

export function foot () {
  return {}
}
