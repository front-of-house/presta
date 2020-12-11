import { h } from 'hyposcript'
import { Box } from 'hypobox'

export function Logo ({ noWord }) {
  return (
    <Box as='h1' f aic>
      <Box dib as='span' fs='50px' h={40} lh='33px' c='pink'>
        ~
      </Box>
      <Box pl={2} dib as='span' fs={3} h={40} css={{ opacity: noWord ? 0 : 1 }}>
        Presta
      </Box>
    </Box>
  )
}
