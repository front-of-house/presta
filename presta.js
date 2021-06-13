#!/usr/bin/env node

require('module-alias').addAliases({
  '@': process.cwd(),
  'presta:internal': __dirname // wherever this is running from
})

require('esbuild-register/dist/node').register({})

require('./cli')
