import merge from 'deepmerge'

export function head () {
  return function create (context) {
    context.props.head = {}

    return obj => {
      context.props.head = merge(context.props.head, obj)
    }
  }
}
