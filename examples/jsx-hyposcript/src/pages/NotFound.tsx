import { h } from 'hyposcript'
import { Event } from 'presta'
import { html } from 'presta/serialize'
import { html as document } from 'presta/html'
import { Box } from 'hypobox'

import { hypostyle, globalStyle } from '@/src/utils/hypostyle'
import { link } from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export const route = '*'

export function handler(event: Event) {
  const markup = (
    <Box p={10}>
      <Nav currentPath={event.path} />
      <h1>404 Not Found: {event.path}</h1>
    </Box>
  )
  const css = hypostyle.flush() // then extract styles

  return html({
    statusCode: 404,
    body: document({
      head: {
        link,
        style: [{ children: globalStyle }, { children: css }],
      },
      body: markup,
    }),
  })
}
