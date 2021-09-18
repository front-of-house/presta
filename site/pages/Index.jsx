import { h } from 'hyposcript'
import { html } from '@presta/html'

export function getStaticPaths() {
  return ['/']
}

export function handler(event) {
  return html({
    head: {
      title: 'Presta | Minimalist Web Framework',
      description: `Minimalist web framework for SSG, SSR, API functions and more.`,
      image: '/og.png',
      meta: [{ name: 'twitter:card', content: 'summary_large_image' }],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' },
        // `<link rel="preconnect" href="https://fonts.googleapis.com">`,
        // `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
        // `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;800&display=swap" rel="stylesheet">`,
        { rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' },
        { rel: 'stylesheet', href: '/style.css' },
      ],
    },
    body: (
      <main className="p12 light" style={{ height: '100vh', background: 'var(--dark)' }}>
        <pre>{`<span class='neon'>❯</span> npx presta --help

  Usage
    <span class='neon'>❯</span> presta &lt;command&gt; [options]

  Available Commands
    build    Build project to output directory.
    dev      Watch project and build to output directory.
    serve    Serve built files, lambdas, and static assets.

  For more info, run any command with the \`--help\` flag
    <span class='neon'>❯</span> presta build --help
    <span class='neon'>❯</span> presta dev --help

  Options
    -c, --config     Path to a config file.  (default presta.config.js)
    -o, --output     Specify output directory for built files.  (default ./build)
    -a, --assets     Specify static asset directory.  (default ./public)
    -d, --debug      Enable debug mode (prints more logs)
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    <span class='neon'>❯</span> presta dev index.jsx -o dist
    <span class='neon'>❯</span> presta dev 'pages/*.tsx' -o static
    <span class='neon'>❯</span> presta 'pages/*.tsx'
    <span class='neon'>❯</span> presta -c site.json
    <span class='neon'>❯</span> presta serve -p 8080
        `}</pre>
      </main>
    ),
  })
}
