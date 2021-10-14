import { html } from '@presta/html'

export const route = '*'

export function getStaticPaths() {
  return ['/', '/about']
}

export async function handler({ path }) {
  return {
    html: html({
      head: {
        title: 'Basic Example | Presta',
        link: [{ rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' }],
      },
      body: `
        <div class='p12'>
          <div class='f mb8'>
            <a href="/" class='mr4'>/home</a>
            <a href="/about" class='mr4'>/about</a>
            <a href="/other-page" class='mr4'>/other-page</a>
          </div>

          <div class='mb8'>
            You're viewing: ${path}
          </div>

          <img src='/earth.gif' />
        </div>
      `,
    }),
  }
}
