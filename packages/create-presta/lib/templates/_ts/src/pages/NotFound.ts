import type { Event } from 'presta'
import { html } from '@presta/html'

import * as head from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export const route = '*'

export function handler(event: Event) {
  return {
    statusCode: 404,
    html: html({
      head,
      body: `
        <div class='p10'>
          ${Nav({ currentPath: event.path })}
          <h1>404 Not Found: ${event.path}</h1>
        </div>
      `,
    }),
  }
}
