const merge = require('deepmerge')

function createContext (context) {
  return merge(
    {
      path: '',
      headers: {},
      params: {},
      query: {},
      lambda: {
        event: {},
        context: {}
      }
    },
    context
  )
}

module.exports = { createContext }
