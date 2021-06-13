var Ze = Object.defineProperty
var Ke = Object.prototype.hasOwnProperty
var Q = Object.getOwnPropertySymbols,
  Qe = Object.prototype.propertyIsEnumerable
var X = (e, r, t) =>
    r in e
      ? Ze(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (e[r] = t),
  w = (e, r) => {
    for (var t in r || (r = {})) Ke.call(r, t) && X(e, t, r[t])
    if (Q) for (var t of Q(r)) Qe.call(r, t) && X(e, t, r[t])
    return e
  }
var d = (e, r) => () => (r || e((r = { exports: {} }).exports, r), r.exports)
var re = d((br, ee) => {
  function Xe (e) {
    return e == '*'
      ? 1e11
      : /^\:(.*)\?/.test(e)
      ? 1111
      : /^\:(.*)\./.test(e)
      ? 11
      : /^\:/.test(e)
      ? 111
      : 1
  }
  function te (e) {
    for (var r = 0, t = '', o = e.split('/'); r < o.length; r++) t += Xe(o[r])
    return (r - 1) / +t
  }
  ee.exports = function (e, r) {
    return (
      (r = {}),
      e.sort(function (t, o) {
        return (r[o] = r[o] || te(o)) - (r[t] = r[t] || te(t))
      })
    )
  }
})
var D = d((Cr, ne) => {
  ne.exports = function (e, r) {
    if (e instanceof RegExp) return { keys: !1, pattern: e }
    var t,
      o,
      n,
      s,
      i = [],
      c = '',
      f = e.split('/')
    for (f[0] || f.shift(); (n = f.shift()); )
      (t = n[0]),
        t === '*'
          ? (i.push('wild'), (c += '/(.*)'))
          : t === ':'
          ? ((o = n.indexOf('?', 1)),
            (s = n.indexOf('.', 1)),
            i.push(n.substring(1, ~o ? o : ~s ? s : n.length)),
            (c += !!~o && !~s ? '(?:/([^/]+?))?' : '/([^/]+?)'),
            ~s && (c += (~o ? '?' : '') + '\\' + n.substring(s)))
          : (c += '/' + n)
    return {
      keys: i,
      pattern: new RegExp('^' + c + (r ? '(?=$|/)' : '/?$'), 'i')
    }
  }
})
var oe = d((mr, se) => {
  var _ = re(),
    k = D()
  _ = _.default || _
  k = k.default || k
  function et (e, r) {
    let o = _(e.map(n => n.route)).map(n => [k(n), e.find(s => s.route === n)])
    return n => {
      for (let [{ pattern: s }, i] of o) if (s.test(n.split('?')[0])) return i
    }
  }
  se.exports = { createRouter: et }
})
var ce = d((yr, ie) => {
  var F = 1e3,
    R = F * 60,
    E = R * 60,
    O = E * 24,
    tt = O * 7,
    rt = O * 365.25
  ie.exports = function (e, r) {
    r = r || {}
    var t = typeof e
    if (t === 'string' && e.length > 0) return nt(e)
    if (t === 'number' && isFinite(e)) return r.long ? ot(e) : st(e)
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(e)
    )
  }
  function nt (e) {
    if (((e = String(e)), !(e.length > 100))) {
      var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        e
      )
      if (!!r) {
        var t = parseFloat(r[1]),
          o = (r[2] || 'ms').toLowerCase()
        switch (o) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return t * rt
          case 'weeks':
          case 'week':
          case 'w':
            return t * tt
          case 'days':
          case 'day':
          case 'd':
            return t * O
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return t * E
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return t * R
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return t * F
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return t
          default:
            return
        }
      }
    }
  }
  function st (e) {
    var r = Math.abs(e)
    return r >= O
      ? Math.round(e / O) + 'd'
      : r >= E
      ? Math.round(e / E) + 'h'
      : r >= R
      ? Math.round(e / R) + 'm'
      : r >= F
      ? Math.round(e / F) + 's'
      : e + 'ms'
  }
  function ot (e) {
    var r = Math.abs(e)
    return r >= O
      ? I(e, r, O, 'day')
      : r >= E
      ? I(e, r, E, 'hour')
      : r >= R
      ? I(e, r, R, 'minute')
      : r >= F
      ? I(e, r, F, 'second')
      : e + ' ms'
  }
  function I (e, r, t, o) {
    var n = r >= t * 1.5
    return Math.round(e / t) + ' ' + o + (n ? 's' : '')
  }
})
var V = d((wr, le) => {
  function it (e) {
    ;(t.debug = t),
      (t.default = t),
      (t.coerce = p),
      (t.disable = i),
      (t.enable = s),
      (t.enabled = c),
      (t.humanize = ce()),
      Object.keys(e).forEach(l => {
        t[l] = e[l]
      }),
      (t.instances = []),
      (t.names = []),
      (t.skips = []),
      (t.formatters = {})
    function r (l) {
      let a = 0
      for (let u = 0; u < l.length; u++)
        (a = (a << 5) - a + l.charCodeAt(u)), (a |= 0)
      return t.colors[Math.abs(a) % t.colors.length]
    }
    t.selectColor = r
    function t (l) {
      let a
      function u (...b) {
        if (!u.enabled) return
        let y = u,
          q = Number(new Date()),
          Ye = q - (a || q)
        ;(y.diff = Ye),
          (y.prev = a),
          (y.curr = q),
          (a = q),
          (b[0] = t.coerce(b[0])),
          typeof b[0] != 'string' && b.unshift('%O')
        let T = 0
        ;(b[0] = b[0].replace(/%([a-zA-Z%])/g, (P, He) => {
          if (P === '%%') return P
          T++
          let K = t.formatters[He]
          if (typeof K == 'function') {
            let Je = b[T]
            ;(P = K.call(y, Je)), b.splice(T, 1), T--
          }
          return P
        })),
          t.formatArgs.call(y, b),
          (y.log || t.log).apply(y, b)
      }
      return (
        (u.namespace = l),
        (u.enabled = t.enabled(l)),
        (u.useColors = t.useColors()),
        (u.color = r(l)),
        (u.destroy = o),
        (u.extend = n),
        typeof t.init == 'function' && t.init(u),
        t.instances.push(u),
        u
      )
    }
    function o () {
      let l = t.instances.indexOf(this)
      return l !== -1 ? (t.instances.splice(l, 1), !0) : !1
    }
    function n (l, a) {
      let u = t(this.namespace + (typeof a == 'undefined' ? ':' : a) + l)
      return (u.log = this.log), u
    }
    function s (l) {
      t.save(l), (t.names = []), (t.skips = [])
      let a,
        u = (typeof l == 'string' ? l : '').split(/[\s,]+/),
        b = u.length
      for (a = 0; a < b; a++)
        !u[a] ||
          ((l = u[a].replace(/\*/g, '.*?')),
          l[0] === '-'
            ? t.skips.push(new RegExp('^' + l.substr(1) + '$'))
            : t.names.push(new RegExp('^' + l + '$')))
      for (a = 0; a < t.instances.length; a++) {
        let y = t.instances[a]
        y.enabled = t.enabled(y.namespace)
      }
    }
    function i () {
      let l = [...t.names.map(f), ...t.skips.map(f).map(a => '-' + a)].join(',')
      return t.enable(''), l
    }
    function c (l) {
      if (l[l.length - 1] === '*') return !0
      let a, u
      for (a = 0, u = t.skips.length; a < u; a++)
        if (t.skips[a].test(l)) return !1
      for (a = 0, u = t.names.length; a < u; a++)
        if (t.names[a].test(l)) return !0
      return !1
    }
    function f (l) {
      return l
        .toString()
        .substring(2, l.toString().length - 2)
        .replace(/\.\*\?$/, '*')
    }
    function p (l) {
      return l instanceof Error ? l.stack || l.message : l
    }
    return t.enable(t.load()), t
  }
  le.exports = it
})
var ae = d((C, N) => {
  C.log = ct
  C.formatArgs = lt
  C.save = at
  C.load = ut
  C.useColors = ft
  C.storage = pt()
  C.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33'
  ]
  function ft () {
    return typeof window != 'undefined' &&
      window.process &&
      (window.process.type === 'renderer' || window.process.__nwjs)
      ? !0
      : typeof navigator != 'undefined' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ? !1
      : (typeof document != 'undefined' &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) ||
        (typeof window != 'undefined' &&
          window.console &&
          (window.console.firebug ||
            (window.console.exception && window.console.table))) ||
        (typeof navigator != 'undefined' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          parseInt(RegExp.$1, 10) >= 31) ||
        (typeof navigator != 'undefined' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
  }
  function lt (e) {
    if (
      ((e[0] =
        (this.useColors ? '%c' : '') +
        this.namespace +
        (this.useColors ? ' %c' : ' ') +
        e[0] +
        (this.useColors ? '%c ' : ' ') +
        '+' +
        N.exports.humanize(this.diff)),
      !this.useColors)
    )
      return
    let r = 'color: ' + this.color
    e.splice(1, 0, r, 'color: inherit')
    let t = 0,
      o = 0
    e[0].replace(/%[a-zA-Z%]/g, n => {
      n !== '%%' && (t++, n === '%c' && (o = t))
    }),
      e.splice(o, 0, r)
  }
  function ct (...e) {
    return typeof console == 'object' && console.log && console.log(...e)
  }
  function at (e) {
    try {
      e ? C.storage.setItem('debug', e) : C.storage.removeItem('debug')
    } catch (r) {}
  }
  function ut () {
    let e
    try {
      e = C.storage.getItem('debug')
    } catch (r) {}
    return (
      !e &&
        typeof process != 'undefined' &&
        'env' in process &&
        (e = process.env.DEBUG),
      e
    )
  }
  function pt () {
    try {
      return localStorage
    } catch (e) {}
  }
  N.exports = V()(C)
  var { formatters: dt } = N.exports
  dt.j = function (e) {
    try {
      return JSON.stringify(e)
    } catch (r) {
      return '[UnexpectedJSONParseError]: ' + r.message
    }
  }
})
var fe = d((Or, ue) => {
  'use strict'
  ue.exports = (e, r) => {
    r = r || process.argv
    let t = e.startsWith('-') ? '' : e.length === 1 ? '-' : '--',
      o = r.indexOf(t + e),
      n = r.indexOf('--')
    return o !== -1 && (n === -1 ? !0 : o < n)
  }
})
var de = d((xr, pe) => {
  'use strict'
  var gt = require('os'),
    m = fe(),
    g = process.env,
    v
  m('no-color') || m('no-colors') || m('color=false')
    ? (v = !1)
    : (m('color') || m('colors') || m('color=true') || m('color=always')) &&
      (v = !0)
  'FORCE_COLOR' in g &&
    (v = g.FORCE_COLOR.length === 0 || parseInt(g.FORCE_COLOR, 10) !== 0)
  function ht (e) {
    return e === 0
      ? !1
      : { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 }
  }
  function bt (e) {
    if (v === !1) return 0
    if (m('color=16m') || m('color=full') || m('color=truecolor')) return 3
    if (m('color=256')) return 2
    if (e && !e.isTTY && v !== !0) return 0
    let r = v ? 1 : 0
    if (process.platform === 'win32') {
      let t = gt.release().split('.')
      return Number(process.versions.node.split('.')[0]) >= 8 &&
        Number(t[0]) >= 10 &&
        Number(t[2]) >= 10586
        ? Number(t[2]) >= 14931
          ? 3
          : 2
        : 1
    }
    if ('CI' in g)
      return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(
        t => t in g
      ) || g.CI_NAME === 'codeship'
        ? 1
        : r
    if ('TEAMCITY_VERSION' in g)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(g.TEAMCITY_VERSION) ? 1 : 0
    if (g.COLORTERM === 'truecolor') return 3
    if ('TERM_PROGRAM' in g) {
      let t = parseInt((g.TERM_PROGRAM_VERSION || '').split('.')[0], 10)
      switch (g.TERM_PROGRAM) {
        case 'iTerm.app':
          return t >= 3 ? 3 : 2
        case 'Apple_Terminal':
          return 2
      }
    }
    return /-256(color)?$/i.test(g.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
          g.TERM
        ) || 'COLORTERM' in g
      ? 1
      : (g.TERM === 'dumb', r)
  }
  function G (e) {
    let r = bt(e)
    return ht(r)
  }
  pe.exports = {
    supportsColor: G,
    stdout: G(process.stdout),
    stderr: G(process.stderr)
  }
})
var he = d((h, $) => {
  var Ct = require('tty'),
    U = require('util')
  h.init = mt
  h.log = yt
  h.formatArgs = wt
  h.save = Ot
  h.load = xt
  h.useColors = Ft
  h.colors = [6, 2, 3, 4, 5, 1]
  try {
    let e = de()
    e &&
      (e.stderr || e).level >= 2 &&
      (h.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ])
  } catch (e) {}
  h.inspectOpts = Object.keys(process.env)
    .filter(e => /^debug_/i.test(e))
    .reduce((e, r) => {
      let t = r
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (n, s) => s.toUpperCase()),
        o = process.env[r]
      return (
        /^(yes|on|true|enabled)$/i.test(o)
          ? (o = !0)
          : /^(no|off|false|disabled)$/i.test(o)
          ? (o = !1)
          : o === 'null'
          ? (o = null)
          : (o = Number(o)),
        (e[t] = o),
        e
      )
    }, {})
  function Ft () {
    return 'colors' in h.inspectOpts
      ? Boolean(h.inspectOpts.colors)
      : Ct.isatty(process.stderr.fd)
  }
  function wt (e) {
    let { namespace: r, useColors: t } = this
    if (t) {
      let o = this.color,
        n = '[3' + (o < 8 ? o : '8;5;' + o),
        s = `  ${n};1m${r} [0m`
      ;(e[0] =
        s +
        e[0]
          .split(
            `
`
          )
          .join(
            `
` + s
          )),
        e.push(n + 'm+' + $.exports.humanize(this.diff) + '[0m')
    } else e[0] = Rt() + r + ' ' + e[0]
  }
  function Rt () {
    return h.inspectOpts.hideDate ? '' : new Date().toISOString() + ' '
  }
  function yt (...e) {
    return process.stderr.write(
      U.format(...e) +
        `
`
    )
  }
  function Ot (e) {
    e ? (process.env.DEBUG = e) : delete process.env.DEBUG
  }
  function xt () {
    return process.env.DEBUG
  }
  function mt (e) {
    e.inspectOpts = {}
    let r = Object.keys(h.inspectOpts)
    for (let t = 0; t < r.length; t++) e.inspectOpts[r[t]] = h.inspectOpts[r[t]]
  }
  $.exports = V()(h)
  var { formatters: ge } = $.exports
  ge.o = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      U.inspect(e, this.inspectOpts).replace(/\s*\n\s*/g, ' ')
    )
  }
  ge.O = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors), U.inspect(e, this.inspectOpts)
    )
  }
})
var be = d((Fr, z) => {
  typeof process == 'undefined' ||
  process.type === 'renderer' ||
  process.browser === !0 ||
  process.__nwjs
    ? (z.exports = ae())
    : (z.exports = he())
})
var me = d((Rr, Ce) => {
  var Et = be(),
    vt = Et('presta')
  Ce.exports = { debug: vt }
})
var we = d((Er, ye) => {
  var L = D()
  L = L.default || L
  function At (e, r) {
    let t = 0,
      o = {},
      n = r.pattern.exec(e)
    for (; t < r.keys.length; ) o[r.keys[t]] = n[++t] || null
    return o
  }
  function Mt (e, r) {
    return At(e, L(r))
  }
  ye.exports = { getRouteParams: Mt }
})
var xe = d((vr, Oe) => {
  var St = `<!-- built with presta https://npm.im/presta -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>404</title>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/svbstrate@4.1.1/dist/svbstrate.css"
    />
  </head>
  <body>
    <div class="f aic jcc" style="height: 100vh">
      <h2 class="p1" style="color: blue">404 Not Found</h2>
    </div>
  </body>
</html>`
  Oe.exports = { default404: St }
})
var ve = d((Ar, Fe) => {
  'use strict'
  var qt = function (r) {
    return jt(r) && !Bt(r)
  }
  function jt (e) {
    return !!e && typeof e == 'object'
  }
  function Bt (e) {
    var r = Object.prototype.toString.call(e)
    return r === '[object RegExp]' || r === '[object Date]' || Tt(e)
  }
  var Pt = typeof Symbol == 'function' && Symbol.for,
    _t = Pt ? Symbol.for('react.element') : 60103
  function Tt (e) {
    return e.$$typeof === _t
  }
  function kt (e) {
    return Array.isArray(e) ? [] : {}
  }
  function S (e, r) {
    return r.clone !== !1 && r.isMergeableObject(e) ? A(kt(e), e, r) : e
  }
  function It (e, r, t) {
    return e.concat(r).map(function (o) {
      return S(o, t)
    })
  }
  function Nt (e, r) {
    if (!r.customMerge) return A
    var t = r.customMerge(e)
    return typeof t == 'function' ? t : A
  }
  function $t (e) {
    return Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(e).filter(function (r) {
          return e.propertyIsEnumerable(r)
        })
      : []
  }
  function Re (e) {
    return Object.keys(e).concat($t(e))
  }
  function Ee (e, r) {
    try {
      return r in e
    } catch (t) {
      return !1
    }
  }
  function Lt (e, r) {
    return (
      Ee(e, r) &&
      !(
        Object.hasOwnProperty.call(e, r) &&
        Object.propertyIsEnumerable.call(e, r)
      )
    )
  }
  function Dt (e, r, t) {
    var o = {}
    return (
      t.isMergeableObject(e) &&
        Re(e).forEach(function (n) {
          o[n] = S(e[n], t)
        }),
      Re(r).forEach(function (n) {
        Lt(e, n) ||
          (Ee(e, n) && t.isMergeableObject(r[n])
            ? (o[n] = Nt(n, t)(e[n], r[n], t))
            : (o[n] = S(r[n], t)))
      }),
      o
    )
  }
  function A (e, r, t) {
    ;(t = t || {}),
      (t.arrayMerge = t.arrayMerge || It),
      (t.isMergeableObject = t.isMergeableObject || qt),
      (t.cloneUnlessOtherwiseSpecified = S)
    var o = Array.isArray(r),
      n = Array.isArray(e),
      s = o === n
    return s ? (o ? t.arrayMerge(e, r, t) : Dt(e, r, t)) : S(r, t)
  }
  A.all = function (r, t) {
    if (!Array.isArray(r)) throw new Error('first argument should be an array')
    return r.reduce(function (o, n) {
      return A(o, n, t)
    }, {})
  }
  var Vt = A
  Fe.exports = Vt
})
var Me = d((Mr, Ae) => {
  var Gt = ve()
  function Ut (e) {
    return Gt(
      {
        path: '',
        headers: {},
        params: {},
        query: {},
        lambda: { event: {}, context: {} }
      },
      e
    )
  }
  Ae.exports = { createContext: Ut }
})
var je = d((Sr, Se) => {
  function zt (e) {
    return typeof e == 'object' ? JSON.stringify(e) : e
  }
  function Wt (e) {
    let {
        isBase64Encoded: r = !1,
        statusCode: t = 200,
        headers: o = {},
        multiValueHeaders: n = {},
        body: s,
        html: i,
        json: c,
        xml: f
      } = typeof e == 'object' ? e : { body: e },
      p = 'text/html; charset=utf-8'
    return (
      c
        ? (p = 'application/json; charset=utf-8')
        : f && (p = 'application/xml; charset=utf-8'),
      {
        isBase64Encoded: r,
        statusCode: t,
        headers: w({ 'Content-Type': p }, o),
        multiValueHeaders: n,
        body: zt(s || i || c || f || '')
      }
    )
  }
  Se.exports = { normalizeResponse: Wt }
})
var Pe = d((jr, j) => {
  'use strict'
  var Yt = process.env.TERM_PROGRAM === 'Hyper',
    Ht = process.platform === 'win32',
    Be = process.platform === 'linux',
    W = {
      ballotDisabled: '\u2612',
      ballotOff: '\u2610',
      ballotOn: '\u2611',
      bullet: '\u2022',
      bulletWhite: '\u25E6',
      fullBlock: '\u2588',
      heart: '\u2764',
      identicalTo: '\u2261',
      line: '\u2500',
      mark: '\u203B',
      middot: '\xB7',
      minus: '\uFF0D',
      multiplication: '\xD7',
      obelus: '\xF7',
      pencilDownRight: '\u270E',
      pencilRight: '\u270F',
      pencilUpRight: '\u2710',
      percent: '%',
      pilcrow2: '\u2761',
      pilcrow: '\xB6',
      plusMinus: '\xB1',
      section: '\xA7',
      starsOff: '\u2606',
      starsOn: '\u2605',
      upDownArrow: '\u2195'
    },
    qe = Object.assign({}, W, {
      check: '\u221A',
      cross: '\xD7',
      ellipsisLarge: '...',
      ellipsis: '...',
      info: 'i',
      question: '?',
      questionSmall: '?',
      pointer: '>',
      pointerSmall: '\xBB',
      radioOff: '( )',
      radioOn: '(*)',
      warning: '\u203C'
    }),
    Te = Object.assign({}, W, {
      ballotCross: '\u2718',
      check: '\u2714',
      cross: '\u2716',
      ellipsisLarge: '\u22EF',
      ellipsis: '\u2026',
      info: '\u2139',
      question: '?',
      questionFull: '\uFF1F',
      questionSmall: '\uFE56',
      pointer: Be ? '\u25B8' : '\u276F',
      pointerSmall: Be ? '\u2023' : '\u203A',
      radioOff: '\u25EF',
      radioOn: '\u25C9',
      warning: '\u26A0'
    })
  j.exports = Ht && !Yt ? qe : Te
  Reflect.defineProperty(j.exports, 'common', { enumerable: !1, value: W })
  Reflect.defineProperty(j.exports, 'windows', { enumerable: !1, value: qe })
  Reflect.defineProperty(j.exports, 'other', { enumerable: !1, value: Te })
})
var ke = d((Br, Y) => {
  'use strict'
  var Jt = e => e !== null && typeof e == 'object' && !Array.isArray(e),
    Zt = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g,
    _e = () => {
      let e = { enabled: !0, visible: !0, styles: {}, keys: {} }
      'FORCE_COLOR' in process.env &&
        (e.enabled = process.env.FORCE_COLOR !== '0')
      let r = s => {
          let i = (s.open = `[${s.codes[0]}m`),
            c = (s.close = `[${s.codes[1]}m`),
            f = (s.regex = new RegExp(`\\u001b\\[${s.codes[1]}m`, 'g'))
          return (
            (s.wrap = (p, l) => {
              p.includes(c) && (p = p.replace(f, c + i))
              let a = i + p + c
              return l ? a.replace(/\r*\n/g, `${c}$&${i}`) : a
            }),
            s
          )
        },
        t = (s, i, c) => (typeof s == 'function' ? s(i) : s.wrap(i, c)),
        o = (s, i) => {
          if (s === '' || s == null) return ''
          if (e.enabled === !1) return s
          if (e.visible === !1) return ''
          let c = '' + s,
            f = c.includes(`
`),
            p = i.length
          for (
            p > 0 &&
            i.includes('unstyle') &&
            (i = [...new Set(['unstyle', ...i])].reverse());
            p-- > 0;

          )
            c = t(e.styles[i[p]], c, f)
          return c
        },
        n = (s, i, c) => {
          ;(e.styles[s] = r({ name: s, codes: i })),
            (e.keys[c] || (e.keys[c] = [])).push(s),
            Reflect.defineProperty(e, s, {
              configurable: !0,
              enumerable: !0,
              set (p) {
                e.alias(s, p)
              },
              get () {
                let p = l => o(l, p.stack)
                return (
                  Reflect.setPrototypeOf(p, e),
                  (p.stack = this.stack ? this.stack.concat(s) : [s]),
                  p
                )
              }
            })
        }
      return (
        n('reset', [0, 0], 'modifier'),
        n('bold', [1, 22], 'modifier'),
        n('dim', [2, 22], 'modifier'),
        n('italic', [3, 23], 'modifier'),
        n('underline', [4, 24], 'modifier'),
        n('inverse', [7, 27], 'modifier'),
        n('hidden', [8, 28], 'modifier'),
        n('strikethrough', [9, 29], 'modifier'),
        n('black', [30, 39], 'color'),
        n('red', [31, 39], 'color'),
        n('green', [32, 39], 'color'),
        n('yellow', [33, 39], 'color'),
        n('blue', [34, 39], 'color'),
        n('magenta', [35, 39], 'color'),
        n('cyan', [36, 39], 'color'),
        n('white', [37, 39], 'color'),
        n('gray', [90, 39], 'color'),
        n('grey', [90, 39], 'color'),
        n('bgBlack', [40, 49], 'bg'),
        n('bgRed', [41, 49], 'bg'),
        n('bgGreen', [42, 49], 'bg'),
        n('bgYellow', [43, 49], 'bg'),
        n('bgBlue', [44, 49], 'bg'),
        n('bgMagenta', [45, 49], 'bg'),
        n('bgCyan', [46, 49], 'bg'),
        n('bgWhite', [47, 49], 'bg'),
        n('blackBright', [90, 39], 'bright'),
        n('redBright', [91, 39], 'bright'),
        n('greenBright', [92, 39], 'bright'),
        n('yellowBright', [93, 39], 'bright'),
        n('blueBright', [94, 39], 'bright'),
        n('magentaBright', [95, 39], 'bright'),
        n('cyanBright', [96, 39], 'bright'),
        n('whiteBright', [97, 39], 'bright'),
        n('bgBlackBright', [100, 49], 'bgBright'),
        n('bgRedBright', [101, 49], 'bgBright'),
        n('bgGreenBright', [102, 49], 'bgBright'),
        n('bgYellowBright', [103, 49], 'bgBright'),
        n('bgBlueBright', [104, 49], 'bgBright'),
        n('bgMagentaBright', [105, 49], 'bgBright'),
        n('bgCyanBright', [106, 49], 'bgBright'),
        n('bgWhiteBright', [107, 49], 'bgBright'),
        (e.ansiRegex = Zt),
        (e.hasColor = e.hasAnsi = s => (
          (e.ansiRegex.lastIndex = 0),
          typeof s == 'string' && s !== '' && e.ansiRegex.test(s)
        )),
        (e.alias = (s, i) => {
          let c = typeof i == 'string' ? e[i] : i
          if (typeof c != 'function')
            throw new TypeError(
              'Expected alias to be the name of an existing color (string) or a function'
            )
          c.stack ||
            (Reflect.defineProperty(c, 'name', { value: s }),
            (e.styles[s] = c),
            (c.stack = [s])),
            Reflect.defineProperty(e, s, {
              configurable: !0,
              enumerable: !0,
              set (f) {
                e.alias(s, f)
              },
              get () {
                let f = p => o(p, f.stack)
                return (
                  Reflect.setPrototypeOf(f, e),
                  (f.stack = this.stack ? this.stack.concat(c.stack) : c.stack),
                  f
                )
              }
            })
        }),
        (e.theme = s => {
          if (!Jt(s)) throw new TypeError('Expected theme to be an object')
          for (let i of Object.keys(s)) e.alias(i, s[i])
          return e
        }),
        e.alias('unstyle', s =>
          typeof s == 'string' && s !== ''
            ? ((e.ansiRegex.lastIndex = 0), s.replace(e.ansiRegex, ''))
            : ''
        ),
        e.alias('noop', s => s),
        (e.none = e.clear = e.noop),
        (e.stripColor = e.unstyle),
        (e.symbols = Pe()),
        (e.define = n),
        e
      )
    }
  Y.exports = _e()
  Y.exports.create = _e
})
var $e = d((qr, Ie) => {
  var B = require('fs'),
    Kt = require('path'),
    Ne = process.env.PRESTA_ENV || 'production'
  function H (e, r) {
    Ne !== 'production' && B.writeFileSync(e, JSON.stringify(r), 'utf-8')
  }
  function Qt (e) {
    return Ne === 'production'
      ? {}
      : (B.existsSync(e) || B.writeFileSync(e, '{}', 'utf-8'),
        JSON.parse(B.readFileSync(e)))
  }
  function Xt (e, { dir: r = process.cwd() } = {}) {
    let t = '.' + e,
      o = Kt.join(r, t),
      n = Qt(o)
    return {
      get (s) {
        let [i, c] = n[s] || []
        if (c !== null && Date.now() > c) {
          delete n[s], H(o, n)
          return
        } else return i
      },
      set (s, i, c) {
        let f = c ? Date.now() + c : null
        ;(n[s] = [i, f]), f && H(o, n)
      },
      clear (s) {
        delete n[s], H(o, n)
      },
      clearAllMemory () {
        for (let s of Object.keys(n)) {
          let [i, c] = n[s] || []
          c || delete n[s]
        }
      },
      cleanup () {
        n = {}
        try {
          B.unlinkSync(o)
        } catch (s) {}
      },
      dump () {
        let s = {}
        for (let i of Object.keys(n)) s[i] = n[i][0]
        return s
      }
    }
  }
  Ie.exports = { createCache: Xt }
})
var Ge = d((Tr, Le) => {
  var er = ke(),
    { createCache: tr } = $e(),
    { NODE_ENV: rr } = process.env,
    M = {},
    J = {},
    x = tr('presta-load-cache')
  function nr (e) {
    rr !== 'test' && console.log(e)
  }
  function De (e, r) {
    nr(`
  ${er.red('error')} load { ${e} }

${r}
`),
      (J[e] = r),
      delete M[e]
  }
  function sr (e, r, t) {
    x.set(e, r, t)
  }
  async function or (e, { key: r, duration: t }) {
    let o = x.get(r)
    return o || ((o = await e()), x.set(r, o, t)), o
  }
  function ir (e, { key: r, duration: t }) {
    let o = x.get(r)
    if (!o && !J[r])
      try {
        ;(M[r] = e()),
          M[r]
            .then(n => {
              x.set(r, n, t), delete M[r]
            })
            .catch(n => De(r, n))
      } catch (n) {
        De(r, n)
      }
    return delete J[r], o
  }
  async function Ve (e, r = {}) {
    let t = e()
    return Object.keys(M).length
      ? (await Promise.allSettled(Object.values(M)), Ve(e, r))
      : { content: t, data: x.dump() }
  }
  Le.exports = { loadCache: x, prime: sr, cache: or, load: ir, flush: Ve }
})
var We = d((Pr, Ue) => {
  var { debug: Z } = me(),
    { getRouteParams: cr } = we(),
    { default404: lr } = xe(),
    { createContext: ar } = Me(),
    { normalizeResponse: ze } = je(),
    { loadCache: ur } = Ge()
  function fr (e, r) {
    return async (t, o) => {
      Z('received event', t)
      let n = e(t.path)
      if (!n)
        return (
          Z('handler', 'fallback to default 404'),
          ze({ statusCode: 404, body: lr })
        )
      let s = ar({
        path: t.path,
        method: t.httpMethod,
        headers: w(w({}, t.headers), t.multiValueHeaders),
        body: t.body,
        params: cr(t.path, n.route),
        query: w(
          w({}, t.queryStringParameters),
          t.multiValueQueryStringParameters
        ),
        lambda: { event: t, context: o }
      })
      Z('presta serverless context', s)
      let i = ze(await n.handler(s))
      return ur.clearAllMemory(), i
    }
  }
  Ue.exports = { createHandler: fr }
})
var { createRouter: pr } = oe(),
  { createHandler: dr } = We()
