var d = Object.create
var s = Object.defineProperty
var f = Object.getOwnPropertyDescriptor
var l = Object.getOwnPropertyNames
var m = Object.getPrototypeOf,
  u = Object.prototype.hasOwnProperty
var c = (e) => s(e, '__esModule', { value: !0 })
var i = (e, t) => {
    c(e)
    for (var r in t) s(e, r, { get: t[r], enumerable: !0 })
  },
  x = (e, t, r) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let o of l(t))
        !u.call(e, o) && o !== 'default' && s(e, o, { get: () => t[o], enumerable: !(r = f(t, o)) || r.enumerable })
    return e
  },
  g = (e) =>
    x(
      c(
        s(
          e != null ? d(m(e)) : {},
          'default',
          e && e.__esModule && 'default' in e ? { get: () => e.default, enumerable: !0 } : { value: e, enumerable: !0 }
        )
      ),
      e
    )
i(exports, { config: () => H, handler: () => j, route: () => w })
var p = g(require('presta/runtime/wrapHandler'))
var n = {}
i(n, { handler: () => b, route: () => h })
var h = '/redirect'
function b() {
  return { statusCode: 302, headers: { location: '/' } }
}
var a = Object.assign({ config: {} }, n),
  w = a.route,
  H = a.config,
  j = (0, p.wrapHandler)(a)
0 && (module.exports = { config, handler, route })
