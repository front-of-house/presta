import React from 'react'
import { Box } from '@hypobox/react'
import md from 'marked'

export function Markdown ({ content, children }) {
  return (
    <Box
      className='wysiwyg'
      dangerouslySetInnerHTML={{ __html: md(content) }}
    />
  )
}
