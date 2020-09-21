#!/usr/bin/env node

require = require('esm')(module)

const [_, jsx] = process.argv.join(' ').match(/--jsx[\s|=]([^-]+)/) || []

require('@babel/register')({
  presets: [
    [
      '@babel/preset-react',
      {
        pragma: jsx || 'h',
        pragmaFrag: jsx || 'h'
      }
    ]
  ]
})

require('module-alias').addAliases({
  '@': process.cwd()
})

require('./cli')
