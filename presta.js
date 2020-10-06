#!/usr/bin/env node

require = require('esm')(module)

const path = require('path')

const [_, jsx = 'h'] = process.argv.join(' ').match(/--jsx[\s|=]([^-]+)/) || []

const pragma = {
  h: {
    pragma: 'h',
    pragmaFrag: 'h'
  },
  react: {
    pragma: 'React.createElement',
    pragmaFrag: 'React.Fragment'
  }
}

const babel = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [['@babel/preset-react', pragma[jsx] || pragma.h]]
}

try {
  babel.extends = require.resolve(path.join(process.cwd(), 'babel.config.js'))
} catch (e) {}

require('@babel/register')(babel)

require('module-alias').addAliases({
  '@': process.cwd()
})

require('./cli')
