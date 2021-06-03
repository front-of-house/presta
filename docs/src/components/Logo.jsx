import React from 'react'
import { Box } from '@hypobox/react'

function Zap (props) {
  return (
    <Box
      as='svg'
      dib
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'></polygon>
    </Box>
  )
}

export function Logo ({ noWord }) {
  return (
    <Box as='h1' f aic lh='1.2'>
      <Zap c='accent' />
      <Box pl={2} dib as='span' fs={3} h={40} cx={{ opacity: noWord ? 0 : 1 }}>
        Presta
      </Box>
    </Box>
  )
}
