#!/usr/bin/env node

process.env.PRESTA_ENV = 'development'

require('@babel/register')({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: '12' },
        useBuiltIns: 'usage',
        corejs: '3.6'
      }
    ]
  ]
})

try {
  require('./cli')
} catch (e) {
  console.error(e)
}
