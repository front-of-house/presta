const path = require('path')

const pkg = require('../package.json')

require('esbuild').buildSync({
  entryPoints: [
    'lib/index.ts',
    'lib/requestToEvent.ts',
    'lib/normalizeHeaders.ts',
    'lib/parseQueryStringParameters.ts',
    'lib/requireFresh.ts',
    'lib/requireSafe.ts',
    'lib/hashContent.ts',
    'lib/sendServerlessResponse.ts',
    'lib/timer.ts',
    'lib/createDefaultHtmlResponse.ts',
    'lib/parsePathParameters.ts',
  ],
  outdir: path.join(__dirname, '..'),
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node12',
  sourcemap: 'inline',
  external: Object.keys(pkg.dependencies || {}),
  logLevel: 'info',
})
