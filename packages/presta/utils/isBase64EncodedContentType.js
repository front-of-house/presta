var a = Object.defineProperty
var e = (i) => a(i, '__esModule', { value: !0 })
var n = (i, t) => {
  e(i)
  for (var o in t) a(i, o, { get: t[o], enumerable: !0 })
}
n(exports, { isBase64EncodedContentType: () => c })
var p = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function c(i) {
  return Boolean(i) && p.test(i)
}
0 && (module.exports = { isBase64EncodedContentType })
