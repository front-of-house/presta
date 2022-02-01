export function Nav({ currentPath }) {
  return `
    <div class='pb6 f aic'>
      ${[
        { href: '/', title: 'Home' },
        { href: '/about', title: 'About' },
        { href: '/contact', title: 'Contact' },
        { href: '/some-page', title: 'Some Page' },
        { href: '/not/found', title: '404' },
      ]
        .map(
          (link) => `<a href='${link.href}' class='mr4 ${currentPath === link.href ? 'active' : ''}'>${link.title}</a>`
        )
        .join('')}
    </div>
  `
}
