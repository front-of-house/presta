var n = Object.create
var m = Object.defineProperty
var y = Object.getOwnPropertyDescriptor
var l = Object.getOwnPropertyNames
var p = Object.getPrototypeOf,
  c = Object.prototype.hasOwnProperty
var i = (r) => m(r, '__esModule', { value: !0 })
var f = (r, a) => {
    i(r)
    for (var e in a) m(r, e, { get: a[e], enumerable: !0 })
  },
  P = (r, a, e) => {
    if ((a && typeof a == 'object') || typeof a == 'function')
      for (let t of l(a))
        !c.call(r, t) && t !== 'default' && m(r, t, { get: () => a[t], enumerable: !(e = y(a, t)) || e.enumerable })
    return r
  },
  g = (r) =>
    P(
      i(
        m(
          r != null ? n(p(r)) : {},
          'default',
          r && r.__esModule && 'default' in r ? { get: () => r.default, enumerable: !0 } : { value: r, enumerable: !0 }
        )
      ),
      r
    )
f(exports, { parseQueryStringParameters: () => Q })
var u = g(require('query-string'))
function Q(r) {
  let a = (0, u.parse)(r, { arrayFormat: 'comma' }),
    e = {},
    t = {}
  for (let o of Object.keys(a)) {
    let s = a[o]
    Array.isArray(s) ? (t[o] = s) : s && (e[o] = s)
  }
  return { queryStringParameters: e, multiValueQueryStringParameters: t }
}
0 && (module.exports = { parseQueryStringParameters })
