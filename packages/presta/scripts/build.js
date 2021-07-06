const pkg = require('../package.json')

require('esbuild').buildSync({
   entryPoints: [
      'lib/cli.ts',
      'lib/extract.ts',
      'lib/html.ts',
      'lib/load.ts',
      'lib/utils.ts',
   ],
   outdir: process.cwd(),
   bundle: true,
   minify: true,
   platform: 'node',
   target: 'node12',
   sourcemap: 'inline',
   external: Object.keys(pkg.dependencies),
   logLevel: 'info',
})
