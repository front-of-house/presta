export function Nav({ currentPath }: { currentPath?: string } = {}) {
  return `
    <div class='pb6 f aic'>
      ${[
        { href: '/', title: 'Home' },
        { href: '/about', title: 'About' },
        { href: '/contact', title: 'Contact' },
      ]
        .map(
          (link) => `<a href='${link.href}' class='mr4 ${currentPath === link.href ? 'active' : ''}'>${link.title}</a>`
        )
        .join('')}
    </div>
  `
}
