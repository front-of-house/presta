const name = 'Presta'
const image = `/og.png`

export function head (context) {
  return {
    image,
    og: {
      site_name: name,
      image,
      url: `https://sure-thing.net${context.path}`
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
      { rel: 'stylesheet', href: '/style.css' }
    ]
  }
}

export function foot () {
  return {
    script: [{ src: '/client.js' }]
  }
}
