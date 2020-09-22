require = require('esm')(module)

require('@babel/register')({
  presets: [
    [
      '@babel/preset-react',
      {
        pragma: 'h',
        pragmaFrag: 'h'
      }
    ]
  ]
})

require('module-alias').addAliases({
  '@': process.cwd()
})

module.exports = require('./load')
