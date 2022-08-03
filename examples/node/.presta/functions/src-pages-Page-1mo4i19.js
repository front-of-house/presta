var d = Object.create
var s = Object.defineProperty
var g = Object.getOwnPropertyDescriptor
var v = Object.getOwnPropertyNames
var x = Object.getPrototypeOf,
  b = Object.prototype.hasOwnProperty
var p = (t) => s(t, '__esModule', { value: !0 })
var c = (t, e) => {
    p(t)
    for (var r in e) s(t, r, { get: e[r], enumerable: !0 })
  },
  y = (t, e, r) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let o of v(e))
        !b.call(t, o) && o !== 'default' && s(t, o, { get: () => e[o], enumerable: !(r = g(e, o)) || r.enumerable })
    return t
  },
  a = (t) =>
    y(
      p(
        s(
          t != null ? d(x(t)) : {},
          'default',
          t && t.__esModule && 'default' in t ? { get: () => t.default, enumerable: !0 } : { value: t, enumerable: !0 }
        )
      ),
      t
    )
c(exports, { config: () => N, handler: () => _, route: () => P })
var u = a(require('presta/runtime/wrapHandler'))
var i = {}
c(i, { handler: () => H, route: () => $ })
var h = a(require('presta/serialize')),
  f = a(require('@presta/html'))
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
var l = [
  { rel: 'stylesheet', href: 'https://unpkg.com/svbstrate@5.1.0/svbstrate.css' },
  { rel: 'stylesheet', href: '/style.css' },
]
var $ = '/:slug?'
function H(t) {
  return (0, h.html)({
    multiValueHeaders: { 'set-cookie': ['presta_example=1', 'presta_example_2=1'] },
    body: (0, f.html)({
      head: { link: l },
      body: `
        <div class='p10'>
          ${m({ currentPath: t.path })}
          <h1>Dynamic page: ${t.path}</h1>
        </div>
      `,
    }),
  })
}
var n = Object.assign({ config: {} }, i),
  P = n.route,
  N = n.config,
  _ = (0, u.wrapHandler)(n)
0 && (module.exports = { config, handler, route })
