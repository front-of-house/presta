import merge from 'deepmerge'

import { createHeadTags, createFootTags } from './lib/createHeadTags'

const defaults = {
  head: {
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style='color: white'><text x='0' y='14'>◊</text></svg>`
      }
    ]
  }
}

export function document ({
  body,
  head,
  foot,
  htmlAttributes = {},
  bodyAttributes = {}
}) {
  const headTags = createHeadTags(merge(defaults.head, head))
  const footTags = createFootTags(foot)
  const htmlAttr = Object.keys(htmlAttributes).reduce((attr, key) => {
    return (attr += `${key}="${htmlAttributes[key]}"`)
  }, '')
  const bodyAttr = Object.keys(bodyAttributes).reduce((attr, key) => {
    return (attr += `${key}="${bodyAttributes[key]}"`)
  }, '')

  return `<!-- built with presta https://npm.im/presta --><!DOCTYPE html><html ${htmlAttr}><head>${headTags}</head><body ${bodyAttr}>${body}${footTags}</body></html>`
}
