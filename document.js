import { headCache } from './head'
import { createHeadTags, createFootTags } from './lib/createHeadTags'

export function document ({ body, head = {}, foot = {} }) {
  const headTags = createHeadTags({
    ...headCache, ...head
  })
  const footTags = createFootTags(foot)

  return `<!DOCTYPE html>
<html>
  <head><!-- built with presta -->${headTags}</head>
  <body>${body}${footTags}</body>
</html>`
}

