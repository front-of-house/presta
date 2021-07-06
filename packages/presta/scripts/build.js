const pkg = require('../package.json')

require('esbuild').buildSync({
   entryPoints: [
      'lib/cli.ts',
      'lib/index.ts',
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
