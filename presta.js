#!/usr/bin/env node

process.env.PRESTA_ENV = 'development'

require = require('esm')(module)

const path = require('path')
const { cosmiconfigSync } = require('cosmiconfig')
const { config: defaultBabelConfig } = require('./lib/babel')

const { config: userBabelConfig } = cosmiconfigSync('babel').search() || {}

require('@babel/register')(userBabelConfig || defaultBabelConfig)

require('module-alias').addAliases({
  '@': process.cwd()
})

try {
  require('./cli')
} catch (e) {
  console.error(e)
}
