const path = require('path')

const pkg = require('../package.json')

require('esbuild').buildSync({
  entryPoints: [
    'lib/bin.ts', // CLI
    'lib/index.ts', // import * as presta from 'presta'
    'lib/wrapHandler.ts', // presta/dist/wrapHandler
    'lib/normalizeHeaders.ts', // presta/dist/normalizeHeaders
    'lib/parseQueryStringParameters.ts', // presta/dist/parseQueryStringParameters
  ],
  outdir: path.join(__dirname, '../dist'),
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node12',
  sourcemap: 'inline',
  external: Object.keys(pkg.dependencies),
  logLevel: 'info',
})
