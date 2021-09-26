import path from 'path'
import { source } from '@presta/source-filesystem'
import { html } from '@presta/html'
import { micromark } from 'micromark'

const files = source('./content/**/*.md', __filename)
const basedir = path.join(path.dirname(__filename), 'content')
const routes = files.reduce((r, file) => {
  const dir = path.dirname(file[0]).replace(basedir, '')
  const filename = path.basename(file[0], '.md')

  return {
    ...r,
    [[dir, filename].join('/')]: file[1],
  }
}, {})

export const route = '*'

export async function handler({ path }) {
  const raw = path === '/' ? routes['/home'] : routes[path]
  return {
    html: html({
      head: {
        title: 'Markdown Example | Presta',
        link: [{ rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' }],
      },
      body: `
        <div class='p12'>
          <div class='f mb8'>
            ${Object.keys(routes)
              .map((url) =>
                url === '/home'
                  ? `
              <a href="/" class='mr4'>/home</a>
            `
                  : `
              <a href="${url}" class='mr4'>${url}</a>
            `
              )
              .join('')}
          </div>

          ${micromark(raw)}
        </div>
      `,
    }),
  }
}
