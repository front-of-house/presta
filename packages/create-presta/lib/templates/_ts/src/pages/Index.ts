import type { Handler } from 'presta'
import { html } from 'presta/html'

import * as head from '@/src/utils/head'
import { Nav } from '@/src/components/Nav'

export const getStaticPaths = () => {
  return ['/', '/about']
}

export const handler: Handler = (event) => {
  return html({
    head,
    body: `
      <div class='p10'>
        ${Nav({ currentPath: event.path })}
        <h1>Static page: ${event.path}</h1>
      </div>
    `,
  })
}
