import { litebook } from 'litebook'
import { theme } from '@/src/lib/theme'
import { head } from '@/src/lib/document'

const defaults = head({
  path: '/docs'
})

const docs = litebook('../content', '**/*.md', {
  version: 'v0.31.13',
  theme,
  document: {
    head: {
      image: defaults.image,
      og: defaults.og,
      twitter: defaults.twitter,
      meta: defaults.meta,
      link: defaults.link
    }
  }
})(__filename)

export const getStaticPaths = docs.getStaticPaths
export const handler = docs.handler
