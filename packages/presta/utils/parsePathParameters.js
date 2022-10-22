var l = Object.create
var s = Object.defineProperty
var c = Object.getOwnPropertyDescriptor
var g = Object.getOwnPropertyNames
var h = Object.getPrototypeOf,
  P = Object.prototype.hasOwnProperty
var p = (t) => s(t, '__esModule', { value: !0 })
var u = (t, e) => {
    p(t)
    for (var a in e) s(t, a, { get: e[a], enumerable: !0 })
  },
  x = (t, e, a) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let r of g(e))
        !P.call(t, r) && r !== 'default' && s(t, r, { get: () => e[r], enumerable: !(a = c(e, r)) || a.enumerable })
    return t
  },
  f = (t) =>
    x(
      p(
        s(
          t != null ? l(h(t)) : {},
          'default',
          t && t.__esModule && 'default' in t ? { get: () => t.default, enumerable: !0 } : { value: t, enumerable: !0 }
        )
      ),
      t
    )
u(exports, { parsePathParameters: () => y })
var n = f(require('regexparam'))
function y(t, e) {
  let [a] = t.split('?'),
    r = (0, n.default)(e),
    m = 0,
    o = {},
    i = r.pattern.exec(a) || []
  for (; m < r.keys.length; ) o[r.keys[m]] = i[++m]
  return o
}
0 && (module.exports = { parsePathParameters })
