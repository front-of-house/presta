import { h } from 'hyposcript'
import { Box } from 'hypobox'

export function Gutter ({ withVertical, children }) {
  return (
    <Box px={[7, 7, 12]} py={withVertical ? [7, 7, 12] : 0}>
      {children}
    </Box>
  )
}
