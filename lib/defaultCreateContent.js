import { document } from '../document'

export function defaultCreateContent (context) {
  return document({
    head: context.head,
    body: content.content
  })
}
