import { createHeadTags, createFootTags } from './lib/createHeadTags'

export function document ({
  body,
  head,
  foot,
  htmlAttributes = {},
  bodyAttributes = {}
}) {
  if (!head.link.find(m => m.rel === 'icon')) {
    head.link.push({
      rel: 'icon',
      type: 'image/svg+xml',
      href: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' style='color: white'><text x='0' y='14'>◊</text></svg>`
    })
  }
  if (!head.meta.find(m => !!m.charset)) {
    head.meta.push({ charset: 'UTF-8' })
  }
  if (!head.meta.find(m => m.name === 'viewport')) {
    head.meta.push({
      name: 'viewport',
      content: 'width=device-width,initial-scale=1'
    })
  }

  const headTags = createHeadTags(head)
  const footTags = createFootTags(foot)
  const htmlAttr = Object.keys(htmlAttributes).reduce((attr, key) => {
    return (attr += `${key}="${htmlAttributes[key]}"`)
  }, '')
  const bodyAttr = Object.keys(bodyAttributes).reduce((attr, key) => {
    return (attr += `${key}="${bodyAttributes[key]}"`)
  }, '')

  return `<!-- built with presta https://npm.im/presta --><!DOCTYPE html><html ${htmlAttr}><head>${headTags}</head><body ${bodyAttr}>${body}${footTags}</body></html>`
}
