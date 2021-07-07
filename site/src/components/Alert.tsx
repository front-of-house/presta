import React from 'react'
import { Box } from '@hypobox/react'

import { Info } from '@/src/icons/Info'

export function Alert ({ children, ...rest }: React.PropsWithChildren<{}>) {
  return (
    <Box {...rest}>
      <Box
        f
        fw
        aic
        c='b'
        px={6}
        py={6}
        cx={{
          border: '2px solid',
          borderColor: 'dark',
          borderRadius: '6px',
          boxShadow: 'shadow'
        }}
      >
        <Box w={[1, 32]} h='24'>
          <Info w={32} h={32} c='accent' />
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
