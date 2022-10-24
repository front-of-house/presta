import { h } from 'hyposcript'
import { Event } from 'presta'
import { html } from 'presta/html'
import { Box } from 'hypobox'

import { hypostyle, globalStyle } from '@/src/utils/hypostyle'
import { link } from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export function getStaticPaths() {
  return ['/', '/about']
}

export function handler(event: Event) {
  const markup = (
    <Box p={10}>
      <Nav currentPath={event.path} />
      <h1>Static page: {event.path}</h1>
    </Box>
  )
  const css = hypostyle.flush() // then extract styles

  return html({
    head: {
      link,
      style: [{ children: globalStyle }, { children: css }],
    },
    body: markup,
  })
}
