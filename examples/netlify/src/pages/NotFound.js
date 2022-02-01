import { html } from '@presta/html'

import { Nav } from '@/src/components/Nav'
import { link } from '@/src/utils/head'

export const route = '*'

export function handler(event) {
  return {
    statusCode: 404,
    html: html({
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
  }
}
