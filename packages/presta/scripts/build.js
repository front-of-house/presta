const path = require('path')

const pkg = require('../package.json')

require('esbuild').buildSync({
  entryPoints: [
    'lib/bin.ts', // CLI
    'lib/index.ts', // import * as presta from 'presta'
    'lib/serialize.ts', // import { html } from 'presta/serialize'
    'lib/html.ts', // import { html } from 'presta/serialize'

    'lib/utils/timer.ts',
    'lib/utils/createDefaultHtmlResponse.ts',
    'lib/utils/requestToEvent.ts',
    'lib/utils/requireSafe.ts',

    'lib/runtime/wrapHandler.ts',
    'lib/runtime/normalizeEvent.ts',
    'lib/runtime/normalizeResponse.ts',
    'lib/runtime/normalizeRequestHeaders.ts',
    'lib/runtime/normalizeResponseHeaders.ts',
    'lib/runtime/parsePathParameters.ts',
    'lib/runtime/parseQueryStringParameters.ts',
    'lib/runtime/sendServerlessResponse.ts',
    'lib/runtime/isBase64EncodedContentType.ts',
  ],
  outdir: path.join(__dirname, '../'),
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node12',
  sourcemap: 'inline',
  external: Object.keys(pkg.dependencies),
  logLevel: 'info',
})
