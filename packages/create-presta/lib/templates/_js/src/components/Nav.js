export function Nav({ currentPath }) {
  return `
    <div class='pb6 f fw aic'>
      ${[
        { href: '/', title: 'Home' },
        { href: '/about', title: 'About' },
        { href: '/contact', title: 'Contact' },
        { href: '/some-page', title: 'Some Page' },
        { href: '/not/found', title: '404' },
        { href: '/redirect', title: 'Redirect' },
        { href: '/api/foo', title: 'API' },
      ]
        .map(
          (link) =>
            `<a href='${link.href}' class='mr4 mb2 ${currentPath === link.href ? 'active' : ''}'>${link.title}</a>`
        )
        .join('')}
    </div>
  `
}
