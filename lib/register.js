const { addHook } = require('sucrase/dist/register')

module.exports = function register (options = {}) {
  addHook('.js', {
    transforms: ['imports', 'flow', 'jsx'],
    ...options
  })
  addHook('.jsx', {
    transforms: ['imports', 'flow', 'jsx'],
    ...options
  })
  addHook('.ts', {
    transforms: ['imports', 'typescript'],
    ...options
  })
  addHook('.tsx', {
    transforms: ['imports', 'typescript', 'jsx'],
    ...options
  })
}
