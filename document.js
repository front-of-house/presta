import merge from 'deepmerge'

import { createHeadTags, createFootTags } from './lib/createHeadTags'

export function document (some, ...rest) {
  const { body, head = {}, foot = {} } = merge.all([some].concat(rest))

  const headTags = createHeadTags(head)
  const footTags = createFootTags(foot)

  return `<!DOCTYPE html><html><head><!-- built with presta https://npm.im/presta -->${headTags}</head><body>${body}${footTags}</body></html>`
}
