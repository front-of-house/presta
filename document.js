import merge from 'deepmerge'
import { headCache } from './head'
import { createHeadTags, createFootTags } from './lib/createHeadTags'

export function document ({ body, head = {}, foot = {} }) {
  const headTags = createHeadTags(merge(head, headCache))
  const footTags = createFootTags(foot)
  return `<!DOCTYPE html><html><head><!-- built with presta https://npm.im/presta -->${headTags}</head><body>${body}${footTags}</body></html>`
}