module.exports = { createRouter: pr, createHandler: dr }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL3JvdXRlLXNvcnQvZGlzdC9yc29ydC5qcyIsICJub2RlX21vZHVsZXMvcmVnZXhwYXJhbS9kaXN0L3JlZ2V4cGFyYW0uanMiLCAibGliL3JvdXRlci5qcyIsICJub2RlX21vZHVsZXMvbXMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9jb21tb24uanMiLCAibm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzIiwgIm5vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvc3VwcG9ydHMtY29sb3IvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzIiwgIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvaW5kZXguanMiLCAibGliL2RlYnVnLmpzIiwgImxpYi9nZXRSb3V0ZVBhcmFtcy5qcyIsICJsaWIvZGVmYXVsdDQwNC5qcyIsICJub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwgImxpYi9jcmVhdGVDb250ZXh0LmpzIiwgImxpYi9ub3JtYWxpemVSZXNwb25zZS5qcyIsICJub2RlX21vZHVsZXMvYW5zaS1jb2xvcnMvc3ltYm9scy5qcyIsICJub2RlX21vZHVsZXMvYW5zaS1jb2xvcnMvaW5kZXguanMiLCAibGliL2xvYWRDYWNoZS5qcyIsICJsaWIvbG9hZC5qcyIsICJsaWIvaGFuZGxlci5qcyIsICJsaWIvdXRpbHMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImZ1bmN0aW9uIHRvVmFsdWUoc3RyKSB7XG5cdGlmIChzdHIgPT0gJyonKSByZXR1cm4gMWUxMTsgLy8gd2lsZFxuXHRpZiAoL15cXDooLiopXFw/Ly50ZXN0KHN0cikpIHJldHVybiAxMTExOyAvLyBwYXJhbSBvcHRpb25hbFxuXHRpZiAoL15cXDooLiopXFwuLy50ZXN0KHN0cikpIHJldHVybiAxMTsgLy8gcGFyYW0gdy8gc3VmZml4XG5cdGlmICgvXlxcOi8udGVzdChzdHIpKSByZXR1cm4gMTExOyAvLyBwYXJhbVxuXHRyZXR1cm4gMTsgLy8gc3RhdGljXG59XG5cbmZ1bmN0aW9uIHRvUmFuayhzdHIpIHtcblx0dmFyIGk9MCwgb3V0PScnLCBhcnI9c3RyLnNwbGl0KCcvJyk7XG5cdGZvciAoOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBvdXQgKz0gdG9WYWx1ZShhcnJbaV0pO1xuXHRyZXR1cm4gKGkgLSAxKS8rb3V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcnIsIGNhY2hlKSB7XG5cdGNhY2hlID0ge307XG5cdHJldHVybiBhcnIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdHJldHVybiAoY2FjaGVbYl0gPSBjYWNoZVtiXSB8fCB0b1JhbmsoYikpIC0gKGNhY2hlW2FdID0gY2FjaGVbYV0gfHwgdG9SYW5rKGEpKTtcblx0fSk7XG59XG4iLCAibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyLCBsb29zZSkge1xuXHRpZiAoc3RyIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4geyBrZXlzOmZhbHNlLCBwYXR0ZXJuOnN0ciB9O1xuXHR2YXIgYywgbywgdG1wLCBleHQsIGtleXM9W10sIHBhdHRlcm49JycsIGFyciA9IHN0ci5zcGxpdCgnLycpO1xuXHRhcnJbMF0gfHwgYXJyLnNoaWZ0KCk7XG5cblx0d2hpbGUgKHRtcCA9IGFyci5zaGlmdCgpKSB7XG5cdFx0YyA9IHRtcFswXTtcblx0XHRpZiAoYyA9PT0gJyonKSB7XG5cdFx0XHRrZXlzLnB1c2goJ3dpbGQnKTtcblx0XHRcdHBhdHRlcm4gKz0gJy8oLiopJztcblx0XHR9IGVsc2UgaWYgKGMgPT09ICc6Jykge1xuXHRcdFx0byA9IHRtcC5pbmRleE9mKCc/JywgMSk7XG5cdFx0XHRleHQgPSB0bXAuaW5kZXhPZignLicsIDEpO1xuXHRcdFx0a2V5cy5wdXNoKCB0bXAuc3Vic3RyaW5nKDEsICEhfm8gPyBvIDogISF+ZXh0ID8gZXh0IDogdG1wLmxlbmd0aCkgKTtcblx0XHRcdHBhdHRlcm4gKz0gISF+byAmJiAhfmV4dCA/ICcoPzovKFteL10rPykpPycgOiAnLyhbXi9dKz8pJztcblx0XHRcdGlmICghIX5leHQpIHBhdHRlcm4gKz0gKCEhfm8gPyAnPycgOiAnJykgKyAnXFxcXCcgKyB0bXAuc3Vic3RyaW5nKGV4dCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhdHRlcm4gKz0gJy8nICsgdG1wO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0a2V5czoga2V5cyxcblx0XHRwYXR0ZXJuOiBuZXcgUmVnRXhwKCdeJyArIHBhdHRlcm4gKyAobG9vc2UgPyAnKD89JHxcXC8pJyA6ICdcXC8/JCcpLCAnaScpXG5cdH07XG59XG4iLCAibGV0IHJzb3J0ID0gcmVxdWlyZSgncm91dGUtc29ydCcpXG5sZXQgdG9SZWdFeHAgPSByZXF1aXJlKCdyZWdleHBhcmFtJylcblxucnNvcnQgPSByc29ydC5kZWZhdWx0IHx8IHJzb3J0XG50b1JlZ0V4cCA9IHRvUmVnRXhwLmRlZmF1bHQgfHwgdG9SZWdFeHBcblxuLyoqXG4gKiBUaGlzIGlzIHVzZWQgKndpdGhpbiogdGhlIGdlbmVyYXRlZCBkeW5hbWljIGVudHJ5IGZpbGVcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWtlZWQvcmVnZXhwYXJhbSN1c2FnZVxuICovXG5mdW5jdGlvbiBjcmVhdGVSb3V0ZXIgKGZpbGVzLCBjb25maWcpIHtcbiAgLy8gZ2V0IHJvdXRlIHBhdGhzXG4gIGNvbnN0IHJvdXRlcyA9IHJzb3J0KGZpbGVzLm1hcChwID0+IHAucm91dGUpKVxuXG4gIC8vIGluIG9yZGVyLCBjcmVhdGUgbWF0Y2hlciBhbmQgYXNzb2NpYXRlIHBhZ2VcbiAgY29uc3QgcHJlcGFyZWRSb3V0ZXMgPSByb3V0ZXMubWFwKHJvdXRlID0+IFtcbiAgICB0b1JlZ0V4cChyb3V0ZSksXG4gICAgZmlsZXMuZmluZChwID0+IHAucm91dGUgPT09IHJvdXRlKVxuICBdKVxuXG4gIHJldHVybiB1cmwgPT4ge1xuICAgIGZvciAoY29uc3QgW3sgcGF0dGVybiB9LCBwYWdlXSBvZiBwcmVwYXJlZFJvdXRlcykge1xuICAgICAgaWYgKHBhdHRlcm4udGVzdCh1cmwuc3BsaXQoJz8nKVswXSkpIHJldHVybiBwYWdlXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBjcmVhdGVSb3V0ZXIgfVxuIiwgIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigtPyg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwgIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwKGVudikge1xuXHRjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnO1xuXHRjcmVhdGVEZWJ1Zy5kZWZhdWx0ID0gY3JlYXRlRGVidWc7XG5cdGNyZWF0ZURlYnVnLmNvZXJjZSA9IGNvZXJjZTtcblx0Y3JlYXRlRGVidWcuZGlzYWJsZSA9IGRpc2FibGU7XG5cdGNyZWF0ZURlYnVnLmVuYWJsZSA9IGVuYWJsZTtcblx0Y3JlYXRlRGVidWcuZW5hYmxlZCA9IGVuYWJsZWQ7XG5cdGNyZWF0ZURlYnVnLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuXHRPYmplY3Qua2V5cyhlbnYpLmZvckVhY2goa2V5ID0+IHtcblx0XHRjcmVhdGVEZWJ1Z1trZXldID0gZW52W2tleV07XG5cdH0pO1xuXG5cdC8qKlxuXHQqIEFjdGl2ZSBgZGVidWdgIGluc3RhbmNlcy5cblx0Ki9cblx0Y3JlYXRlRGVidWcuaW5zdGFuY2VzID0gW107XG5cblx0LyoqXG5cdCogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG5cdCovXG5cblx0Y3JlYXRlRGVidWcubmFtZXMgPSBbXTtcblx0Y3JlYXRlRGVidWcuc2tpcHMgPSBbXTtcblxuXHQvKipcblx0KiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG5cdCpcblx0KiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG5cdCovXG5cdGNyZWF0ZURlYnVnLmZvcm1hdHRlcnMgPSB7fTtcblxuXHQvKipcblx0KiBTZWxlY3RzIGEgY29sb3IgZm9yIGEgZGVidWcgbmFtZXNwYWNlXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSBUaGUgbmFtZXNwYWNlIHN0cmluZyBmb3IgdGhlIGZvciB0aGUgZGVidWcgaW5zdGFuY2UgdG8gYmUgY29sb3JlZFxuXHQqIEByZXR1cm4ge051bWJlcnxTdHJpbmd9IEFuIEFOU0kgY29sb3IgY29kZSBmb3IgdGhlIGdpdmVuIG5hbWVzcGFjZVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcblx0XHRsZXQgaGFzaCA9IDA7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzcGFjZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuXHRcdH1cblxuXHRcdHJldHVybiBjcmVhdGVEZWJ1Zy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBjcmVhdGVEZWJ1Zy5jb2xvcnMubGVuZ3RoXTtcblx0fVxuXHRjcmVhdGVEZWJ1Zy5zZWxlY3RDb2xvciA9IHNlbGVjdENvbG9yO1xuXG5cdC8qKlxuXHQqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuXHQqIEByZXR1cm4ge0Z1bmN0aW9ufVxuXHQqIEBhcGkgcHVibGljXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXHRcdGxldCBwcmV2VGltZTtcblxuXHRcdGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3MpIHtcblx0XHRcdC8vIERpc2FibGVkP1xuXHRcdFx0aWYgKCFkZWJ1Zy5lbmFibGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VsZiA9IGRlYnVnO1xuXG5cdFx0XHQvLyBTZXQgYGRpZmZgIHRpbWVzdGFtcFxuXHRcdFx0Y29uc3QgY3VyciA9IE51bWJlcihuZXcgRGF0ZSgpKTtcblx0XHRcdGNvbnN0IG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcblx0XHRcdHNlbGYuZGlmZiA9IG1zO1xuXHRcdFx0c2VsZi5wcmV2ID0gcHJldlRpbWU7XG5cdFx0XHRzZWxmLmN1cnIgPSBjdXJyO1xuXHRcdFx0cHJldlRpbWUgPSBjdXJyO1xuXG5cdFx0XHRhcmdzWzBdID0gY3JlYXRlRGVidWcuY29lcmNlKGFyZ3NbMF0pO1xuXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdC8vIEFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVPXG5cdFx0XHRcdGFyZ3MudW5zaGlmdCgnJU8nKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcblx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgKG1hdGNoLCBmb3JtYXQpID0+IHtcblx0XHRcdFx0Ly8gSWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuXHRcdFx0XHRpZiAobWF0Y2ggPT09ICclJScpIHtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHRcdH1cblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0Y29uc3QgZm9ybWF0dGVyID0gY3JlYXRlRGVidWcuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXHRcdFx0XHRpZiAodHlwZW9mIGZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IGFyZ3NbaW5kZXhdO1xuXHRcdFx0XHRcdG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuXHRcdFx0XHRcdC8vIE5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcblx0XHRcdFx0XHRhcmdzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0aW5kZXgtLTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblx0XHRcdGNyZWF0ZURlYnVnLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuXHRcdFx0Y29uc3QgbG9nRm4gPSBzZWxmLmxvZyB8fCBjcmVhdGVEZWJ1Zy5sb2c7XG5cdFx0XHRsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cdFx0ZGVidWcuZW5hYmxlZCA9IGNyZWF0ZURlYnVnLmVuYWJsZWQobmFtZXNwYWNlKTtcblx0XHRkZWJ1Zy51c2VDb2xvcnMgPSBjcmVhdGVEZWJ1Zy51c2VDb2xvcnMoKTtcblx0XHRkZWJ1Zy5jb2xvciA9IHNlbGVjdENvbG9yKG5hbWVzcGFjZSk7XG5cdFx0ZGVidWcuZGVzdHJveSA9IGRlc3Ryb3k7XG5cdFx0ZGVidWcuZXh0ZW5kID0gZXh0ZW5kO1xuXHRcdC8vIERlYnVnLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuXHRcdC8vIGRlYnVnLnJhd0xvZyA9IHJhd0xvZztcblxuXHRcdC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG5cdFx0aWYgKHR5cGVvZiBjcmVhdGVEZWJ1Zy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjcmVhdGVEZWJ1Zy5pbml0KGRlYnVnKTtcblx0XHR9XG5cblx0XHRjcmVhdGVEZWJ1Zy5pbnN0YW5jZXMucHVzaChkZWJ1Zyk7XG5cblx0XHRyZXR1cm4gZGVidWc7XG5cdH1cblxuXHRmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdGNvbnN0IGluZGV4ID0gY3JlYXRlRGVidWcuaW5zdGFuY2VzLmluZGV4T2YodGhpcyk7XG5cdFx0aWYgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0Y3JlYXRlRGVidWcuaW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKG5hbWVzcGFjZSwgZGVsaW1pdGVyKSB7XG5cdFx0Y29uc3QgbmV3RGVidWcgPSBjcmVhdGVEZWJ1Zyh0aGlzLm5hbWVzcGFjZSArICh0eXBlb2YgZGVsaW1pdGVyID09PSAndW5kZWZpbmVkJyA/ICc6JyA6IGRlbGltaXRlcikgKyBuYW1lc3BhY2UpO1xuXHRcdG5ld0RlYnVnLmxvZyA9IHRoaXMubG9nO1xuXHRcdHJldHVybiBuZXdEZWJ1Zztcblx0fVxuXG5cdC8qKlxuXHQqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcblx0KiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuXHRcdGNyZWF0ZURlYnVnLnNhdmUobmFtZXNwYWNlcyk7XG5cblx0XHRjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuXHRcdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0XHRsZXQgaTtcblx0XHRjb25zdCBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpLnNwbGl0KC9bXFxzLF0rLyk7XG5cdFx0Y29uc3QgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoIXNwbGl0W2ldKSB7XG5cdFx0XHRcdC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcblxuXHRcdFx0aWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuXHRcdFx0XHRjcmVhdGVEZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyZWF0ZURlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGNyZWF0ZURlYnVnLmluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgaW5zdGFuY2UgPSBjcmVhdGVEZWJ1Zy5pbnN0YW5jZXNbaV07XG5cdFx0XHRpbnN0YW5jZS5lbmFibGVkID0gY3JlYXRlRGVidWcuZW5hYmxlZChpbnN0YW5jZS5uYW1lc3BhY2UpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuXHQqXG5cdCogQHJldHVybiB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZGlzYWJsZSgpIHtcblx0XHRjb25zdCBuYW1lc3BhY2VzID0gW1xuXHRcdFx0Li4uY3JlYXRlRGVidWcubmFtZXMubWFwKHRvTmFtZXNwYWNlKSxcblx0XHRcdC4uLmNyZWF0ZURlYnVnLnNraXBzLm1hcCh0b05hbWVzcGFjZSkubWFwKG5hbWVzcGFjZSA9PiAnLScgKyBuYW1lc3BhY2UpXG5cdFx0XS5qb2luKCcsJyk7XG5cdFx0Y3JlYXRlRGVidWcuZW5hYmxlKCcnKTtcblx0XHRyZXR1cm4gbmFtZXNwYWNlcztcblx0fVxuXG5cdC8qKlxuXHQqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG5cdCogQHJldHVybiB7Qm9vbGVhbn1cblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcblx0XHRpZiAobmFtZVtuYW1lLmxlbmd0aCAtIDFdID09PSAnKicpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGxldCBpO1xuXHRcdGxldCBsZW47XG5cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjcmVhdGVEZWJ1Zy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGNyZWF0ZURlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoY3JlYXRlRGVidWcubmFtZXNbaV0udGVzdChuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0KiBDb252ZXJ0IHJlZ2V4cCB0byBuYW1lc3BhY2Vcblx0KlxuXHQqIEBwYXJhbSB7UmVnRXhwfSByZWd4ZXBcblx0KiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiB0b05hbWVzcGFjZShyZWdleHApIHtcblx0XHRyZXR1cm4gcmVnZXhwLnRvU3RyaW5nKClcblx0XHRcdC5zdWJzdHJpbmcoMiwgcmVnZXhwLnRvU3RyaW5nKCkubGVuZ3RoIC0gMilcblx0XHRcdC5yZXBsYWNlKC9cXC5cXCpcXD8kLywgJyonKTtcblx0fVxuXG5cdC8qKlxuXHQqIENvZXJjZSBgdmFsYC5cblx0KlxuXHQqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuXHQqIEByZXR1cm4ge01peGVkfVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiBjb2VyY2UodmFsKSB7XG5cdFx0aWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRyZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsO1xuXHR9XG5cblx0Y3JlYXRlRGVidWcuZW5hYmxlKGNyZWF0ZURlYnVnLmxvYWQoKSk7XG5cblx0cmV0dXJuIGNyZWF0ZURlYnVnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwO1xuIiwgIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqL1xuXG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuXHQnIzAwMDBDQycsXG5cdCcjMDAwMEZGJyxcblx0JyMwMDMzQ0MnLFxuXHQnIzAwMzNGRicsXG5cdCcjMDA2NkNDJyxcblx0JyMwMDY2RkYnLFxuXHQnIzAwOTlDQycsXG5cdCcjMDA5OUZGJyxcblx0JyMwMENDMDAnLFxuXHQnIzAwQ0MzMycsXG5cdCcjMDBDQzY2Jyxcblx0JyMwMENDOTknLFxuXHQnIzAwQ0NDQycsXG5cdCcjMDBDQ0ZGJyxcblx0JyMzMzAwQ0MnLFxuXHQnIzMzMDBGRicsXG5cdCcjMzMzM0NDJyxcblx0JyMzMzMzRkYnLFxuXHQnIzMzNjZDQycsXG5cdCcjMzM2NkZGJyxcblx0JyMzMzk5Q0MnLFxuXHQnIzMzOTlGRicsXG5cdCcjMzNDQzAwJyxcblx0JyMzM0NDMzMnLFxuXHQnIzMzQ0M2NicsXG5cdCcjMzNDQzk5Jyxcblx0JyMzM0NDQ0MnLFxuXHQnIzMzQ0NGRicsXG5cdCcjNjYwMENDJyxcblx0JyM2NjAwRkYnLFxuXHQnIzY2MzNDQycsXG5cdCcjNjYzM0ZGJyxcblx0JyM2NkNDMDAnLFxuXHQnIzY2Q0MzMycsXG5cdCcjOTkwMENDJyxcblx0JyM5OTAwRkYnLFxuXHQnIzk5MzNDQycsXG5cdCcjOTkzM0ZGJyxcblx0JyM5OUNDMDAnLFxuXHQnIzk5Q0MzMycsXG5cdCcjQ0MwMDAwJyxcblx0JyNDQzAwMzMnLFxuXHQnI0NDMDA2NicsXG5cdCcjQ0MwMDk5Jyxcblx0JyNDQzAwQ0MnLFxuXHQnI0NDMDBGRicsXG5cdCcjQ0MzMzAwJyxcblx0JyNDQzMzMzMnLFxuXHQnI0NDMzM2NicsXG5cdCcjQ0MzMzk5Jyxcblx0JyNDQzMzQ0MnLFxuXHQnI0NDMzNGRicsXG5cdCcjQ0M2NjAwJyxcblx0JyNDQzY2MzMnLFxuXHQnI0NDOTkwMCcsXG5cdCcjQ0M5OTMzJyxcblx0JyNDQ0NDMDAnLFxuXHQnI0NDQ0MzMycsXG5cdCcjRkYwMDAwJyxcblx0JyNGRjAwMzMnLFxuXHQnI0ZGMDA2NicsXG5cdCcjRkYwMDk5Jyxcblx0JyNGRjAwQ0MnLFxuXHQnI0ZGMDBGRicsXG5cdCcjRkYzMzAwJyxcblx0JyNGRjMzMzMnLFxuXHQnI0ZGMzM2NicsXG5cdCcjRkYzMzk5Jyxcblx0JyNGRjMzQ0MnLFxuXHQnI0ZGMzNGRicsXG5cdCcjRkY2NjAwJyxcblx0JyNGRjY2MzMnLFxuXHQnI0ZGOTkwMCcsXG5cdCcjRkY5OTMzJyxcblx0JyNGRkNDMDAnLFxuXHQnI0ZGQ0MzMydcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcblx0Ly8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuXHQvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuXHQvLyBleHBsaWNpdGx5XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiAod2luZG93LnByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCB3aW5kb3cucHJvY2Vzcy5fX253anMpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBJbnRlcm5ldCBFeHBsb3JlciBhbmQgRWRnZSBkbyBub3Qgc3VwcG9ydCBjb2xvcnMuXG5cdGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvKGVkZ2V8dHJpZGVudClcXC8oXFxkKykvKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG5cdC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG5cdHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlKSB8fFxuXHRcdC8vIElzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcblx0XHQodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgKHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkpKSB8fFxuXHRcdC8vIElzIGZpcmVmb3ggPj0gdjMxP1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuXHRcdCh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuXHRcdC8vIERvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcblx0XHQodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuXHRhcmdzWzBdID0gKHRoaXMudXNlQ29sb3JzID8gJyVjJyA6ICcnKSArXG5cdFx0dGhpcy5uYW1lc3BhY2UgK1xuXHRcdCh0aGlzLnVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKSArXG5cdFx0YXJnc1swXSArXG5cdFx0KHRoaXMudXNlQ29sb3JzID8gJyVjICcgOiAnICcpICtcblx0XHQnKycgKyBtb2R1bGUuZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG5cdGlmICghdGhpcy51c2VDb2xvcnMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcblx0YXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0Jyk7XG5cblx0Ly8gVGhlIGZpbmFsIFwiJWNcIiBpcyBzb21ld2hhdCB0cmlja3ksIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb3RoZXJcblx0Ly8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuXHQvLyBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGluZGV4IHRvIGluc2VydCB0aGUgQ1NTIGludG9cblx0bGV0IGluZGV4ID0gMDtcblx0bGV0IGxhc3RDID0gMDtcblx0YXJnc1swXS5yZXBsYWNlKC8lW2EtekEtWiVdL2csIG1hdGNoID0+IHtcblx0XHRpZiAobWF0Y2ggPT09ICclJScpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aW5kZXgrKztcblx0XHRpZiAobWF0Y2ggPT09ICclYycpIHtcblx0XHRcdC8vIFdlIG9ubHkgYXJlIGludGVyZXN0ZWQgaW4gdGhlICpsYXN0KiAlY1xuXHRcdFx0Ly8gKHRoZSB1c2VyIG1heSBoYXZlIHByb3ZpZGVkIHRoZWlyIG93bilcblx0XHRcdGxhc3RDID0gaW5kZXg7XG5cdFx0fVxuXHR9KTtcblxuXHRhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG59XG5cbi8qKlxuICogSW52b2tlcyBgY29uc29sZS5sb2coKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmxvZ2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIGxvZyguLi5hcmdzKSB7XG5cdC8vIFRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG5cdC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG5cdHJldHVybiB0eXBlb2YgY29uc29sZSA9PT0gJ29iamVjdCcgJiZcblx0XHRjb25zb2xlLmxvZyAmJlxuXHRcdGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG5cdHRyeSB7XG5cdFx0aWYgKG5hbWVzcGFjZXMpIHtcblx0XHRcdGV4cG9ydHMuc3RvcmFnZS5zZXRJdGVtKCdkZWJ1ZycsIG5hbWVzcGFjZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGxvYWQoKSB7XG5cdGxldCByO1xuXHR0cnkge1xuXHRcdHIgPSBleHBvcnRzLnN0b3JhZ2UuZ2V0SXRlbSgnZGVidWcnKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cblxuXHQvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG5cdGlmICghciAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuXHRcdHIgPSBwcm9jZXNzLmVudi5ERUJVRztcblx0fVxuXG5cdHJldHVybiByO1xufVxuXG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvY2Fsc3RvcmFnZSgpIHtcblx0dHJ5IHtcblx0XHQvLyBUVk1MS2l0IChBcHBsZSBUViBKUyBSdW50aW1lKSBkb2VzIG5vdCBoYXZlIGEgd2luZG93IG9iamVjdCwganVzdCBsb2NhbFN0b3JhZ2UgaW4gdGhlIGdsb2JhbCBjb250ZXh0XG5cdFx0Ly8gVGhlIEJyb3dzZXIgYWxzbyBoYXMgbG9jYWxTdG9yYWdlIGluIHRoZSBnbG9iYWwgY29udGV4dC5cblx0XHRyZXR1cm4gbG9jYWxTdG9yYWdlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFN3YWxsb3dcblx0XHQvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tbW9uJykoZXhwb3J0cyk7XG5cbmNvbnN0IHtmb3JtYXR0ZXJzfSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbiAodikge1xuXHR0cnkge1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh2KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyb3IubWVzc2FnZTtcblx0fVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IChmbGFnLCBhcmd2KSA9PiB7XG5cdGFyZ3YgPSBhcmd2IHx8IHByb2Nlc3MuYXJndjtcblx0Y29uc3QgcHJlZml4ID0gZmxhZy5zdGFydHNXaXRoKCctJykgPyAnJyA6IChmbGFnLmxlbmd0aCA9PT0gMSA/ICctJyA6ICctLScpO1xuXHRjb25zdCBwb3MgPSBhcmd2LmluZGV4T2YocHJlZml4ICsgZmxhZyk7XG5cdGNvbnN0IHRlcm1pbmF0b3JQb3MgPSBhcmd2LmluZGV4T2YoJy0tJyk7XG5cdHJldHVybiBwb3MgIT09IC0xICYmICh0ZXJtaW5hdG9yUG9zID09PSAtMSA/IHRydWUgOiBwb3MgPCB0ZXJtaW5hdG9yUG9zKTtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3QgaGFzRmxhZyA9IHJlcXVpcmUoJ2hhcy1mbGFnJyk7XG5cbmNvbnN0IGVudiA9IHByb2Nlc3MuZW52O1xuXG5sZXQgZm9yY2VDb2xvcjtcbmlmIChoYXNGbGFnKCduby1jb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ25vLWNvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPWZhbHNlJykpIHtcblx0Zm9yY2VDb2xvciA9IGZhbHNlO1xufSBlbHNlIGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPXRydWUnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRmb3JjZUNvbG9yID0gdHJ1ZTtcbn1cbmlmICgnRk9SQ0VfQ09MT1InIGluIGVudikge1xuXHRmb3JjZUNvbG9yID0gZW52LkZPUkNFX0NPTE9SLmxlbmd0aCA9PT0gMCB8fCBwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcblx0aWYgKGxldmVsID09PSAwKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZXZlbCxcblx0XHRoYXNCYXNpYzogdHJ1ZSxcblx0XHRoYXMyNTY6IGxldmVsID49IDIsXG5cdFx0aGFzMTZtOiBsZXZlbCA+PSAzXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29sb3Ioc3RyZWFtKSB7XG5cdGlmIChmb3JjZUNvbG9yID09PSBmYWxzZSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZnVsbCcpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZWNvbG9yJykpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0yNTYnKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKHN0cmVhbSAmJiAhc3RyZWFtLmlzVFRZICYmIGZvcmNlQ29sb3IgIT09IHRydWUpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGNvbnN0IG1pbiA9IGZvcmNlQ29sb3IgPyAxIDogMDtcblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdC8vIE5vZGUuanMgNy41LjAgaXMgdGhlIGZpcnN0IHZlcnNpb24gb2YgTm9kZS5qcyB0byBpbmNsdWRlIGEgcGF0Y2ggdG9cblx0XHQvLyBsaWJ1diB0aGF0IGVuYWJsZXMgMjU2IGNvbG9yIG91dHB1dCBvbiBXaW5kb3dzLiBBbnl0aGluZyBlYXJsaWVyIGFuZCBpdFxuXHRcdC8vIHdvbid0IHdvcmsuIEhvd2V2ZXIsIGhlcmUgd2UgdGFyZ2V0IE5vZGUuanMgOCBhdCBtaW5pbXVtIGFzIGl0IGlzIGFuIExUU1xuXHRcdC8vIHJlbGVhc2UsIGFuZCBOb2RlLmpzIDcgaXMgbm90LiBXaW5kb3dzIDEwIGJ1aWxkIDEwNTg2IGlzIHRoZSBmaXJzdCBXaW5kb3dzXG5cdFx0Ly8gcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDI1NiBjb2xvcnMuIFdpbmRvd3MgMTAgYnVpbGQgMTQ5MzEgaXMgdGhlIGZpcnN0IHJlbGVhc2Vcblx0XHQvLyB0aGF0IHN1cHBvcnRzIDE2bS9UcnVlQ29sb3IuXG5cdFx0Y29uc3Qgb3NSZWxlYXNlID0gb3MucmVsZWFzZSgpLnNwbGl0KCcuJyk7XG5cdFx0aWYgKFxuXHRcdFx0TnVtYmVyKHByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpWzBdKSA+PSA4ICYmXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzBdKSA+PSAxMCAmJlxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODZcblx0XHQpIHtcblx0XHRcdHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDSScgaW4gZW52KSB7XG5cdFx0aWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSSddLnNvbWUoc2lnbiA9PiBzaWduIGluIGVudikgfHwgZW52LkNJX05BTUUgPT09ICdjb2Rlc2hpcCcpIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRpZiAoJ1RFQU1DSVRZX1ZFUlNJT04nIGluIGVudikge1xuXHRcdHJldHVybiAvXig5XFwuKDAqWzEtOV1cXGQqKVxcLnxcXGR7Mix9XFwuKS8udGVzdChlbnYuVEVBTUNJVFlfVkVSU0lPTikgPyAxIDogMDtcblx0fVxuXG5cdGlmIChlbnYuQ09MT1JURVJNID09PSAndHJ1ZWNvbG9yJykge1xuXHRcdHJldHVybiAzO1xuXHR9XG5cblx0aWYgKCdURVJNX1BST0dSQU0nIGluIGVudikge1xuXHRcdGNvbnN0IHZlcnNpb24gPSBwYXJzZUludCgoZW52LlRFUk1fUFJPR1JBTV9WRVJTSU9OIHx8ICcnKS5zcGxpdCgnLicpWzBdLCAxMCk7XG5cblx0XHRzd2l0Y2ggKGVudi5URVJNX1BST0dSQU0pIHtcblx0XHRcdGNhc2UgJ2lUZXJtLmFwcCc6XG5cdFx0XHRcdHJldHVybiB2ZXJzaW9uID49IDMgPyAzIDogMjtcblx0XHRcdGNhc2UgJ0FwcGxlX1Rlcm1pbmFsJzpcblx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHQvLyBObyBkZWZhdWx0XG5cdFx0fVxuXHR9XG5cblx0aWYgKC8tMjU2KGNvbG9yKT8kL2kudGVzdChlbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXG5cdGlmICgvXnNjcmVlbnxeeHRlcm18XnZ0MTAwfF52dDIyMHxecnh2dHxjb2xvcnxhbnNpfGN5Z3dpbnxsaW51eC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoJ0NPTE9SVEVSTScgaW4gZW52KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoZW52LlRFUk0gPT09ICdkdW1iJykge1xuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRyZXR1cm4gbWluO1xufVxuXG5mdW5jdGlvbiBnZXRTdXBwb3J0TGV2ZWwoc3RyZWFtKSB7XG5cdGNvbnN0IGxldmVsID0gc3VwcG9ydHNDb2xvcihzdHJlYW0pO1xuXHRyZXR1cm4gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3VwcG9ydHNDb2xvcjogZ2V0U3VwcG9ydExldmVsLFxuXHRzdGRvdXQ6IGdldFN1cHBvcnRMZXZlbChwcm9jZXNzLnN0ZG91dCksXG5cdHN0ZGVycjogZ2V0U3VwcG9ydExldmVsKHByb2Nlc3Muc3RkZXJyKVxufTtcbiIsICIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuY29uc3QgdHR5ID0gcmVxdWlyZSgndHR5Jyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICovXG5cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFs2LCAyLCAzLCA0LCA1LCAxXTtcblxudHJ5IHtcblx0Ly8gT3B0aW9uYWwgZGVwZW5kZW5jeSAoYXMgaW4sIGRvZXNuJ3QgbmVlZCB0byBiZSBpbnN0YWxsZWQsIE5PVCBsaWtlIG9wdGlvbmFsRGVwZW5kZW5jaWVzIGluIHBhY2thZ2UuanNvbilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXHRjb25zdCBzdXBwb3J0c0NvbG9yID0gcmVxdWlyZSgnc3VwcG9ydHMtY29sb3InKTtcblxuXHRpZiAoc3VwcG9ydHNDb2xvciAmJiAoc3VwcG9ydHNDb2xvci5zdGRlcnIgfHwgc3VwcG9ydHNDb2xvcikubGV2ZWwgPj0gMikge1xuXHRcdGV4cG9ydHMuY29sb3JzID0gW1xuXHRcdFx0MjAsXG5cdFx0XHQyMSxcblx0XHRcdDI2LFxuXHRcdFx0MjcsXG5cdFx0XHQzMixcblx0XHRcdDMzLFxuXHRcdFx0MzgsXG5cdFx0XHQzOSxcblx0XHRcdDQwLFxuXHRcdFx0NDEsXG5cdFx0XHQ0Mixcblx0XHRcdDQzLFxuXHRcdFx0NDQsXG5cdFx0XHQ0NSxcblx0XHRcdDU2LFxuXHRcdFx0NTcsXG5cdFx0XHQ2Mixcblx0XHRcdDYzLFxuXHRcdFx0NjgsXG5cdFx0XHQ2OSxcblx0XHRcdDc0LFxuXHRcdFx0NzUsXG5cdFx0XHQ3Nixcblx0XHRcdDc3LFxuXHRcdFx0NzgsXG5cdFx0XHQ3OSxcblx0XHRcdDgwLFxuXHRcdFx0ODEsXG5cdFx0XHQ5Mixcblx0XHRcdDkzLFxuXHRcdFx0OTgsXG5cdFx0XHQ5OSxcblx0XHRcdDExMixcblx0XHRcdDExMyxcblx0XHRcdDEyOCxcblx0XHRcdDEyOSxcblx0XHRcdDEzNCxcblx0XHRcdDEzNSxcblx0XHRcdDE0OCxcblx0XHRcdDE0OSxcblx0XHRcdDE2MCxcblx0XHRcdDE2MSxcblx0XHRcdDE2Mixcblx0XHRcdDE2Myxcblx0XHRcdDE2NCxcblx0XHRcdDE2NSxcblx0XHRcdDE2Nixcblx0XHRcdDE2Nyxcblx0XHRcdDE2OCxcblx0XHRcdDE2OSxcblx0XHRcdDE3MCxcblx0XHRcdDE3MSxcblx0XHRcdDE3Mixcblx0XHRcdDE3Myxcblx0XHRcdDE3OCxcblx0XHRcdDE3OSxcblx0XHRcdDE4NCxcblx0XHRcdDE4NSxcblx0XHRcdDE5Nixcblx0XHRcdDE5Nyxcblx0XHRcdDE5OCxcblx0XHRcdDE5OSxcblx0XHRcdDIwMCxcblx0XHRcdDIwMSxcblx0XHRcdDIwMixcblx0XHRcdDIwMyxcblx0XHRcdDIwNCxcblx0XHRcdDIwNSxcblx0XHRcdDIwNixcblx0XHRcdDIwNyxcblx0XHRcdDIwOCxcblx0XHRcdDIwOSxcblx0XHRcdDIxNCxcblx0XHRcdDIxNSxcblx0XHRcdDIyMCxcblx0XHRcdDIyMVxuXHRcdF07XG5cdH1cbn0gY2F0Y2ggKGVycm9yKSB7XG5cdC8vIFN3YWxsb3cgLSB3ZSBvbmx5IGNhcmUgaWYgYHN1cHBvcnRzLWNvbG9yYCBpcyBhdmFpbGFibGU7IGl0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbn1cblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgZGVmYXVsdCBgaW5zcGVjdE9wdHNgIG9iamVjdCBmcm9tIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gKlxuICogICAkIERFQlVHX0NPTE9SUz1ubyBERUJVR19ERVBUSD0xMCBERUJVR19TSE9XX0hJRERFTj1lbmFibGVkIG5vZGUgc2NyaXB0LmpzXG4gKi9cblxuZXhwb3J0cy5pbnNwZWN0T3B0cyA9IE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5maWx0ZXIoa2V5ID0+IHtcblx0cmV0dXJuIC9eZGVidWdfL2kudGVzdChrZXkpO1xufSkucmVkdWNlKChvYmosIGtleSkgPT4ge1xuXHQvLyBDYW1lbC1jYXNlXG5cdGNvbnN0IHByb3AgPSBrZXlcblx0XHQuc3Vic3RyaW5nKDYpXG5cdFx0LnRvTG93ZXJDYXNlKClcblx0XHQucmVwbGFjZSgvXyhbYS16XSkvZywgKF8sIGspID0+IHtcblx0XHRcdHJldHVybiBrLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSk7XG5cblx0Ly8gQ29lcmNlIHN0cmluZyB2YWx1ZSBpbnRvIEpTIHZhbHVlXG5cdGxldCB2YWwgPSBwcm9jZXNzLmVudltrZXldO1xuXHRpZiAoL14oeWVzfG9ufHRydWV8ZW5hYmxlZCkkL2kudGVzdCh2YWwpKSB7XG5cdFx0dmFsID0gdHJ1ZTtcblx0fSBlbHNlIGlmICgvXihub3xvZmZ8ZmFsc2V8ZGlzYWJsZWQpJC9pLnRlc3QodmFsKSkge1xuXHRcdHZhbCA9IGZhbHNlO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB7XG5cdFx0dmFsID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHR2YWwgPSBOdW1iZXIodmFsKTtcblx0fVxuXG5cdG9ialtwcm9wXSA9IHZhbDtcblx0cmV0dXJuIG9iajtcbn0sIHt9KTtcblxuLyoqXG4gKiBJcyBzdGRvdXQgYSBUVFk/IENvbG9yZWQgb3V0cHV0IGlzIGVuYWJsZWQgd2hlbiBgdHJ1ZWAuXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuXHRyZXR1cm4gJ2NvbG9ycycgaW4gZXhwb3J0cy5pbnNwZWN0T3B0cyA/XG5cdFx0Qm9vbGVhbihleHBvcnRzLmluc3BlY3RPcHRzLmNvbG9ycykgOlxuXHRcdHR0eS5pc2F0dHkocHJvY2Vzcy5zdGRlcnIuZmQpO1xufVxuXG4vKipcbiAqIEFkZHMgQU5TSSBjb2xvciBlc2NhcGUgY29kZXMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuXHRjb25zdCB7bmFtZXNwYWNlOiBuYW1lLCB1c2VDb2xvcnN9ID0gdGhpcztcblxuXHRpZiAodXNlQ29sb3JzKSB7XG5cdFx0Y29uc3QgYyA9IHRoaXMuY29sb3I7XG5cdFx0Y29uc3QgY29sb3JDb2RlID0gJ1xcdTAwMUJbMycgKyAoYyA8IDggPyBjIDogJzg7NTsnICsgYyk7XG5cdFx0Y29uc3QgcHJlZml4ID0gYCAgJHtjb2xvckNvZGV9OzFtJHtuYW1lfSBcXHUwMDFCWzBtYDtcblxuXHRcdGFyZ3NbMF0gPSBwcmVmaXggKyBhcmdzWzBdLnNwbGl0KCdcXG4nKS5qb2luKCdcXG4nICsgcHJlZml4KTtcblx0XHRhcmdzLnB1c2goY29sb3JDb2RlICsgJ20rJyArIG1vZHVsZS5leHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZikgKyAnXFx1MDAxQlswbScpO1xuXHR9IGVsc2Uge1xuXHRcdGFyZ3NbMF0gPSBnZXREYXRlKCkgKyBuYW1lICsgJyAnICsgYXJnc1swXTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXREYXRlKCkge1xuXHRpZiAoZXhwb3J0cy5pbnNwZWN0T3B0cy5oaWRlRGF0ZSkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXHRyZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpICsgJyAnO1xufVxuXG4vKipcbiAqIEludm9rZXMgYHV0aWwuZm9ybWF0KClgIHdpdGggdGhlIHNwZWNpZmllZCBhcmd1bWVudHMgYW5kIHdyaXRlcyB0byBzdGRlcnIuXG4gKi9cblxuZnVuY3Rpb24gbG9nKC4uLmFyZ3MpIHtcblx0cmV0dXJuIHByb2Nlc3Muc3RkZXJyLndyaXRlKHV0aWwuZm9ybWF0KC4uLmFyZ3MpICsgJ1xcbicpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG5cdGlmIChuYW1lc3BhY2VzKSB7XG5cdFx0cHJvY2Vzcy5lbnYuREVCVUcgPSBuYW1lc3BhY2VzO1xuXHR9IGVsc2Uge1xuXHRcdC8vIElmIHlvdSBzZXQgYSBwcm9jZXNzLmVudiBmaWVsZCB0byBudWxsIG9yIHVuZGVmaW5lZCwgaXQgZ2V0cyBjYXN0IHRvIHRoZVxuXHRcdC8vIHN0cmluZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcuIEp1c3QgZGVsZXRlIGluc3RlYWQuXG5cdFx0ZGVsZXRlIHByb2Nlc3MuZW52LkRFQlVHO1xuXHR9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcblx0cmV0dXJuIHByb2Nlc3MuZW52LkRFQlVHO1xufVxuXG4vKipcbiAqIEluaXQgbG9naWMgZm9yIGBkZWJ1Z2AgaW5zdGFuY2VzLlxuICpcbiAqIENyZWF0ZSBhIG5ldyBgaW5zcGVjdE9wdHNgIG9iamVjdCBpbiBjYXNlIGB1c2VDb2xvcnNgIGlzIHNldFxuICogZGlmZmVyZW50bHkgZm9yIGEgcGFydGljdWxhciBgZGVidWdgIGluc3RhbmNlLlxuICovXG5cbmZ1bmN0aW9uIGluaXQoZGVidWcpIHtcblx0ZGVidWcuaW5zcGVjdE9wdHMgPSB7fTtcblxuXHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZXhwb3J0cy5pbnNwZWN0T3B0cyk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdGRlYnVnLmluc3BlY3RPcHRzW2tleXNbaV1dID0gZXhwb3J0cy5pbnNwZWN0T3B0c1trZXlzW2ldXTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tbW9uJykoZXhwb3J0cyk7XG5cbmNvbnN0IHtmb3JtYXR0ZXJzfSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIE1hcCAlbyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGwgb24gYSBzaW5nbGUgbGluZS5cbiAqL1xuXG5mb3JtYXR0ZXJzLm8gPSBmdW5jdGlvbiAodikge1xuXHR0aGlzLmluc3BlY3RPcHRzLmNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXHRyZXR1cm4gdXRpbC5pbnNwZWN0KHYsIHRoaXMuaW5zcGVjdE9wdHMpXG5cdFx0LnJlcGxhY2UoL1xccypcXG5cXHMqL2csICcgJyk7XG59O1xuXG4vKipcbiAqIE1hcCAlTyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGxvd2luZyBtdWx0aXBsZSBsaW5lcyBpZiBuZWVkZWQuXG4gKi9cblxuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24gKHYpIHtcblx0dGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblx0cmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKTtcbn07XG4iLCAiLyoqXG4gKiBEZXRlY3QgRWxlY3Ryb24gcmVuZGVyZXIgLyBud2pzIHByb2Nlc3MsIHdoaWNoIGlzIG5vZGUsIGJ1dCB3ZSBzaG91bGRcbiAqIHRyZWF0IGFzIGEgYnJvd3Nlci5cbiAqL1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCBwcm9jZXNzLmJyb3dzZXIgPT09IHRydWUgfHwgcHJvY2Vzcy5fX253anMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKTtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9ub2RlLmpzJyk7XG59XG4iLCAiY29uc3QgY3JlYXRlID0gcmVxdWlyZSgnZGVidWcnKVxuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZSgncHJlc3RhJylcblxubW9kdWxlLmV4cG9ydHMgPSB7IGRlYnVnIH1cbiIsICJsZXQgdG9SZWdFeHAgPSByZXF1aXJlKCdyZWdleHBhcmFtJylcblxudG9SZWdFeHAgPSB0b1JlZ0V4cC5kZWZhdWx0IHx8IHRvUmVnRXhwXG5cbi8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2x1a2VlZC9yZWdleHBhcmFtI3VzYWdlXG5mdW5jdGlvbiBleGVjIChwYXRoLCByZXN1bHQpIHtcbiAgbGV0IGkgPSAwLFxuICAgIG91dCA9IHt9XG4gIGxldCBtYXRjaGVzID0gcmVzdWx0LnBhdHRlcm4uZXhlYyhwYXRoKVxuICB3aGlsZSAoaSA8IHJlc3VsdC5rZXlzLmxlbmd0aCkge1xuICAgIG91dFtyZXN1bHQua2V5c1tpXV0gPSBtYXRjaGVzWysraV0gfHwgbnVsbFxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gZ2V0Um91dGVQYXJhbXMgKHVybCwgcm91dGUpIHtcbiAgcmV0dXJuIGV4ZWModXJsLCB0b1JlZ0V4cChyb3V0ZSkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBnZXRSb3V0ZVBhcmFtcyB9XG4iLCAiY29uc3QgZGVmYXVsdDQwNCA9IGA8IS0tIGJ1aWx0IHdpdGggcHJlc3RhIGh0dHBzOi8vbnBtLmltL3ByZXN0YSAtLT5cbjwhRE9DVFlQRSBodG1sPlxuPGh0bWw+XG4gIDxoZWFkPlxuICAgIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiIC8+XG4gICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgIDx0aXRsZT40MDQ8L3RpdGxlPlxuICAgIDxsaW5rXG4gICAgICByZWw9XCJzdHlsZXNoZWV0XCJcbiAgICAgIHR5cGU9XCJ0ZXh0L2Nzc1wiXG4gICAgICBocmVmPVwiaHR0cHM6Ly91bnBrZy5jb20vc3Zic3RyYXRlQDQuMS4xL2Rpc3Qvc3Zic3RyYXRlLmNzc1wiXG4gICAgLz5cbiAgPC9oZWFkPlxuICA8Ym9keT5cbiAgICA8ZGl2IGNsYXNzPVwiZiBhaWMgamNjXCIgc3R5bGU9XCJoZWlnaHQ6IDEwMHZoXCI+XG4gICAgICA8aDIgY2xhc3M9XCJwMVwiIHN0eWxlPVwiY29sb3I6IGJsdWVcIj40MDQgTm90IEZvdW5kPC9oMj5cbiAgICA8L2Rpdj5cbiAgPC9ib2R5PlxuPC9odG1sPmBcblxubW9kdWxlLmV4cG9ydHMgPSB7IGRlZmF1bHQ0MDQgfVxuIiwgIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIHRhcmdldC5wcm9wZXJ0eUlzRW51bWVyYWJsZShzeW1ib2wpXG5cdFx0fSlcblx0XHQ6IFtdXG59XG5cbmZ1bmN0aW9uIGdldEtleXModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXQpLmNvbmNhdChnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpXG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5SXNPbk9iamVjdChvYmplY3QsIHByb3BlcnR5KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHByb3BlcnR5IGluIG9iamVjdFxuXHR9IGNhdGNoKF8pIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxufVxuXG4vLyBQcm90ZWN0cyBmcm9tIHByb3RvdHlwZSBwb2lzb25pbmcgYW5kIHVuZXhwZWN0ZWQgbWVyZ2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuZnVuY3Rpb24gcHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkge1xuXHRyZXR1cm4gcHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAvLyBQcm9wZXJ0aWVzIGFyZSBzYWZlIHRvIG1lcmdlIGlmIHRoZXkgZG9uJ3QgZXhpc3QgaW4gdGhlIHRhcmdldCB5ZXQsXG5cdFx0JiYgIShPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkgLy8gdW5zYWZlIGlmIHRoZXkgZXhpc3QgdXAgdGhlIHByb3RvdHlwZSBjaGFpbixcblx0XHRcdCYmIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwga2V5KSkgLy8gYW5kIGFsc28gdW5zYWZlIGlmIHRoZXkncmUgbm9uZW51bWVyYWJsZS5cbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0dmFyIGRlc3RpbmF0aW9uID0ge307XG5cdGlmIChvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHRhcmdldCkpIHtcblx0XHRnZXRLZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cblx0Z2V0S2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0aWYgKHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHRpZiAocHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBkZXN0aW5hdGlvblxufVxuXG5mdW5jdGlvbiBkZWVwbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXJyYXlNZXJnZSA9IG9wdGlvbnMuYXJyYXlNZXJnZSB8fCBkZWZhdWx0QXJyYXlNZXJnZTtcblx0b3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCA9IG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgfHwgaXNNZXJnZWFibGVPYmplY3Q7XG5cdC8vIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkIGlzIGFkZGVkIHRvIGBvcHRpb25zYCBzbyB0aGF0IGN1c3RvbSBhcnJheU1lcmdlKClcblx0Ly8gaW1wbGVtZW50YXRpb25zIGNhbiB1c2UgaXQuIFRoZSBjYWxsZXIgbWF5IG5vdCByZXBsYWNlIGl0LlxuXHRvcHRpb25zLmNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQ7XG5cblx0dmFyIHNvdXJjZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHNvdXJjZSk7XG5cdHZhciB0YXJnZXRJc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpO1xuXHR2YXIgc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCA9IHNvdXJjZUlzQXJyYXkgPT09IHRhcmdldElzQXJyYXk7XG5cblx0aWYgKCFzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoKSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIGlmIChzb3VyY2VJc0FycmF5KSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuYXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH1cbn1cblxuZGVlcG1lcmdlLmFsbCA9IGZ1bmN0aW9uIGRlZXBtZXJnZUFsbChhcnJheSwgb3B0aW9ucykge1xuXHRpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBzaG91bGQgYmUgYW4gYXJyYXknKVxuXHR9XG5cblx0cmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2LCBuZXh0KSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZShwcmV2LCBuZXh0LCBvcHRpb25zKVxuXHR9LCB7fSlcbn07XG5cbnZhciBkZWVwbWVyZ2VfMSA9IGRlZXBtZXJnZTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWVwbWVyZ2VfMTtcbiIsICJjb25zdCBtZXJnZSA9IHJlcXVpcmUoJ2RlZXBtZXJnZScpXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQgKGNvbnRleHQpIHtcbiAgcmV0dXJuIG1lcmdlKFxuICAgIHtcbiAgICAgIHBhdGg6ICcnLFxuICAgICAgaGVhZGVyczoge30sXG4gICAgICBwYXJhbXM6IHt9LFxuICAgICAgcXVlcnk6IHt9LFxuICAgICAgbGFtYmRhOiB7XG4gICAgICAgIGV2ZW50OiB7fSxcbiAgICAgICAgY29udGV4dDoge31cbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbnRleHRcbiAgKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgY3JlYXRlQ29udGV4dCB9XG4iLCAiZnVuY3Rpb24gc3RyaW5naWZ5IChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkob2JqKSA6IG9ialxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZXNwb25zZSAocmVzcG9uc2UpIHtcbiAgY29uc3Qge1xuICAgIGlzQmFzZTY0RW5jb2RlZCA9IGZhbHNlLFxuICAgIHN0YXR1c0NvZGUgPSAyMDAsXG4gICAgaGVhZGVycyA9IHt9LFxuICAgIG11bHRpVmFsdWVIZWFkZXJzID0ge30sXG4gICAgYm9keSxcbiAgICBodG1sLFxuICAgIGpzb24sXG4gICAgeG1sXG4gIH0gPVxuICAgIHR5cGVvZiByZXNwb25zZSA9PT0gJ29iamVjdCdcbiAgICAgID8gcmVzcG9uc2VcbiAgICAgIDoge1xuICAgICAgICAgIGJvZHk6IHJlc3BvbnNlXG4gICAgICAgIH1cblxuICBsZXQgY29udGVudFR5cGUgPSAndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04J1xuXG4gIGlmICghIWpzb24pIHtcbiAgICBjb250ZW50VHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICB9IGVsc2UgaWYgKCEheG1sKSB7XG4gICAgY29udGVudFR5cGUgPSAnYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04J1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpc0Jhc2U2NEVuY29kZWQsXG4gICAgc3RhdHVzQ29kZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogY29udGVudFR5cGUsXG4gICAgICAuLi5oZWFkZXJzXG4gICAgfSxcbiAgICBtdWx0aVZhbHVlSGVhZGVycyxcbiAgICBib2R5OiBzdHJpbmdpZnkoYm9keSB8fCBodG1sIHx8IGpzb24gfHwgeG1sIHx8ICcnKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBub3JtYWxpemVSZXNwb25zZSB9XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc0h5cGVyID0gcHJvY2Vzcy5lbnYuVEVSTV9QUk9HUkFNID09PSAnSHlwZXInO1xuY29uc3QgaXNXaW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbmNvbnN0IGlzTGludXggPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnbGludXgnO1xuXG5jb25zdCBjb21tb24gPSB7XG4gIGJhbGxvdERpc2FibGVkOiAnXHUyNjEyJyxcbiAgYmFsbG90T2ZmOiAnXHUyNjEwJyxcbiAgYmFsbG90T246ICdcdTI2MTEnLFxuICBidWxsZXQ6ICdcdTIwMjInLFxuICBidWxsZXRXaGl0ZTogJ1x1MjVFNicsXG4gIGZ1bGxCbG9jazogJ1x1MjU4OCcsXG4gIGhlYXJ0OiAnXHUyNzY0JyxcbiAgaWRlbnRpY2FsVG86ICdcdTIyNjEnLFxuICBsaW5lOiAnXHUyNTAwJyxcbiAgbWFyazogJ1x1MjAzQicsXG4gIG1pZGRvdDogJ1x1MDBCNycsXG4gIG1pbnVzOiAnXHVGRjBEJyxcbiAgbXVsdGlwbGljYXRpb246ICdcdTAwRDcnLFxuICBvYmVsdXM6ICdcdTAwRjcnLFxuICBwZW5jaWxEb3duUmlnaHQ6ICdcdTI3MEUnLFxuICBwZW5jaWxSaWdodDogJ1x1MjcwRicsXG4gIHBlbmNpbFVwUmlnaHQ6ICdcdTI3MTAnLFxuICBwZXJjZW50OiAnJScsXG4gIHBpbGNyb3cyOiAnXHUyNzYxJyxcbiAgcGlsY3JvdzogJ1x1MDBCNicsXG4gIHBsdXNNaW51czogJ1x1MDBCMScsXG4gIHNlY3Rpb246ICdcdTAwQTcnLFxuICBzdGFyc09mZjogJ1x1MjYwNicsXG4gIHN0YXJzT246ICdcdTI2MDUnLFxuICB1cERvd25BcnJvdzogJ1x1MjE5NSdcbn07XG5cbmNvbnN0IHdpbmRvd3MgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tb24sIHtcbiAgY2hlY2s6ICdcdTIyMUEnLFxuICBjcm9zczogJ1x1MDBENycsXG4gIGVsbGlwc2lzTGFyZ2U6ICcuLi4nLFxuICBlbGxpcHNpczogJy4uLicsXG4gIGluZm86ICdpJyxcbiAgcXVlc3Rpb246ICc/JyxcbiAgcXVlc3Rpb25TbWFsbDogJz8nLFxuICBwb2ludGVyOiAnPicsXG4gIHBvaW50ZXJTbWFsbDogJ1x1MDBCQicsXG4gIHJhZGlvT2ZmOiAnKCApJyxcbiAgcmFkaW9PbjogJygqKScsXG4gIHdhcm5pbmc6ICdcdTIwM0MnXG59KTtcblxuY29uc3Qgb3RoZXIgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tb24sIHtcbiAgYmFsbG90Q3Jvc3M6ICdcdTI3MTgnLFxuICBjaGVjazogJ1x1MjcxNCcsXG4gIGNyb3NzOiAnXHUyNzE2JyxcbiAgZWxsaXBzaXNMYXJnZTogJ1x1MjJFRicsXG4gIGVsbGlwc2lzOiAnXHUyMDI2JyxcbiAgaW5mbzogJ1x1MjEzOScsXG4gIHF1ZXN0aW9uOiAnPycsXG4gIHF1ZXN0aW9uRnVsbDogJ1x1RkYxRicsXG4gIHF1ZXN0aW9uU21hbGw6ICdcdUZFNTYnLFxuICBwb2ludGVyOiBpc0xpbnV4ID8gJ1x1MjVCOCcgOiAnXHUyNzZGJyxcbiAgcG9pbnRlclNtYWxsOiBpc0xpbnV4ID8gJ1x1MjAyMycgOiAnXHUyMDNBJyxcbiAgcmFkaW9PZmY6ICdcdTI1RUYnLFxuICByYWRpb09uOiAnXHUyNUM5JyxcbiAgd2FybmluZzogJ1x1MjZBMCdcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChpc1dpbmRvd3MgJiYgIWlzSHlwZXIpID8gd2luZG93cyA6IG90aGVyO1xuUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ2NvbW1vbicsIHsgZW51bWVyYWJsZTogZmFsc2UsIHZhbHVlOiBjb21tb24gfSk7XG5SZWZsZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnd2luZG93cycsIHsgZW51bWVyYWJsZTogZmFsc2UsIHZhbHVlOiB3aW5kb3dzIH0pO1xuUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ290aGVyJywgeyBlbnVtZXJhYmxlOiBmYWxzZSwgdmFsdWU6IG90aGVyIH0pO1xuIiwgIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNPYmplY3QgPSB2YWwgPT4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG5jb25zdCBpZGVudGl0eSA9IHZhbCA9PiB2YWw7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnRyb2wtcmVnZXggKi9cbi8vIHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGFsay9hbnNpLXJlZ2V4IChNSVQgTGljZW5zZSlcbmNvbnN0IEFOU0lfUkVHRVggPSAvW1xcdTAwMWJcXHUwMDliXVtbXFxdIzs/KCldKig/Oig/Oig/OlteXFxXX10qOz9bXlxcV19dKilcXHUwMDA3KXwoPzooPzpbMC05XXsxLDR9KDtbMC05XXswLDR9KSopP1t+MC05PTw+Y2YtbnFydHlBLVBSWl0pKS9nO1xuXG5jb25zdCBjcmVhdGUgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbG9ycyA9IHsgZW5hYmxlZDogdHJ1ZSwgdmlzaWJsZTogdHJ1ZSwgc3R5bGVzOiB7fSwga2V5czoge30gfTtcblxuICBpZiAoJ0ZPUkNFX0NPTE9SJyBpbiBwcm9jZXNzLmVudikge1xuICAgIGNvbG9ycy5lbmFibGVkID0gcHJvY2Vzcy5lbnYuRk9SQ0VfQ09MT1IgIT09ICcwJztcbiAgfVxuXG4gIGNvbnN0IGFuc2kgPSBzdHlsZSA9PiB7XG4gICAgbGV0IG9wZW4gPSBzdHlsZS5vcGVuID0gYFxcdTAwMWJbJHtzdHlsZS5jb2Rlc1swXX1tYDtcbiAgICBsZXQgY2xvc2UgPSBzdHlsZS5jbG9zZSA9IGBcXHUwMDFiWyR7c3R5bGUuY29kZXNbMV19bWA7XG4gICAgbGV0IHJlZ2V4ID0gc3R5bGUucmVnZXggPSBuZXcgUmVnRXhwKGBcXFxcdTAwMWJcXFxcWyR7c3R5bGUuY29kZXNbMV19bWAsICdnJyk7XG4gICAgc3R5bGUud3JhcCA9IChpbnB1dCwgbmV3bGluZSkgPT4ge1xuICAgICAgaWYgKGlucHV0LmluY2x1ZGVzKGNsb3NlKSkgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKHJlZ2V4LCBjbG9zZSArIG9wZW4pO1xuICAgICAgbGV0IG91dHB1dCA9IG9wZW4gKyBpbnB1dCArIGNsb3NlO1xuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGFsay9jaGFsay9wdWxsLzkyLCB0aGFua3MgdG8gdGhlXG4gICAgICAvLyBjaGFsayBjb250cmlidXRvcnMgZm9yIHRoaXMgZml4LiBIb3dldmVyLCB3ZSd2ZSBjb25maXJtZWQgdGhhdFxuICAgICAgLy8gdGhpcyBpc3N1ZSBpcyBhbHNvIHByZXNlbnQgaW4gV2luZG93cyB0ZXJtaW5hbHNcbiAgICAgIHJldHVybiBuZXdsaW5lID8gb3V0cHV0LnJlcGxhY2UoL1xccipcXG4vZywgYCR7Y2xvc2V9JCYke29wZW59YCkgOiBvdXRwdXQ7XG4gICAgfTtcbiAgICByZXR1cm4gc3R5bGU7XG4gIH07XG5cbiAgY29uc3Qgd3JhcCA9IChzdHlsZSwgaW5wdXQsIG5ld2xpbmUpID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIHN0eWxlID09PSAnZnVuY3Rpb24nID8gc3R5bGUoaW5wdXQpIDogc3R5bGUud3JhcChpbnB1dCwgbmV3bGluZSk7XG4gIH07XG5cbiAgY29uc3Qgc3R5bGUgPSAoaW5wdXQsIHN0YWNrKSA9PiB7XG4gICAgaWYgKGlucHV0ID09PSAnJyB8fCBpbnB1dCA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgaWYgKGNvbG9ycy5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuIGlucHV0O1xuICAgIGlmIChjb2xvcnMudmlzaWJsZSA9PT0gZmFsc2UpIHJldHVybiAnJztcbiAgICBsZXQgc3RyID0gJycgKyBpbnB1dDtcbiAgICBsZXQgbmwgPSBzdHIuaW5jbHVkZXMoJ1xcbicpO1xuICAgIGxldCBuID0gc3RhY2subGVuZ3RoO1xuICAgIGlmIChuID4gMCAmJiBzdGFjay5pbmNsdWRlcygndW5zdHlsZScpKSB7XG4gICAgICBzdGFjayA9IFsuLi5uZXcgU2V0KFsndW5zdHlsZScsIC4uLnN0YWNrXSldLnJldmVyc2UoKTtcbiAgICB9XG4gICAgd2hpbGUgKG4tLSA+IDApIHN0ciA9IHdyYXAoY29sb3JzLnN0eWxlc1tzdGFja1tuXV0sIHN0ciwgbmwpO1xuICAgIHJldHVybiBzdHI7XG4gIH07XG5cbiAgY29uc3QgZGVmaW5lID0gKG5hbWUsIGNvZGVzLCB0eXBlKSA9PiB7XG4gICAgY29sb3JzLnN0eWxlc1tuYW1lXSA9IGFuc2koeyBuYW1lLCBjb2RlcyB9KTtcbiAgICBsZXQga2V5cyA9IGNvbG9ycy5rZXlzW3R5cGVdIHx8IChjb2xvcnMua2V5c1t0eXBlXSA9IFtdKTtcbiAgICBrZXlzLnB1c2gobmFtZSk7XG5cbiAgICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNvbG9ycywgbmFtZSwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICBjb2xvcnMuYWxpYXMobmFtZSwgdmFsdWUpO1xuICAgICAgfSxcbiAgICAgIGdldCgpIHtcbiAgICAgICAgbGV0IGNvbG9yID0gaW5wdXQgPT4gc3R5bGUoaW5wdXQsIGNvbG9yLnN0YWNrKTtcbiAgICAgICAgUmVmbGVjdC5zZXRQcm90b3R5cGVPZihjb2xvciwgY29sb3JzKTtcbiAgICAgICAgY29sb3Iuc3RhY2sgPSB0aGlzLnN0YWNrID8gdGhpcy5zdGFjay5jb25jYXQobmFtZSkgOiBbbmFtZV07XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBkZWZpbmUoJ3Jlc2V0JywgWzAsIDBdLCAnbW9kaWZpZXInKTtcbiAgZGVmaW5lKCdib2xkJywgWzEsIDIyXSwgJ21vZGlmaWVyJyk7XG4gIGRlZmluZSgnZGltJywgWzIsIDIyXSwgJ21vZGlmaWVyJyk7XG4gIGRlZmluZSgnaXRhbGljJywgWzMsIDIzXSwgJ21vZGlmaWVyJyk7XG4gIGRlZmluZSgndW5kZXJsaW5lJywgWzQsIDI0XSwgJ21vZGlmaWVyJyk7XG4gIGRlZmluZSgnaW52ZXJzZScsIFs3LCAyN10sICdtb2RpZmllcicpO1xuICBkZWZpbmUoJ2hpZGRlbicsIFs4LCAyOF0sICdtb2RpZmllcicpO1xuICBkZWZpbmUoJ3N0cmlrZXRocm91Z2gnLCBbOSwgMjldLCAnbW9kaWZpZXInKTtcblxuICBkZWZpbmUoJ2JsYWNrJywgWzMwLCAzOV0sICdjb2xvcicpO1xuICBkZWZpbmUoJ3JlZCcsIFszMSwgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCdncmVlbicsIFszMiwgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCd5ZWxsb3cnLCBbMzMsIDM5XSwgJ2NvbG9yJyk7XG4gIGRlZmluZSgnYmx1ZScsIFszNCwgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCdtYWdlbnRhJywgWzM1LCAzOV0sICdjb2xvcicpO1xuICBkZWZpbmUoJ2N5YW4nLCBbMzYsIDM5XSwgJ2NvbG9yJyk7XG4gIGRlZmluZSgnd2hpdGUnLCBbMzcsIDM5XSwgJ2NvbG9yJyk7XG4gIGRlZmluZSgnZ3JheScsIFs5MCwgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCdncmV5JywgWzkwLCAzOV0sICdjb2xvcicpO1xuXG4gIGRlZmluZSgnYmdCbGFjaycsIFs0MCwgNDldLCAnYmcnKTtcbiAgZGVmaW5lKCdiZ1JlZCcsIFs0MSwgNDldLCAnYmcnKTtcbiAgZGVmaW5lKCdiZ0dyZWVuJywgWzQyLCA0OV0sICdiZycpO1xuICBkZWZpbmUoJ2JnWWVsbG93JywgWzQzLCA0OV0sICdiZycpO1xuICBkZWZpbmUoJ2JnQmx1ZScsIFs0NCwgNDldLCAnYmcnKTtcbiAgZGVmaW5lKCdiZ01hZ2VudGEnLCBbNDUsIDQ5XSwgJ2JnJyk7XG4gIGRlZmluZSgnYmdDeWFuJywgWzQ2LCA0OV0sICdiZycpO1xuICBkZWZpbmUoJ2JnV2hpdGUnLCBbNDcsIDQ5XSwgJ2JnJyk7XG5cbiAgZGVmaW5lKCdibGFja0JyaWdodCcsIFs5MCwgMzldLCAnYnJpZ2h0Jyk7XG4gIGRlZmluZSgncmVkQnJpZ2h0JywgWzkxLCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCdncmVlbkJyaWdodCcsIFs5MiwgMzldLCAnYnJpZ2h0Jyk7XG4gIGRlZmluZSgneWVsbG93QnJpZ2h0JywgWzkzLCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCdibHVlQnJpZ2h0JywgWzk0LCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCdtYWdlbnRhQnJpZ2h0JywgWzk1LCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCdjeWFuQnJpZ2h0JywgWzk2LCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCd3aGl0ZUJyaWdodCcsIFs5NywgMzldLCAnYnJpZ2h0Jyk7XG5cbiAgZGVmaW5lKCdiZ0JsYWNrQnJpZ2h0JywgWzEwMCwgNDldLCAnYmdCcmlnaHQnKTtcbiAgZGVmaW5lKCdiZ1JlZEJyaWdodCcsIFsxMDEsIDQ5XSwgJ2JnQnJpZ2h0Jyk7XG4gIGRlZmluZSgnYmdHcmVlbkJyaWdodCcsIFsxMDIsIDQ5XSwgJ2JnQnJpZ2h0Jyk7XG4gIGRlZmluZSgnYmdZZWxsb3dCcmlnaHQnLCBbMTAzLCA0OV0sICdiZ0JyaWdodCcpO1xuICBkZWZpbmUoJ2JnQmx1ZUJyaWdodCcsIFsxMDQsIDQ5XSwgJ2JnQnJpZ2h0Jyk7XG4gIGRlZmluZSgnYmdNYWdlbnRhQnJpZ2h0JywgWzEwNSwgNDldLCAnYmdCcmlnaHQnKTtcbiAgZGVmaW5lKCdiZ0N5YW5CcmlnaHQnLCBbMTA2LCA0OV0sICdiZ0JyaWdodCcpO1xuICBkZWZpbmUoJ2JnV2hpdGVCcmlnaHQnLCBbMTA3LCA0OV0sICdiZ0JyaWdodCcpO1xuXG4gIGNvbG9ycy5hbnNpUmVnZXggPSBBTlNJX1JFR0VYO1xuICBjb2xvcnMuaGFzQ29sb3IgPSBjb2xvcnMuaGFzQW5zaSA9IHN0ciA9PiB7XG4gICAgY29sb3JzLmFuc2lSZWdleC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBzdHIgIT09ICcnICYmIGNvbG9ycy5hbnNpUmVnZXgudGVzdChzdHIpO1xuICB9O1xuXG4gIGNvbG9ycy5hbGlhcyA9IChuYW1lLCBjb2xvcikgPT4ge1xuICAgIGxldCBmbiA9IHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycgPyBjb2xvcnNbY29sb3JdIDogY29sb3I7XG5cbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhbGlhcyB0byBiZSB0aGUgbmFtZSBvZiBhbiBleGlzdGluZyBjb2xvciAoc3RyaW5nKSBvciBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYgKCFmbi5zdGFjaykge1xuICAgICAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgJ25hbWUnLCB7IHZhbHVlOiBuYW1lIH0pO1xuICAgICAgY29sb3JzLnN0eWxlc1tuYW1lXSA9IGZuO1xuICAgICAgZm4uc3RhY2sgPSBbbmFtZV07XG4gICAgfVxuXG4gICAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShjb2xvcnMsIG5hbWUsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgY29sb3JzLmFsaWFzKG5hbWUsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICBnZXQoKSB7XG4gICAgICAgIGxldCBjb2xvciA9IGlucHV0ID0+IHN0eWxlKGlucHV0LCBjb2xvci5zdGFjayk7XG4gICAgICAgIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YoY29sb3IsIGNvbG9ycyk7XG4gICAgICAgIGNvbG9yLnN0YWNrID0gdGhpcy5zdGFjayA/IHRoaXMuc3RhY2suY29uY2F0KGZuLnN0YWNrKSA6IGZuLnN0YWNrO1xuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29sb3JzLnRoZW1lID0gY3VzdG9tID0+IHtcbiAgICBpZiAoIWlzT2JqZWN0KGN1c3RvbSkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZW1lIHRvIGJlIGFuIG9iamVjdCcpO1xuICAgIGZvciAobGV0IG5hbWUgb2YgT2JqZWN0LmtleXMoY3VzdG9tKSkge1xuICAgICAgY29sb3JzLmFsaWFzKG5hbWUsIGN1c3RvbVtuYW1lXSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xvcnM7XG4gIH07XG5cbiAgY29sb3JzLmFsaWFzKCd1bnN0eWxlJywgc3RyID0+IHtcbiAgICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgc3RyICE9PSAnJykge1xuICAgICAgY29sb3JzLmFuc2lSZWdleC5sYXN0SW5kZXggPSAwO1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKGNvbG9ycy5hbnNpUmVnZXgsICcnKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9KTtcblxuICBjb2xvcnMuYWxpYXMoJ25vb3AnLCBzdHIgPT4gc3RyKTtcbiAgY29sb3JzLm5vbmUgPSBjb2xvcnMuY2xlYXIgPSBjb2xvcnMubm9vcDtcblxuICBjb2xvcnMuc3RyaXBDb2xvciA9IGNvbG9ycy51bnN0eWxlO1xuICBjb2xvcnMuc3ltYm9scyA9IHJlcXVpcmUoJy4vc3ltYm9scycpO1xuICBjb2xvcnMuZGVmaW5lID0gZGVmaW5lO1xuICByZXR1cm4gY29sb3JzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGUoKTtcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcbiIsICJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgUFJFU1RBX0VOViA9IHByb2Nlc3MuZW52LlBSRVNUQV9FTlYgfHwgJ3Byb2R1Y3Rpb24nXG5cbmZ1bmN0aW9uIHdyaXRlIChmaWxlcGF0aCwganNvbikge1xuICBpZiAoUFJFU1RBX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZXBhdGgsIEpTT04uc3RyaW5naWZ5KGpzb24pLCAndXRmLTgnKVxufVxuXG5mdW5jdGlvbiByZWFkIChmaWxlcGF0aCkge1xuICBpZiAoUFJFU1RBX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSByZXR1cm4ge31cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVwYXRoKSkgZnMud3JpdGVGaWxlU3luYyhmaWxlcGF0aCwgJ3t9JywgJ3V0Zi04JylcbiAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGVwYXRoKSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2FjaGUgKG5hbWUsIHsgZGlyID0gcHJvY2Vzcy5jd2QoKSB9ID0ge30pIHtcbiAgY29uc3QgZmlsZW5hbWUgPSAnLicgKyBuYW1lXG4gIGNvbnN0IGZpbGVwYXRoID0gcGF0aC5qb2luKGRpciwgZmlsZW5hbWUpXG5cbiAgbGV0IGNhY2hlID0gcmVhZChmaWxlcGF0aClcblxuICByZXR1cm4ge1xuICAgIGdldCAoa2V5KSB7XG4gICAgICBjb25zdCBbdmFsdWUsIGV4cGlyYXRpb25dID0gY2FjaGVba2V5XSB8fCBbXVxuXG4gICAgICBpZiAoZXhwaXJhdGlvbiAhPT0gbnVsbCAmJiBEYXRlLm5vdygpID4gZXhwaXJhdGlvbikge1xuICAgICAgICBkZWxldGUgY2FjaGVba2V5XVxuICAgICAgICB3cml0ZShmaWxlcGF0aCwgY2FjaGUpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0IChrZXksIHZhbHVlLCBkdXJhdGlvbikge1xuICAgICAgY29uc3QgZXhwaXJhdGlvbiA9IGR1cmF0aW9uID8gRGF0ZS5ub3coKSArIGR1cmF0aW9uIDogbnVsbFxuICAgICAgY2FjaGVba2V5XSA9IFt2YWx1ZSwgZXhwaXJhdGlvbl1cblxuICAgICAgaWYgKGV4cGlyYXRpb24pIHdyaXRlKGZpbGVwYXRoLCBjYWNoZSlcbiAgICB9LFxuICAgIGNsZWFyIChrZXkpIHtcbiAgICAgIGRlbGV0ZSBjYWNoZVtrZXldXG4gICAgICB3cml0ZShmaWxlcGF0aCwgY2FjaGUpXG4gICAgfSxcbiAgICBjbGVhckFsbE1lbW9yeSAoKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjYWNoZSkpIHtcbiAgICAgICAgY29uc3QgW3ZhbHVlLCBleHBpcmF0aW9uXSA9IGNhY2hlW2tleV0gfHwgW11cbiAgICAgICAgaWYgKCFleHBpcmF0aW9uKSBkZWxldGUgY2FjaGVba2V5XVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYW51cCAoKSB7XG4gICAgICBjYWNoZSA9IHt9XG5cbiAgICAgIC8vIG5vIHBlcnNpc3RlbnQgY2FjaGUgbWF5IGhhdmUgYmVlbiBjcmVhdGVkXG4gICAgICB0cnkge1xuICAgICAgICBmcy51bmxpbmtTeW5jKGZpbGVwYXRoKVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9LFxuICAgIGR1bXAgKCkge1xuICAgICAgY29uc3QgcmVzID0ge31cblxuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoY2FjaGUpKSB7XG4gICAgICAgIHJlc1trZXldID0gY2FjaGVba2V5XVswXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBjcmVhdGVDYWNoZSB9XG4iLCAiY29uc3QgYyA9IHJlcXVpcmUoJ2Fuc2ktY29sb3JzJylcblxuY29uc3QgeyBjcmVhdGVDYWNoZSB9ID0gcmVxdWlyZSgnLi9sb2FkQ2FjaGUnKVxuXG5jb25zdCB7IE5PREVfRU5WIH0gPSBwcm9jZXNzLmVudlxuXG5jb25zdCByZXF1ZXN0cyA9IHt9XG5jb25zdCBlcnJvcnMgPSB7fVxuY29uc3QgbG9hZENhY2hlID0gY3JlYXRlQ2FjaGUoJ3ByZXN0YS1sb2FkLWNhY2hlJylcblxuZnVuY3Rpb24gbG9nIChzdHIpIHtcbiAgaWYgKE5PREVfRU5WICE9PSAndGVzdCcpIGNvbnNvbGUubG9nKHN0cilcbn1cblxuZnVuY3Rpb24gbG9hZEVycm9yIChrZXksIGUpIHtcbiAgbG9nKGBcXG4gICR7Yy5yZWQoJ2Vycm9yJyl9IGxvYWQgeyAke2tleX0gfVxcblxcbiR7ZX1cXG5gKVxuICBlcnJvcnNba2V5XSA9IGVcbiAgZGVsZXRlIHJlcXVlc3RzW2tleV1cbn1cblxuZnVuY3Rpb24gcHJpbWUgKGtleSwgdmFsdWUsIGR1cmF0aW9uKSB7XG4gIGxvYWRDYWNoZS5zZXQoa2V5LCB2YWx1ZSwgZHVyYXRpb24pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNhY2hlIChsb2FkZXIsIHsga2V5LCBkdXJhdGlvbiB9KSB7XG4gIGxldCB2YWx1ZSA9IGxvYWRDYWNoZS5nZXQoa2V5KVxuXG4gIGlmICghdmFsdWUpIHtcbiAgICB2YWx1ZSA9IGF3YWl0IGxvYWRlcigpXG4gICAgbG9hZENhY2hlLnNldChrZXksIHZhbHVlLCBkdXJhdGlvbilcbiAgfVxuXG4gIHJldHVybiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBsb2FkIChsb2FkZXIsIHsga2V5LCBkdXJhdGlvbiB9KSB7XG4gIGxldCB2YWx1ZSA9IGxvYWRDYWNoZS5nZXQoa2V5KVxuXG4gIGlmICghdmFsdWUgJiYgIWVycm9yc1trZXldKSB7XG4gICAgLy8gdHJ5L2NhdGNoIHJlcXVpcmVkIGZvciBzeW5jIGxvYWRlcnNcbiAgICB0cnkge1xuICAgICAgcmVxdWVzdHNba2V5XSA9IGxvYWRlcigpXG5cbiAgICAgIHJlcXVlc3RzW2tleV1cbiAgICAgICAgLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgIGxvYWRDYWNoZS5zZXQoa2V5LCB2YWx1ZSwgZHVyYXRpb24pXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RzW2tleV1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gY2F0Y2ggYXN5bmMgZXJyb3JzXG4gICAgICAgIC5jYXRjaChlID0+IGxvYWRFcnJvcihrZXksIGUpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvYWRFcnJvcihrZXksIGUpXG4gICAgfVxuICB9XG5cbiAgZGVsZXRlIGVycm9yc1trZXldXG5cbiAgcmV0dXJuIHZhbHVlXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZsdXNoIChydW4sIGRhdGEgPSB7fSkge1xuICBjb25zdCBjb250ZW50ID0gcnVuKClcblxuICBpZiAoT2JqZWN0LmtleXMocmVxdWVzdHMpLmxlbmd0aCkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZChPYmplY3QudmFsdWVzKHJlcXVlc3RzKSlcbiAgICByZXR1cm4gZmx1c2gocnVuLCBkYXRhKVxuICB9XG5cbiAgcmV0dXJuIHsgY29udGVudCwgZGF0YTogbG9hZENhY2hlLmR1bXAoKSB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2FkQ2FjaGUsXG4gIHByaW1lLFxuICBjYWNoZSxcbiAgbG9hZCxcbiAgZmx1c2hcbn1cbiIsICJjb25zdCB7IGRlYnVnIH0gPSByZXF1aXJlKCcuL2RlYnVnJylcbmNvbnN0IHsgZ2V0Um91dGVQYXJhbXMgfSA9IHJlcXVpcmUoJy4vZ2V0Um91dGVQYXJhbXMnKVxuY29uc3QgeyBkZWZhdWx0NDA0IH0gPSByZXF1aXJlKCcuL2RlZmF1bHQ0MDQnKVxuY29uc3QgeyBjcmVhdGVDb250ZXh0IH0gPSByZXF1aXJlKCcuL2NyZWF0ZUNvbnRleHQnKVxuY29uc3QgeyBub3JtYWxpemVSZXNwb25zZSB9ID0gcmVxdWlyZSgnLi9ub3JtYWxpemVSZXNwb25zZScpXG5jb25zdCB7IGxvYWRDYWNoZSB9ID0gcmVxdWlyZSgnLi9sb2FkJylcblxuLypcbiAqIFRoaXMgZnVuY3Rpb24gaXMgaW5pdGlhbGx5IGNhbGxlZCAqd2l0aGluKiBhIGdlbmVyYXRlZCBlbnRyeSBmaWxlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUhhbmRsZXIgKHJvdXRlciwgY29uZmlnKSB7XG4gIHJldHVybiBhc3luYyAoZXZlbnQsIGNvbnRleHQpID0+IHtcbiAgICBkZWJ1ZygncmVjZWl2ZWQgZXZlbnQnLCBldmVudClcblxuICAgIC8qXG4gICAgICogTWF0Y2ggYSBmaWxlIHVzaW5nIHJvdXRlclxuICAgICAqL1xuICAgIGNvbnN0IGZpbGUgPSByb3V0ZXIoZXZlbnQucGF0aClcblxuICAgIC8qXG4gICAgICogRXhpdCBlYXJseSBpZiBubyBmaWxlIHdhcyBtYXRjaGVkXG4gICAgICovXG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBkZWJ1ZygnaGFuZGxlcicsICdmYWxsYmFjayB0byBkZWZhdWx0IDQwNCcpXG5cbiAgICAgIHJldHVybiBub3JtYWxpemVSZXNwb25zZSh7XG4gICAgICAgIHN0YXR1c0NvZGU6IDQwNCxcbiAgICAgICAgYm9keTogZGVmYXVsdDQwNFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB3ZSd2ZSBnb3QgYSBmaWxlIG1hdGNoLi4uXG5cbiAgICAvKlxuICAgICAqIENyZWF0ZSBwcmVzdGEgY29udGV4dCBvYmplY3RcbiAgICAgKi9cbiAgICBjb25zdCBjdHggPSBjcmVhdGVDb250ZXh0KHtcbiAgICAgIHBhdGg6IGV2ZW50LnBhdGgsXG4gICAgICBtZXRob2Q6IGV2ZW50Lmh0dHBNZXRob2QsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC4uLmV2ZW50LmhlYWRlcnMsXG4gICAgICAgIC4uLmV2ZW50Lm11bHRpVmFsdWVIZWFkZXJzXG4gICAgICB9LFxuICAgICAgYm9keTogZXZlbnQuYm9keSxcbiAgICAgIHBhcmFtczogZ2V0Um91dGVQYXJhbXMoZXZlbnQucGF0aCwgZmlsZS5yb3V0ZSksXG4gICAgICBxdWVyeToge1xuICAgICAgICAuLi5ldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnMsXG4gICAgICAgIC4uLmV2ZW50Lm11bHRpVmFsdWVRdWVyeVN0cmluZ1BhcmFtZXRlcnNcbiAgICAgIH0sXG4gICAgICBsYW1iZGE6IHsgZXZlbnQsIGNvbnRleHQgfVxuICAgIH0pXG5cbiAgICBkZWJ1ZygncHJlc3RhIHNlcnZlcmxlc3MgY29udGV4dCcsIGN0eClcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gbm9ybWFsaXplUmVzcG9uc2UoYXdhaXQgZmlsZS5oYW5kbGVyKGN0eCkpXG5cbiAgICBsb2FkQ2FjaGUuY2xlYXJBbGxNZW1vcnkoKVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGNyZWF0ZUhhbmRsZXIgfVxuIiwgImNvbnN0IHsgY3JlYXRlUm91dGVyIH0gPSByZXF1aXJlKCcuL3JvdXRlcicpXG5jb25zdCB7IGNyZWF0ZUhhbmRsZXIgfSA9IHJlcXVpcmUoJy4vaGFuZGxlcicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVSb3V0ZXIsXG4gIGNyZWF0ZUhhbmRsZXJcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI2WkFBQSwrQkFBaUIsRUFBSyxDQUNyQixNQUFJLElBQU8sSUFBWSxLQUNuQixZQUFZLEtBQUssR0FBYSxLQUM5QixZQUFZLEtBQUssR0FBYSxHQUM5QixNQUFNLEtBQUssR0FBYSxJQUNyQixFQUdSLFlBQWdCLEVBQUssQ0FFcEIsT0FESSxHQUFFLEVBQUcsRUFBSSxHQUFJLEVBQUksRUFBSSxNQUFNLEtBQ3hCLEVBQUksRUFBSSxPQUFRLElBQUssR0FBTyxHQUFRLEVBQUksSUFDL0MsTUFBUSxHQUFJLEdBQUcsQ0FBQyxFQUdqQixHQUFPLFFBQVUsU0FBVSxFQUFLLEVBQU8sQ0FDdEMsU0FBUSxHQUNELEVBQUksS0FBSyxTQUFVLEVBQUcsRUFBRyxDQUMvQixNQUFRLEdBQU0sR0FBSyxF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S0FDZCxFQUFVLElBQUksRUFBSyxFQUFPLElBR3JCLEVBR1QsWUFBZSxFQUFRLENBQUUsTUFBSyxZQUFZLENBQ3hDLEdBQUksR0FBUSxFQUFVLElBQUksR0FFMUIsR0FBSSxDQUFDLEdBQVMsQ0FBQyxFQUFPLEdBRXBCLEdBQUksQ0FDRixFQUFTLEdBQU8sSUFFaEIsRUFBUyxHQUNOLEtBQUssR0FBUyxDQUNiLEVBQVUsSUFBSSxFQUFLLEVBQU8sR0FDMUIsTUFBTyxHQUFTLEtBR2pCLE1BQU0sR0FBSyxHQUFVLEVBQUssVUFDdEIsRUFBUCxDQUNBLEdBQVUsRUFBSyxHQUluQixhQUFPLEdBQU8sR0FFUCxFQUdULGtCQUFzQixFQUFLLEVBQU8sR0FBSSxDQUNwQyxHQUFNLEdBQVUsSUFFaEIsTUFBSSxRQUFPLEtBQUssR0FBVSxPQUN4QixNQUFNLFNBQVEsV0FBVyxPQUFPLE9BQU8sSUFDaEMsR0FBTSxFQUFLLElBR2IsQ0FBRSxVQUFTLEtBQU0sRUFBVSxRQUdwQyxHQUFPLFFBQVUsQ0FDZixZQUNBLFNBQ0EsU0FDQSxRQUNBLFlDNUVGLHNCQUFNLENBQUUsU0FBVSxLQUNaLENBQUUsbUJBQW1CLEtBQ3JCLENBQUUsZUFBZSxLQUNqQixDQUFFLGtCQUFrQixLQUNwQixDQUFFLHNCQUFzQixLQUN4QixDQUFFLGNBQWMsS0FLdEIsWUFBd0IsRUFBUSxFQUFRLENBQ3RDLE1BQU8sT0FBTyxFQUFPLElBQVksQ0FDL0IsRUFBTSxpQkFBa0IsR0FLeEIsR0FBTSxHQUFPLEVBQU8sRUFBTSxNQUsxQixHQUFJLENBQUMsRUFDSCxTQUFNLFVBQVcsMkJBRVYsR0FBa0IsQ0FDdkIsV0FBWSxJQUNaLEtBQU0sS0FTVixHQUFNLEdBQU0sR0FBYyxDQUN4QixLQUFNLEVBQU0sS0FDWixPQUFRLEVBQU0sV0FDZCxRQUFTLE9BQ0osRUFBTSxTQUNOLEVBQU0sbUJBRVgsS0FBTSxFQUFNLEtBQ1osT0FBUSxHQUFlLEVBQU0sS0FBTSxFQUFLLE9BQ3hDLE1BQU8sT0FDRixFQUFNLHVCQUNOLEVBQU0saUNBRVgsT0FBUSxDQUFFLFFBQU8sYUFHbkIsRUFBTSw0QkFBNkIsR0FFbkMsR0FBTSxHQUFXLEdBQWtCLEtBQU0sR0FBSyxRQUFRLElBRXRELFVBQVUsaUJBRUgsR0FJWCxHQUFPLFFBQVUsQ0FBRSxvQkM5RG5CLEdBQU0sQ0FBRSxpQkFBaUIsS0FDbkIsQ0FBRSxrQkFBa0IsS0FFMUIsT0FBTyxRQUFVLENBQ2YsZ0JBQ0EiLAogICJuYW1lcyI6IFtdCn0K
