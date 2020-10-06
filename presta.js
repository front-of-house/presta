#!/usr/bin/env node

require = require('esm')(module)

const path = require('path')

const [_, jsx] = process.argv.join(' ').match(/--jsx[\s|=]([^-]+)/) || []

const jsxPragmas = {
  react: {
    pragma: 'React.createElement',
    pragmaFrag: 'React.Fragment'
  }
}

require('@babel/register')({
  extends: path.join(process.cwd(), 'babel.config.js'),
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
    [
      '@babel/preset-react',
      jsxPragmas[jsx] || {
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
