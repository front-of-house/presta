import { Event } from 'presta'
import { html } from 'presta/serialize'
import { html as document } from '@presta/html'

import { Nav } from '@/src/components/Nav'
import { link } from '@/src/utils/head'

export const route = '/:slug?'

export function handler(event: Event) {
  return html({
    multiValueHeaders: {
      'set-cookie': ['presta_example=1', 'presta_example_2=1'],
    },
    body: document({
      head: {
        link,
      },
      body: `
        <div class='p10'>
          ${Nav({ currentPath: event.path })}
          <h1>Dynamic page: ${event.path}</h1>
        </div>
      `,
    }),
  })
}
