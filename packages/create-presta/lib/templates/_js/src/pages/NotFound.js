import { html } from 'presta/serialize'
import { html as document } from 'presta/html'

import * as head from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export const route = '*'

export const handler = (event) => {
  return html({
    statusCode: 404,
    body: document({
      head,
      body: `
        <div class='p10'>
          ${Nav({ currentPath: event.path })}
          <h1>404 Not Found: ${event.path}</h1>
        </div>
      `,
    }),
  })
}
