var m = Object.defineProperty
var r = (o) => m(o, '__esModule', { value: !0 })
var f = (o, t) => {
  r(o)
  for (var a in t) m(o, a, { get: t[a], enumerable: !0 })
}
f(exports, { normalizeResponseHeaders: () => c })
function c(o) {
  for (let t of Object.keys(o)) o[t.toLowerCase()] = o[t] || ''
  return o
}
0 && (module.exports = { normalizeResponseHeaders })
