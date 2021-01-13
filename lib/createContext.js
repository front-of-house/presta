const merge = require('deepmerge')

function createContext (context) {
  return merge(
    {
      path: '',
      headers: {},
      params: {},
      query: {},
      context: {},
      props: {},
      plugins: {}
    },
    context
  )
}

module.exports = { createContext }
