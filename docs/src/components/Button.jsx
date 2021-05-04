import React from 'react'
import { Box } from '@hypobox/react'

export function Button ({ children, ...props }) {
  return (
    <Box
      as='button'
      py={2}
      px={4}
      bg='pink'
      fs={6}
      fw={4}
      cx={{
        color: 'var(--dark) !important',
        border: '2px solid currentColor',
        borderRadius: '6px',
        textDecoration: 'none'
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
