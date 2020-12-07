import { h } from 'hyposcript'
import { Box } from 'hypobox'
import md from 'marked'

export function Markdown ({ children }) {
  return <Box class='wysiwyg'>{md(children[0])}</Box>
}
