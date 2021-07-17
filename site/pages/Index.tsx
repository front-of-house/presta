// import { Event } from 'presta'
// import { html } from '@presta/html'
// import { h } from 'hyposcript'
// import cx from 'nanoclass'

export const route = '*'

// function Grid ({ bars = 6, color }: { bars?: number, color: string }) {
//   return (
//     <div class='grid rel' style={{ color }}>
//       {Array(bars).fill('').map((_, i) => (
//         <div class='vertical abs top left' style={{
//           left: `${(i + 1) * (100 / bars)}%`
//         }} />
//       ))}
//       {Array(bars).fill('').map((_, i) => (
//         <div class='horizontal abs top left' style={{
//           top: `${(i + 1) * (100 / bars)}%`
//         }} />
//       ))}
//     </div>
//   )
// }

// function Button ({ children, className, ...props }: any) {
//   return (
//     <button class={cx(['button', className])}>
//       {children}
//     </button>
//   )
// }

export function handler(event: Event) {
  return {
    statusCode: 302,
    headers: {
      Location: 'https://github.com/sure-thing/presta',
    },
  }

  // return html({
  //   head: {
  //     title: 'Presta',
  //     link: [
  //       `<link rel="preconnect" href="https://fonts.googleapis.com">`,
  //       `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
  //       `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;800&display=swap" rel="stylesheet">`,
  //       { rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@4.1.1/dist/svbstrate.css' },
  //       { rel: 'stylesheet', href: '/style.css' },
  //     ]
  //   },
  //   body: (
  //     <main style={{ height: '100vh' }}>
  //       <div style={{ maxWidth: '740px' }}>
  //         <h1 class='h4 rel z1 mb1' style={{ color: 'var(--blue)' }}>Presta</h1>
  //         <h2 class='h1 rel z1'>
  //           The minimalist web framework for SSR, SSG, APIs and more.
  //         </h2>

  //         <Button>Github</Button>
  //       </div>
  //     </main>
  //   )
  // })
}
