export default interface context {
  path: string;
  headers: {}
  params: {},
  query: {},
  lambda: {
    event: {},
    context: {}
  }
}