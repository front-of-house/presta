!(function (t) {
  var n = {}
  function e (r) {
    if (n[r]) return n[r].exports
    var o = (n[r] = { i: r, l: !1, exports: {} })
    return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports
  }
  ;(e.m = t),
    (e.c = n),
    (e.d = function (t, n, r) {
      e.o(t, n) || Object.defineProperty(t, n, { enumerable: !0, get: r })
    }),
    (e.r = function (t) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 })
    }),
    (e.t = function (t, n) {
      if ((1 & n && (t = e(t)), 8 & n)) return t
      if (4 & n && 'object' == typeof t && t && t.__esModule) return t
      var r = Object.create(null)
      if (
        (e.r(r),
        Object.defineProperty(r, 'default', { enumerable: !0, value: t }),
        2 & n && 'string' != typeof t)
      )
        for (var o in t)
          e.d(
            r,
            o,
            function (n) {
              return t[n]
            }.bind(null, o)
          )
      return r
    }),
    (e.n = function (t) {
      var n =
        t && t.__esModule
          ? function () {
              return t.default
            }
          : function () {
              return t
            }
      return e.d(n, 'a', n), n
    }),
    (e.o = function (t, n) {
      return Object.prototype.hasOwnProperty.call(t, n)
    }),
    (e.p = ''),
    e((e.s = 1))
})([
  function (t, n) {
    t.exports = function (t, n) {
      for (var e = 0, r = t.length; e < r; e++) if (!n(t[e], e, t)) return !1
      return !0
    }
  },
  function (t, n, e) {
    'use strict'
    e.r(n)
    var r = e(0)
    function o (t) {
      if ('/' === t) return t
      47 === t.charCodeAt(0) && (t = t.substring(1))
      var n = t.length - 1
      return 47 === t.charCodeAt(n) ? t.substring(0, n) : t
    }
    function i (t) {
      return '/' === (t = o(t)) ? ['/'] : t.split('/')
    }
    function u (t, n, e) {
      return (
        (e = t[e]),
        (n.val === e && 0 === n.type) ||
          ('/' === e ? n.type > 1 : 0 !== n.type && (e || '').endsWith(n.end))
      )
    }
    function a (t) {
      if ('/' === t) return [{ old: t, type: 0, val: t, end: '' }]
      for (
        var n, e, r, i, u = o(t), a = -1, c = 0, f = u.length, s = [];
        ++a < f;

      )
        if (58 !== (n = u.charCodeAt(a)))
          if (42 !== n) {
            for (c = a; a < f && 47 !== u.charCodeAt(a); ) ++a
            s.push({ old: t, type: 0, val: u.substring(c, a), end: '' }),
              (u = u.substring(a)),
              (f -= a),
              (a = c = 0)
          } else s.push({ old: t, type: 2, val: u.substring(a), end: '' })
        else {
          for (
            c = a + 1, r = 1, e = 0, i = '';
            a < f && 47 !== u.charCodeAt(a);

          )
            63 === (n = u.charCodeAt(a))
              ? ((e = a), (r = 3))
              : 46 === n && 0 === i.length && (i = u.substring((e = a))),
              a++
          s.push({ old: t, type: r, val: u.substring(c, e || a), end: i }),
            (u = u.substring(a)),
            (f -= a),
            (a = 0)
        }
      return s
    }
    function c (t, n) {
      for (var e, r, o = 0, u = i(t), a = {}; o < n.length; o++)
        (e = u[o]),
          (r = n[o]),
          '/' !== e &&
            void 0 !== e &&
            !1 | r.type &&
            (a[r.val] = e.replace(r.end, ''))
      return a
    }
    var f = new Map()
    function s (t) {
      return t.replace(window.location.origin, '')
    }
    function l (t, n) {
      var e = '',
        o = '',
        a = t.split(/#|\?/),
        f = a[0],
        s = a.slice(1)
      f = (f = f.replace(/\/$/g, '')) || '/'
      for (var l = 0; l < s.length; l++) {
        var d = t.split(s[l])[0]
        '?' === d[d.length - 1] && (o = s[l]),
          '#' === d[d.length - 1] && (e = s[l])
      }
      var p = (function (t, n) {
          for (
            var e, o, a = 0, c = i(t), f = c.length, s = u.bind(u, c);
            a < n.length;
            a++
          )
            if (
              ((o = (e = n[a]).length) === f ||
                (o < f && 2 === e[o - 1].type) ||
                (o > f && 3 === e[o - 1].type)) &&
              r(e, s)
            )
              return e
          return []
        })(
          f,
          n.map(function (t) {
            return t.matcher
          })
        ),
        h = n.filter(function (t) {
          return t.path === p[0].old
        })[0]
      return p[0]
        ? Object.assign({}, h, {
            params: c(f, p),
            hash: e,
            search: o,
            pathname: f,
            location: t
          })
        : null
    }
    var d = function (t) {
        if ('object' != typeof (n = t) || Array.isArray(n))
          throw 'state should be an object'
        var n
      },
      p = function (t, n, e, r) {
        return ((o = t),
        o.reduce(function (t, n, e) {
          return t.indexOf(n) > -1 ? t : t.concat(n)
        }, []))
          .reduce(function (t, e) {
            return t.concat(n[e] || [])
          }, [])
          .map(function (t) {
            return t(e, r)
          })
        var o
      }
    function h (t) {
      void 0 === t && (t = {})
      var n = {}
      return {
        getState: function () {
          return Object.assign({}, t)
        },
        hydrate: function (e) {
          return (
            d(e),
            Object.assign(t, e),
            function () {
              var r = ['*'].concat(Object.keys(e))
              p(r, n, t)
            }
          )
        },
        on: function (t, e) {
          return (
            (t = [].concat(t)).map(function (t) {
              return (n[t] = (n[t] || []).concat(e))
            }),
            function () {
              return t.map(function (t) {
                return n[t].splice(n[t].indexOf(e), 1)
              })
            }
          )
        },
        emit: function (e, r, o) {
          var i = ('*' === e ? [] : ['*']).concat(e)
          ;(r = 'function' == typeof r ? r(t) : r) &&
            (d(r), Object.assign(t, r), (i = i.concat(Object.keys(r)))),
            p(i, n, t, o)
        }
      }
    }
    h()
    var v = function (t) {
        return 'object' == typeof t && !Array.isArray(t)
      },
      g = function (t) {
        return 'function' == typeof t
      }
    var m,
      y,
      b,
      w,
      O,
      j,
      A,
      x,
      S,
      P = []
    function C (t, n) {
      return (
        (y = window.pageXOffset),
        (w = window.pageYOffset),
        (j = window.innerHeight),
        (x = window.innerWidth),
        void 0 === b && (b = y),
        void 0 === O && (O = w),
        void 0 === S && (S = x),
        void 0 === A && (A = j),
        (n || w !== O || y !== b || j !== A || x !== S) &&
          ((function (t) {
            for (var n = 0; n < P.length; n++)
              P[n](
                { x: y, y: w, px: b, py: O, vh: j, pvh: A, vw: x, pvw: S },
                t
              )
          })(t),
          (b = y),
          (O = w),
          (A = j),
          (S = x)),
        requestAnimationFrame(C)
      )
    }
    var M = function (t, n) {
      return (
        void 0 === n && (n = {}),
        function (e, r) {
          var o = !1,
            i = parseFloat(t.getAttribute('data-threshold') || n.threshold || 0)
          return (function (t) {
            return (
              P.indexOf(t) < 0 && P.push(t),
              (m = m || C(performance.now())),
              {
                update: function () {
                  return C(performance.now(), !0), this
                },
                destroy: function () {
                  P.splice(P.indexOf(t), 1)
                }
              }
            )
          })(function () {
            for (var n = [], u = arguments.length; u--; ) n[u] = arguments[u]
            var a = n[0],
              c = a.y,
              f = a.vh,
              s = t.getBoundingClientRect(),
              l = s.top + c,
              d = i >= 0.5 ? i : i * f,
              p = l + s.height - d >= c && l + d <= c + f
            p && !o
              ? ((o = !0), e && e.apply(void 0, n))
              : !p && o && ((o = !1), r && r.apply(void 0, n))
          })
        }
      )
    }
    const _ =
      ((q = (t, n) => {
        const e = t.querySelector('img'),
          r = M(t)(() => {
            const t = document.createElement('img')
            ;(t.onload = () => {
              ;(e.src = t.src), (e.style.opacity = 1)
            }),
              (t.src = e.dataset.src)
          })
        return (
          r.update(),
          () => {
            r && r.destroy()
          }
        )
      }),
      function (t, n) {
        var e = []
        return {
          subs: e,
          unmount: q(
            t,
            Object.assign({}, n, {
              on: function (t, r) {
                var o = n.on(t, r)
                return e.push(o), o
              }
            })
          ),
          node: t
        }
      })
    var q
    const D = window.location.hash.replace('#', ''),
      E = (function (t, n) {
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
        var u = l(s(window.location.href), n),
          c = Object.assign({ previousDocument: null }, u)
        function d (t) {
          return i[t]
            ? i[t].map(function (t) {
                return t(c)
              })
            : []
        }
        function p (t, n, e, i) {
          ;(c.previousDocument = t.cloneNode(!0)),
            Promise.all(
              o.concat(e.handler || []).map(function (t) {
                return t(c)
              })
            ).then(function () {
              requestAnimationFrame(function () {
                ;(r.innerHTML = n), d('after'), e.hash && d('hash')
              })
            })
        }
        function h (n, e, r) {
          if (!e) return (window.location.href = n)
          fetch(n, { credentials: 'include' })
            .then(function (t) {
              return t.text()
            })
            .then(function (o) {
              var i = new window.DOMParser().parseFromString(o, 'text/html'),
                u = [i, i.querySelector(t).innerHTML]
              f.set(n, u), r && r(u[0], u[1], e)
            })
        }
        function v (t, n, r) {
          ;(e = function () {
            var e = f.get(t)
            e && !1 !== n.cache ? p(e[0], e[1], n) : h(t, n, p)
          }),
            Object.assign(c, n),
            Promise.all(d('before')).then(e)
        }
        function g (t) {
          var e = s(t)
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
              var e = g(n.href),
                r = e[0],
                o = e[1]
              return o.ignore
                ? t
                : c.pathname === o.pathname && o.hash
                ? (t.preventDefault(), Object.assign(c, o), d('hash'), t)
                : window.location.origin !== n.origin ||
                  n.hasAttribute('download') ||
                  '_blank' === n.target ||
                  /^(?:mailto|tel):/.test(n.href) ||
                  n.classList.contains('no-ajax')
                ? t
                : (t.preventDefault(),
                  c.location !== r && v(r, o),
                  d('navigate'),
                  !1)
            }
          }),
          window.addEventListener('popstate', function (t) {
            if (t.target.location.pathname !== c.pathname)
              return v.apply(void 0, g(t.target.location.href).concat([!0])), !1
          }),
          {
            get state () {
              return c
            },
            go: function (t) {
              ;(e = null), v.apply(void 0, g(t).concat([!1]))
            },
            load: function (t, n) {
              return h.apply(void 0, g(t).concat([n]))
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
      })('#root'),
      L = (function (t, n, e) {
        void 0 === t && (t = {}),
          void 0 === n && (n = {}),
          void 0 === e && (e = [])
        var r = h(n),
          o = []
        return {
          on: r.on,
          emit: r.emit,
          getState: function () {
            return r.getState()
          },
          add: function (n) {
            if (!v(n)) throw 'components should be an object'
            Object.assign(t, n)
          },
          use: function (t) {
            if (!g(t)) throw 'plugins should be a function'
            e.push(t)
          },
          hydrate: function (t) {
            return r.hydrate(t)
          },
          mount: function (n) {
            void 0 === n && (n = 'data-component'), (n = [].concat(n))
            for (var i = 0; i < n.length; i++) {
              for (
                var u = n[i],
                  a = [].slice.call(document.querySelectorAll('[' + u + ']')),
                  c = function () {
                    for (
                      var n = a.pop(), i = n.getAttribute(u).split(/\s/), c = 0;
                      c < i.length;
                      c++
                    ) {
                      var f = t[i[c]]
                      if (f) {
                        n.removeAttribute(u)
                        try {
                          var s = e.reduce(function (t, e) {
                              var o = e(n, r)
                              return v(o) ? Object.assign(t, o) : t
                            }, {}),
                            l = f(n, Object.assign({}, s, r))
                          g(l.unmount) && o.push(l)
                        } catch (t) {
                          console.error(t),
                            r.emit('error', { error: t }),
                            r.hydrate({ error: void 0 })
                        }
                      }
                    }
                  };
                a.length;

              )
                c()
              r.emit('mount')
            }
          },
          unmount: function () {
            for (var t = o.length - 1; t > -1; t--) {
              var n = o[t],
                e = n.subs
              ;(0, n.unmount)(n.node),
                e.map(function (t) {
                  return t()
                }),
                o.splice(t, 1)
            }
            r.emit('unmount')
          }
        }
      })({ img: _ })
    function T (t) {
      try {
        document.getElementById(t).scrollIntoView()
      } catch (t) {}
    }
    D && T(D),
      L.mount(),
      E.on('after', ({ previousDocument: t, location: n }) => {
        document.head.replaceChild(
          t.getElementById('style'),
          document.getElementById('style')
        ),
          (document.title = t.title),
          window.history.pushState({}, '', n),
          window.scrollTo(0, 0),
          L.unmount(),
          L.mount()
      }),
      E.on('hash', ({ hash: t }) => {
        t && T(t)
      })
  }
])
//# sourceMappingURL=client.js.map
