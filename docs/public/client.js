;(() => {
  'use strict'
  function t (t, n) {
    for (var e = 0, r = t.length; e < r; e++) if (!n(t[e], e, t)) return !1
    return !0
  }
  const n = '/'
  function e (t) {
    if (t === n) return t
    47 === t.charCodeAt(0) && (t = t.substring(1))
    var e = t.length - 1
    return 47 === t.charCodeAt(e) ? t.substring(0, e) : t
  }
  function r (t) {
    return (t = e(t)) === n ? [n] : t.split(n)
  }
  function o (t, e, r) {
    return (
      (r = t[r]),
      (e.val === r && 0 === e.type) ||
        (r === n ? e.type > 1 : 0 !== e.type && (r || '').endsWith(e.end))
    )
  }
  function a (t) {
    if (t === n) return [{ old: t, type: 0, val: t, end: '' }]
    for (
      var r, o, a, i, c = e(t), u = -1, l = 0, s = c.length, f = [];
      ++u < s;

    )
      if (58 !== (r = c.charCodeAt(u)))
        if (42 !== r) {
          for (l = u; u < s && 47 !== c.charCodeAt(u); ) ++u
          f.push({ old: t, type: 0, val: c.substring(l, u), end: '' }),
            (c = c.substring(u)),
            (s -= u),
            (u = l = 0)
        } else f.push({ old: t, type: 2, val: c.substring(u), end: '' })
      else {
        for (l = u + 1, a = 1, o = 0, i = ''; u < s && 47 !== c.charCodeAt(u); )
          63 === (r = c.charCodeAt(u))
            ? ((o = u), (a = 3))
            : 46 === r && 0 === i.length && (i = c.substring((o = u))),
            u++
        f.push({ old: t, type: a, val: c.substring(l, o || u), end: i }),
          (c = c.substring(u)),
          (s -= u),
          (u = 0)
      }
    return f
  }
  function i (t, e) {
    for (var o, a, i = 0, c = r(t), u = {}; i < e.length; i++)
      (o = c[i]),
        (a = e[i]),
        o !== n &&
          void 0 !== o &&
          !1 | a.type &&
          (u[a.val] = o.replace(a.end, ''))
    return u
  }
  var c = new Map()
  function u (t) {
    return t.replace(window.location.origin, '')
  }
  function l (n, e) {
    var a = '',
      c = '',
      u = n.split(/#|\?/),
      l = u[0],
      s = u.slice(1)
    l = (l = l.replace(/\/$/g, '')) || '/'
    for (var f = 0; f < s.length; f++) {
      var h = n.split(s[f])[0]
      '?' === h[h.length - 1] && (c = s[f]),
        '#' === h[h.length - 1] && (a = s[f])
    }
    var d = (function (n, e) {
        for (
          var a, i, c = 0, u = r(n), l = u.length, s = o.bind(o, u);
          c < e.length;
          c++
        )
          if (
            ((i = (a = e[c]).length) === l ||
              (i < l && 2 === a[i - 1].type) ||
              (i > l && 3 === a[i - 1].type)) &&
            t(a, s)
          )
            return a
        return []
      })(
        l,
        e.map(function (t) {
          return t.matcher
        })
      ),
      p = e.filter(function (t) {
        return t.path === d[0].old
      })[0]
    return d[0]
      ? Object.assign({}, p, {
          params: i(l, d),
          hash: a,
          search: c,
          pathname: l,
          location: n
        })
      : null
  }
  ;(function (t, n) {
    void 0 === n && (n = ['*'])
    var e,
      r = document.querySelector(t),
      o = [],
      i = {}
    n = n
      .concat(n.indexOf('*') < 0 ? '*' : [])
      .reduce(function (t, n) {
        return 'function' == typeof n ? (o.push(n), t) : t.concat(n)
      }, [])
      .map(function (t) {
        return t.path
          ? Object.assign({}, t, { matcher: a(t.path) })
          : { path: t, matcher: a(t) }
      })
    var s = l(u(window.location.href), n),
      f = Object.assign({ previousDocument: null }, s)
    function h (t) {
      return i[t]
        ? i[t].map(function (t) {
            return t(f)
          })
        : []
    }
    function d (t, n, e, a) {
      ;(f.previousDocument = t.cloneNode(!0)),
        Promise.all(
          o.concat(e.handler || []).map(function (t) {
            return t(f)
          })
        ).then(function () {
          requestAnimationFrame(function () {
            ;(r.innerHTML = n), h('after'), e.hash && h('hash')
          })
        })
    }
    function p (n, e, r) {
      if (!e) return (window.location.href = n)
      fetch(n, { credentials: 'include' })
        .then(function (t) {
          return t.text()
        })
        .then(function (o) {
          var a = new window.DOMParser().parseFromString(o, 'text/html'),
            i = [a, a.querySelector(t).innerHTML]
          c.set(n, i), r && r(i[0], i[1], e)
        })
    }
    function g (t, n, r) {
      ;(e = function () {
        var e = c.get(t)
        e && !1 !== n.cache ? d(e[0], e[1], n) : p(t, n, d)
      }),
        Object.assign(f, n),
        Promise.all(h('before')).then(e)
    }
    function v (t) {
      var e = u(t)
      return [e, l(e, n)]
    }
    return (
      document.body.addEventListener('click', function (t) {
        if (
          !(
            t.ctrlKey ||
            t.metaKey ||
            t.altKey ||
            t.shiftKey ||
            t.defaultPrevented
          )
        ) {
          for (var n = t.target; n && (!n.href || 'A' !== n.nodeName); )
            n = n.parentNode
          if (!n) return t
          var e = v(n.href),
            r = e[0],
            o = e[1]
          return o.ignore
            ? t
            : f.pathname === o.pathname && o.hash
            ? (t.preventDefault(), Object.assign(f, o), h('hash'), t)
            : window.location.origin !== n.origin ||
              n.hasAttribute('download') ||
              '_blank' === n.target ||
              /^(?:mailto|tel):/.test(n.href) ||
              n.classList.contains('no-ajax')
            ? t
            : (t.preventDefault(),
              f.location !== r && g(r, o),
              h('navigate'),
              !1)
        }
      }),
      window.addEventListener('popstate', function (t) {
        if (t.target.location.pathname !== f.pathname)
          return g.apply(void 0, v(t.target.location.href).concat([!0])), !1
      }),
      {
        get state () {
          return f
        },
        go: function (t) {
          ;(e = null), g.apply(void 0, v(t).concat([!1]))
        },
        load: function (t, n) {
          return p.apply(void 0, v(t).concat([n]))
        },
        on: function (t, n) {
          return (
            (i[t] = i[t] ? i[t].concat(n) : [n]),
            function () {
              return i[t].slice(i[t].indexOf(n), 1)
            }
          )
        }
      }
    )
  })('#root').on('after', ({ previousDocument: t, location: n }) => {
    document.head.replaceChild(
      t.getElementById('hypo'),
      document.getElementById('hypo')
    ),
      (document.title = t.title),
      window.history.pushState({}, '', n),
      window.scrollTo(0, 0)
  })
})()
//# sourceMappingURL=client.js.map
