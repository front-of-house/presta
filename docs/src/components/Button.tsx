import React from 'react'
import { Box } from '@hypobox/react'

export function Button ({ children, ...props }) {
  return (
    <Box
      as='button'
      py={2}
      px={4}
      bg='accent'
      fs={6}
      fw={7}
      cx={{
        c: 'white !important',
        border: '2px solid',
        borderColor: 'dark',
        borderRadius: '6px',
        textDecoration: 'none !important'
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
