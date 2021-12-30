import { h } from 'hyposcript'
import { Handler, Event } from 'presta'
import { html } from '@presta/html'

import { hypostyle, Box } from '@/util/hypostyle'

export const route = '*'

export function getStaticPaths() {
  return ['/', '/about']
}

function App({ event }: { event: Event }) {
  return (
    <>
      <Box p={8} f aic fs={4} ff="sans" fw={6}>
        <Box as="a" href="/" mr={4}>
          Home
        </Box>
        <Box as="a" href="/about" mr={4}>
          About
        </Box>
      </Box>

      <Box px={8} ff="sans">
        <Box as="h1">Page: {event.path}</Box>
      </Box>
    </>
  )
}

export const handler: Handler = async (ev) => {
  hypostyle.injectGlobal({
    'html, body': {
      p: 0,
      m: 0,
    },
    a: {
      c: 'blue',
      '&:visited': {
        c: 'blue',
      },
    },
  })

  const markup = <App event={ev} /> // render first
  const css = hypostyle.flush() // then extract styles

  return html({
    head: {
      style: [{ children: css }],
    },
    body: markup,
  })
}
