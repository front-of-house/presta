import { h } from 'hyposcript'
import { Box } from 'hypobox'

const transforms = {
  up: 'rotate(-90deg)',
  down: 'rotate(90deg)',
  left: 'rotate(180deg)',
  right: ''
}

export function Arrow ({ direction = 'right', ...props }) {
  return (
    <Box
      as='svg'
      db
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      css={{ transform: transforms[direction] }}
      {...props}
    >
      <circle cx='12' cy='12' r='10'></circle>
      <polyline points='12 16 16 12 12 8'></polyline>
      <line x1='8' y1='12' x2='16' y2='12'></line>
    </Box>
  )
}
