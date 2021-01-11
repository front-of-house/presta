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

addHook(
  '.js',
  {
    transforms: ['imports', 'flow', 'jsx'],
    ...jsxPresets[jsx]
  },
  {
    ignoreNodeModules: false
  }
)
addHook(
  '.jsx',
  {
    transforms: ['imports', 'flow', 'jsx'],
    ...jsxPresets[jsx]
  },
  {
    ignoreNodeModules: false
  }
)
addHook(
  '.ts',
  {
    transforms: ['imports', 'typescript'],
    ...jsxPresets[jsx]
  },
  {
    ignoreNodeModules: false
  }
)
addHook(
  '.tsx',
  {
    transforms: ['imports', 'typescript', 'jsx'],
    ...jsxPresets[jsx]
  },
  {
    ignoreNodeModules: false
  }
)

try {
  require('./cli')
} catch (e) {
  console.error(e)
}
