import { h } from 'hyposcript'
import { Box } from 'hypobox'

import { Info } from '@/src/icons/Info'

export function Alert ({ children, ...rest }) {
  return (
    <Box {...rest}>
      <Box
        f
        fw
        aic
        c='b'
        px={6}
        py={6}
        css={{
          border: '2px solid var(--dark)',
          borderRadius: '6px',
          boxShadow: 'var(--shadow)'
        }}
      >
        <Box w={[1, 32]} h='24'>
          <Info w={32} h={32} />
        </Box>
        <Box w={[1, 'calc(100% - 32px)']}>
          <Box pt={[3, 0]} pl={[0, 4]}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
