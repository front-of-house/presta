var u = Object.create
var s = Object.defineProperty
var v = Object.getOwnPropertyDescriptor
var b = Object.getOwnPropertyNames
var g = Object.getPrototypeOf,
  x = Object.prototype.hasOwnProperty
var p = (t) => s(t, '__esModule', { value: !0 })
var c = (t, e) => {
    p(t)
    for (var r in e) s(t, r, { get: e[r], enumerable: !0 })
  },
  y = (t, e, r) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let o of b(e))
        !x.call(t, o) && o !== 'default' && s(t, o, { get: () => e[o], enumerable: !(r = v(e, o)) || r.enumerable })
    return t
  },
  a = (t) =>
    y(
      p(
        s(
          t != null ? u(g(t)) : {},
          'default',
          t && t.__esModule && 'default' in t ? { get: () => t.default, enumerable: !0 } : { value: t, enumerable: !0 }
        )
      ),
      t
    )
c(exports, { config: () => P, handler: () => j, route: () => H })
var d = a(require('presta/runtime/wrapHandler'))
var n = {}
c(n, { handler: () => N, route: () => $ })
var f = a(require('presta/serialize')),
  l = a(require('@presta/html'))
function m({ currentPath: t } = {}) {
  return `
    <div class='pb6 f aic'>
      ${[
        { href: '/', title: 'Home' },
        { href: '/about', title: 'About' },
        { href: '/contact', title: 'Contact' },
        { href: '/some-page', title: 'Some Page' },
        { href: '/not/found', title: '404' },
      ]
        .map((e) => `<a href='${e.href}' class='mr4 ${t === e.href ? 'active' : ''}'>${e.title}</a>`)
        .join('')}
    </div>
  `
}
var h = [
  { rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' },
  { rel: 'stylesheet', href: '/style.css' },
]
var $ = '*'
function N(t) {
  return (0, f.html)({
    statusCode: 404,
    body: (0, l.html)({
      head: { link: h },
      body: `
        <div class='p10'>
          ${m({ currentPath: t.path })}
          <h1>404 Not Found: ${t.path}</h1>
        </div>
      `,
    }),
  })
}
var i = Object.assign({ config: {} }, n),
  H = i.route,
  P = i.config,
  j = (0, d.wrapHandler)(i)
0 && (module.exports = { config, handler, route })
