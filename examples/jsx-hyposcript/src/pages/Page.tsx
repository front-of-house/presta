import { h } from 'hyposcript'
import { Event } from 'presta'
import { html } from '@presta/html'
import { Box } from 'hypobox'

import { hypostyle, globalStyle } from '@/src/utils/hypostyle'
import { link } from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export const route = '/:slug?'

export function handler(event: Event) {
  const markup = (
    <Box p={10}>
      <Nav currentPath={event.path} />
      <h1>Dynamic page: {event.path}</h1>
    </Box>
  )
  const css = hypostyle.flush() // then extract styles

  return {
    multiValueHeaders: {
      'set-cookie': ['presta_example=1', 'presta_example_2=1'],
    },
    html: html({
      head: {
        link,
        style: [{ children: globalStyle }, { children: css }],
      },
      body: markup,
    }),
  }
}
