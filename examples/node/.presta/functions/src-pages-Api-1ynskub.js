var l = Object.create
var n = Object.defineProperty
var d = Object.getOwnPropertyDescriptor
var u = Object.getOwnPropertyNames
var x = Object.getPrototypeOf,
  g = Object.prototype.hasOwnProperty
var a = (r) => n(r, '__esModule', { value: !0 })
var i = (r, e) => {
    a(r)
    for (var t in e) n(r, t, { get: e[t], enumerable: !0 })
  },
  b = (r, e, t) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let o of u(e))
        !g.call(r, o) && o !== 'default' && n(r, o, { get: () => e[o], enumerable: !(t = d(e, o)) || t.enumerable })
    return r
  },
  c = (r) =>
    b(
      a(
        n(
          r != null ? l(x(r)) : {},
          'default',
          r && r.__esModule && 'default' in r ? { get: () => r.default, enumerable: !0 } : { value: r, enumerable: !0 }
        )
      ),
      r
    )
i(exports, { config: () => w, handler: () => y, route: () => v })
var f = c(require('presta/runtime/wrapHandler'))
var s = {}
i(s, { handler: () => j, route: () => h })
var m = c(require('presta/serialize')),
  h = '/api/*'
function j(r) {
  return (0, m.json)({ body: r })
}
var p = Object.assign({ config: {} }, s),
  v = p.route,
  w = p.config,
  y = (0, f.wrapHandler)(p)
0 && (module.exports = { config, handler, route })
