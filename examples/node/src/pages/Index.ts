import { Event } from 'presta'
import { html } from '@presta/html'

import { Nav } from '@/src/components/Nav'
import { link } from '@/src/utils/head'

export function getStaticPaths() {
  return ['/', '/about']
}

export function handler(event: Event) {
  return {
    html: html({
      head: {
        link,
      },
      body: `
        <div class='p10'>
          ${Nav({ currentPath: event.path })}
          <h1>Static page: ${event.path}</h1>
        </div>
      `,
    }),
  }
}
