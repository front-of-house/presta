import { Event } from 'presta'
import { html } from '@presta/html'

import { Nav } from '../components/Nav'
import { link } from '../utils/documentProperties'

export const route = '*'

export function handler(event: Event) {
  return html({
    head: {
      link,
    },
    body: `
      <div class='p10'>
        ${Nav({ currentPath: event.path })}
        <h1>Page ${event.path}</h1>
      </div>
    `,
  })
}
