import merge from 'deepmerge'

import { createHeadTags, createFootTags } from './lib/createHeadTags'

const defaults = {
  head: {
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' }
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/static/favicon.png' }]
  }
}

export function document (some, ...rest) {
  const { body, head = {}, foot = {} } = merge.all(
    [defaults, some].concat(rest)
  )

  const headTags = createHeadTags(head)
  const footTags = createFootTags(foot)

  return `<!-- built with presta https://npm.im/presta --><!DOCTYPE html><html><head>${headTags}</head><body>${body}${footTags}</body></html>`
}
