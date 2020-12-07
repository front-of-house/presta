import { h } from 'hyposcript'
import { Box } from 'hypobox'

export function Button ({ children, ...props }) {
  return (
    <Box
      as='button'
      py={2}
      px={4}
      c='b'
      bg='transparent'
      fs={6}
      fe={4}
      css={{
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
