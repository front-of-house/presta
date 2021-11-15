import { Event } from 'presta'
import { html } from '@presta/html'

import { Nav } from '../components/Nav'
import { link } from '../utils/documentProperties'

export function getStaticPaths() {
  return ['/contact']
}

export function handler(event: Event) {
  return html({
    head: {
      link,
    },
    body: `
      <div class='p10'>
        ${Nav({ currentPath: event.path })}
        <h1>Contact</h1>
      </div>
    `,
  })
}
