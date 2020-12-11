import { h } from 'hyposcript'
import { Box } from 'hypobox'

export function Button ({ children, ...props }) {
  return (
    <Box
      as='button'
      py={2}
      px={4}
      bg='pink'
      fs={6}
      fe={4}
      css={{
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
