import { document } from '../document'

export function defaultCreateContent (context) {
  return document({
    head: context.props.head,
    body: context.props.content
  })
}
