var c = Object.create
var i = Object.defineProperty
var y = Object.getOwnPropertyDescriptor
var d = Object.getOwnPropertyNames
var P = Object.getPrototypeOf,
  g = Object.prototype.hasOwnProperty
var m = (r) => i(r, '__esModule', { value: !0 })
var h = (r, a) => {
    m(r)
    for (var t in a) i(r, t, { get: a[t], enumerable: !0 })
  },
  f = (r, a, t) => {
    if ((a && typeof a == 'object') || typeof a == 'function')
      for (let e of d(a))
        !g.call(r, e) && e !== 'default' && i(r, e, { get: () => a[e], enumerable: !(t = y(a, e)) || t.enumerable })
    return r
  },
  E = (r) =>
    f(
      m(
        i(
          r != null ? c(P(r)) : {},
          'default',
          r && r.__esModule && 'default' in r ? { get: () => r.default, enumerable: !0 } : { value: r, enumerable: !0 }
        )
      ),
      r
    )
h(exports, { normalizeEvent: () => Q })
var p = E(require('query-string'))
function n(r) {
  let a = (0, p.parse)(r, { arrayFormat: 'comma' }),
    t = {},
    e = {}
  for (let s of Object.keys(a)) {
    let o = a[s]
    Array.isArray(o) ? (e[s] = o) : o && (t[s] = o)
  }
  return { queryStringParameters: t, multiValueQueryStringParameters: e }
}
var S = /image|audio|video|application\/pdf|application\/zip|applicaton\/octet-stream/i
function l(r) {
  return Boolean(r) && S.test(r)
}
function Q(r) {
  var o, u
  let a = r.rawQuery || r.path.split('?')[1],
    { queryStringParameters: t, multiValueQueryStringParameters: e } = n(a),
    s =
      (u = r.isBase64Encoded) != null
        ? u
        : l(((o = r == null ? void 0 : r.headers) == null ? void 0 : o['content-type']) || '')
  return {
    rawUrl: r.rawUrl || r.path,
    rawQuery: a,
    path: r.path,
    httpMethod: r.httpMethod || 'GET',
    headers: r.headers || {},
    multiValueHeaders: r.multiValueHeaders || {},
    queryStringParameters: r.queryStringParameters || t,
    multiValueQueryStringParameters: r.multiValueQueryStringParameters || e,
    pathParameters: r.pathParameters || {},
    body: r.body || null,
    isBase64Encoded: s != null ? s : !1,
    requestContext: r.requestContext || {},
    resource: r.resource || '',
  }
}
0 && (module.exports = { normalizeEvent })
