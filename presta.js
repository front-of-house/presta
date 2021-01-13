#!/usr/bin/env node

process.env.PRESTA_ENV = 'development'

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

require('./lib/register')({
  ...jsxPresets[jsx]
})

try {
  require('./cli')
} catch (e) {
  console.error(e)
}
