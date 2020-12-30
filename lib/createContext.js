import merge from 'deepmerge'

export function createContext (context) {
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
