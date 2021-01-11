#!/usr/bin/env node

process.env.PRESTA_ENV = 'development'

const { addHook } = require('sucrase/dist/register')

const [_, jsx = 'h'] = process.argv.join(' ').match(/--jsx[\s|=]([^-]+)/) || []

const jsxPresets = {
  h: {
    jsxPragma: 'h',
    jsxFragmentPragma: 'h'
  },
  react: {
    jsxPragma: 'React.createElement',
    jsxFragmentPragma: 'React.Fragment'
  }
}

addHook('.js', {
  transforms: ['imports', 'flow', 'jsx'],
  ...jsxPresets[jsx]
})
addHook('.jsx', {
  transforms: ['imports', 'flow', 'jsx'],
  ...jsxPresets[jsx]
})
addHook('.ts', {
  transforms: ['imports', 'typescript'],
  ...jsxPresets[jsx]
})
addHook('.tsx', {
  transforms: ['imports', 'typescript', 'jsx'],
  ...jsxPresets[jsx]
})

try {
  require('./cli')
} catch (e) {
  console.error(e)
}
