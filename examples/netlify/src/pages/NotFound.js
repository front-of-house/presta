import { html } from 'presta/serialize'
import { html as document } from '@presta/html'

import { Nav } from '@/src/components/Nav'
import { link } from '@/src/utils/head'

export const route = '*'

export function handler(event) {
  return html({
    statusCode: 404,
    body: document({
      head: {
        link,
      },
      body: `
        <div class='p10'>
          ${Nav({ currentPath: event.path })}
          <h1>404 Not Found: ${event.path}</h1>
        </div>
      `,
    }),
  })
}
