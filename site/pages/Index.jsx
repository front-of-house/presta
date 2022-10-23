import { h } from 'hyposcript'
import { html } from 'presta/html'

const help = (
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
    <span class='neon'>❯</span> presta serve -p 8080`}</pre>
)

const e1 = `<span class='gray'>// index.js</span>
export const route = '/:slug?'`

const e2 = `<span class='gray'>// index.js</span>
export async function getStaticPaths() {
  return [ '/', '/about' ]
}`

const e3 = `<span class='gray'>// index.js</span>
export const route = '/:slug?'

export async function getStaticPaths() {
  return [ '/', '/about' ]
}`

const e4 = `<span class='gray'>// index.js</span>
export const route = '/:slug?'

export async function getStaticPaths() {
  return [ '/', '/about' ]
}

export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: '&lt;h1>Hello world!&lt;/h1>'
  }
}`

const e5 = `<span class='gray'>// index.js</span>
export async function handler(event, context) {
  return '&lt;h1>Hello world!&lt;/h1>'
}`

const e6 = `<span class='gray'>// index.js</span>
export async function handler(event, context) {
  return {
    statusCode: 404,
    html: '&lt;h1>404 Not Found&lt;/h1>'
  }
}`

const e7 = `<span class='gray'>// index.js</span>
export async function handler(event, context) {
  return {
    json: {
      count: 1,
      products: [
        { sku: '1234abcd' }
      ]
    }
  }
}`

const e8 = `<span class='gray'>// presta.config.js</span>
export const files = ['index.tsx', 'pages/*.jsx']
export const output = 'build'
export const assets = 'public'`

export function getStaticPaths() {
  return ['/']
}

export function handler(event) {
  return html({
    head: {
      title: 'Presta | Minimalist Web Framework',
      description: `Minimalist web framework for SSG, SSR, API functions and more.`,
      image: 'https://presta.run/og.png',
      twitter: {
        card: 'summary_large_image',
        site: 'presta_run',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' },
        `<link rel="preconnect" href="https://fonts.googleapis.com">`,
        `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
        `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap" rel="stylesheet">`,
        { rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' },
        { rel: 'stylesheet', href: '/style.css' },
      ],
    },
    bodyAttributes: {
      style: 'background: var(--light)',
    },
    body: (
      <main className="outer">
        <div className="f jcb aic">
          <h1>
            <img src="/logotype.svg" style={{ width: '150px' }} />
            <span className="hidden">Presta</span>
          </h1>

          <a href="https://github.com/sure-thing/presta" title="Presta Github" target="_blank">
            <img src="/github.svg" />
            <span className="hidden">Presta Github</span>
          </a>
        </div>

        <div className="pt8 pb8" style={{ maxWidth: '775px' }}>
          <p className="h4">
            Minimalist web framework for serverless APIs, SSR/SSG pages and more. Less than 1500 lines of TypeScript,{' '}
            <a href="https://packagephobia.com/result?p=presta" target="_blank">
              small install size
            </a>
            , powered by{' '}
            <a href="https://esbuild.github.io/" target="_blank">
              esbuild
            </a>
            . Get started right now with no setup: <code>npx presta dev index.js</code>
          </p>
        </div>

        <div className="pt12">
          <h2 className="h4 mb6">Usage</h2>
          <hr className="lightest" style={{ height: '3px', borderRadius: '10px' }} />
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">In each file, export a dynamic route:</p>
          </div>
          <div className="__right w12">
            <pre>{e1}</pre>
          </div>
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">Or generate an array of static paths to render:</p>
          </div>
          <div className="__right w12">
            <pre>{e2}</pre>
          </div>
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">
              Or both. Unmatched files will be rendered <em>dynamically:</em>
            </p>
          </div>
          <div className="__right w12">
            <pre>{e3}</pre>
          </div>
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">What's left is just a normal serverless function:</p>
          </div>
          <div className="__right w12">
            <pre>{e4}</pre>
          </div>
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">
              Presta handlers have a few shortcuts. Like, you can return a string to render HTML by default.
            </p>
          </div>
          <div className="__right w12">
            <pre>{e5}</pre>
          </div>
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">
              Or use a shorthand in order to pass other properties and automatically set headers:
            </p>
          </div>
          <div className="__right w12">
            <pre>{e6}</pre>
          </div>
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">
              Other shorthands include <code>json</code> and <code>xml</code>. When using <code>json</code>, Presta will
              automatically stringify the response.
            </p>
          </div>
          <div className="__right w12">
            <pre>{e7}</pre>
          </div>
        </div>

        <div className="pt12">
          <h2 className="h4 mb6">Config</h2>
          <hr className="lightest" style={{ height: '3px', borderRadius: '10px' }} />
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">
              Peep the CLI with <code>npx presta -h</code> for more info. You can also define a config file with any CLI
              options predefined:
            </p>
          </div>
          <div className="__right w12">
            <pre>{e8}</pre>
          </div>
        </div>

        <div className="pt12">
          <h2 className="h4 mb6">Deployment</h2>
          <hr className="lightest" style={{ height: '3px', borderRadius: '10px' }} />
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">
              Presta builds everything to <code>config.output</code> (or <code>--output</code>):
            </p>
          </div>
          <div className="__right w12">
            <p className="text-width mb3">
              Static paths and assets to <code>(config.output)/static</code>
            </p>
            <p className="text-width mb3">
              Serverless functions to <code>(config.output)/functions</code>
            </p>
          </div>
        </div>

        <div className="pt12">
          <h2 className="h4 mb6">Ecosystem</h2>
          <hr className="lightest" style={{ height: '3px', borderRadius: '10px' }} />
        </div>

        <div className="section f fw py12">
          <div className="__left w12">
            <p className="text-width mb3">Check out the other packages in the Presta ecosystem:</p>
            <ul>
              <li>
                <a href="https://github.com/sure-thing/presta/tree/main/packages/html" target="_blank">
                  @presta/html
                </a>{' '}
                — utility for creating HTML pages
              </li>
              <li>
                <a href="https://github.com/sure-thing/presta/tree/main/packages/adapter-netlify" target="_blank">
                  @presta/adapter-netlify
                </a>{' '}
                — deployment adapter for Netlify
              </li>
            </ul>
          </div>
          <div className="__right w12">
            <p className="text-width mb3">
              And check out the{' '}
              <a href="https://github.com/sure-thing/presta" target="_blank">
                Github
              </a>{' '}
              for more information, to file and issue, or contribute.
            </p>
          </div>
        </div>
      </main>
    ),
  })
}
