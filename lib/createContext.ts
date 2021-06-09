import merge from 'deepmerge'

export const createContext = (context: any) => {
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
