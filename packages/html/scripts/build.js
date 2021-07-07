const path = require('path')

const pkg = require('../package.json')

require('esbuild').buildSync({
  entryPoints: ['index.ts'],
  outdir: path.join(__dirname, '../dist'),
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node12',
  sourcemap: 'inline',
  external: Object.keys(pkg.dependencies || {}),
  logLevel: 'info',
})
