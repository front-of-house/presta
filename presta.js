#!/usr/bin/env node

require = require('esm')(module)

const path = require('path')
const { cosmiconfigSync } = require('cosmiconfig')

const { config: userBabelConfig } = cosmiconfigSync('babel').search() || {}

require('@babel/register')(
  userBabelConfig || {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    presets: [
      [
        '@babel/preset-react',
        {
          pragma: 'h',
          pragmaFrag: 'h'
        }
      ]
    ]
  }
)

require('module-alias').addAliases({
  '@': process.cwd()
})

require('./cli')
