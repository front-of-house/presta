import { h } from 'hyposcript'
import { Box } from 'hypobox'

import { Arrow } from '@/src/icons/Arrow'

export function SectionButton ({ right, title, description, ...props }) {
  return (
    <Box
      as='button'
      f
      aic
      jcb
      w={[1, 1, 'auto']}
      py={6}
      px={8}
      c='d'
      bg='white'
      fs={6}
      css={{
        border: '2px solid currentColor',
        borderRadius: '6px',
        textDecoration: 'none'
      }}
      {...props}
    >
      <Box ta={right ? 'left' : 'right'}>
        <Box as='h5'>{title}</Box>
        {description && (
          <Box as='p' mt={2} fs={6}>
            {description}
          </Box>
        )}
      </Box>
      <Arrow
        w={32}
        h={32}
        c='b'
        mr={right ? 0 : 5}
        ml={right ? 5 : 0}
        direction={right ? 'right' : 'left'}
        o={right ? 0 : -1}
      />
    </Box>
  )
}
