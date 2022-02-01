import { h } from 'hyposcript'
import { Box } from 'hypobox'

export function Nav({ currentPath }: { currentPath?: string } = {}) {
  return (
    <Box pb={6} f aic>
      {[
        { href: '/', title: 'Home' },
        { href: '/about', title: 'About' },
        { href: '/contact', title: 'Contact' },
        { href: '/some-page', title: 'Some Page' },
        { href: '/not/found', title: '404' },
      ]
        .map((link) => (
          <Box as="a" href={link.href} mr={4} className={currentPath === link.href ? 'active' : ''}>
            {link.title}
          </Box>
        ))
        .join('')}
    </Box>
  )
}
