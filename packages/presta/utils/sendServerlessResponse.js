var d = Object.defineProperty
var o = (t) => d(t, '__esModule', { value: !0 })
var s = (t, e) => {
  o(t)
  for (var a in e) d(t, a, { get: e[a], enumerable: !0 })
}
s(exports, { sendServerlessResponse: () => i })
function i(t, e) {
  if (e.multiValueHeaders)
    for (let a of Object.keys(e.multiValueHeaders))
      t.setHeader(
        a,
        e.multiValueHeaders[a].map((r) => String(r))
      )
  if (e.headers) for (let a of Object.keys(e.headers)) t.setHeader(a, String(e.headers[a]))
  ;(t.statusCode = e.statusCode), t.end(e.body)
}
0 && (module.exports = { sendServerlessResponse })
