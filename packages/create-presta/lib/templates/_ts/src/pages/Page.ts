import type { Event } from 'presta'
import { html } from '@presta/html'

import * as head from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export const route = '/:slug'

export function handler(event: Event) {
  return html({
    head,
    body: `
      <div class='p10'>
        ${Nav({ currentPath: event.path })}
        <h1>Dynamic page: ${event.path}</h1>
      </div>
    `,
  })
}
