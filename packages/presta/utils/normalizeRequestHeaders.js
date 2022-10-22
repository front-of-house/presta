var n = Object.defineProperty
var i = (e) => n(e, '__esModule', { value: !0 })
var m = (e, t) => {
  i(e)
  for (var a in t) n(e, a, { get: t[a], enumerable: !0 })
}
m(exports, { normalizeRequestHeaders: () => l })
function l(e) {
  let t = {},
    a = {}
  for (let s of Object.keys(e)) {
    let o = s.toLowerCase(),
      r = e[s]
    !r || (Array.isArray(r) ? (a[o] = r) : (t[o] = r))
  }
  return { headers: t, multiValueHeaders: a }
}
0 && (module.exports = { normalizeRequestHeaders })
