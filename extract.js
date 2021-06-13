var ui = Object.defineProperty
var ci = Object.prototype.hasOwnProperty
var vr = Object.getOwnPropertySymbols,
  ai = Object.prototype.propertyIsEnumerable
var Fr = (e, t, r) =>
    t in e
      ? ui(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (e[t] = r),
  F = (e, t) => {
    for (var r in t || (t = {})) ci.call(t, r) && Fr(e, r, t[r])
    if (vr) for (var r of vr(t)) ai.call(t, r) && Fr(e, r, t[r])
    return e
  }
var y = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports)
var D = y(ze => {
  'use strict'
  ze.fromCallback = function (e) {
    return Object.defineProperty(
      function (...t) {
        if (typeof t[t.length - 1] == 'function') e.apply(this, t)
        else
          return new Promise((r, n) => {
            e.apply(this, t.concat([(i, o) => (i ? n(i) : r(o))]))
          })
      },
      'name',
      { value: e.name }
    )
  }
  ze.fromPromise = function (e) {
    return Object.defineProperty(
      function (...t) {
        let r = t[t.length - 1]
        if (typeof r != 'function') return e.apply(this, t)
        e.apply(this, t.slice(0, -1)).then(n => r(null, n), r)
      },
      'name',
      { value: e.name }
    )
  }
})
var xr = y((Cu, kr) => {
  var z = require('constants'),
    fi = process.cwd,
    _e = null,
    li = process.env.GRACEFUL_FS_PLATFORM || process.platform
  process.cwd = function () {
    return _e || (_e = fi.call(process)), _e
  }
  try {
    process.cwd()
  } catch (e) {}
  var mi = process.chdir
  process.chdir = function (e) {
    ;(_e = null), mi.call(process, e)
  }
  kr.exports = yi
  function yi (e) {
    z.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) &&
      t(e),
      e.lutimes || r(e),
      (e.chown = o(e.chown)),
      (e.fchown = o(e.fchown)),
      (e.lchown = o(e.lchown)),
      (e.chmod = n(e.chmod)),
      (e.fchmod = n(e.fchmod)),
      (e.lchmod = n(e.lchmod)),
      (e.chownSync = s(e.chownSync)),
      (e.fchownSync = s(e.fchownSync)),
      (e.lchownSync = s(e.lchownSync)),
      (e.chmodSync = i(e.chmodSync)),
      (e.fchmodSync = i(e.fchmodSync)),
      (e.lchmodSync = i(e.lchmodSync)),
      (e.stat = c(e.stat)),
      (e.fstat = c(e.fstat)),
      (e.lstat = c(e.lstat)),
      (e.statSync = l(e.statSync)),
      (e.fstatSync = l(e.fstatSync)),
      (e.lstatSync = l(e.lstatSync)),
      e.lchmod ||
        ((e.lchmod = function (u, a, f) {
          f && process.nextTick(f)
        }),
        (e.lchmodSync = function () {})),
      e.lchown ||
        ((e.lchown = function (u, a, f, m) {
          m && process.nextTick(m)
        }),
        (e.lchownSync = function () {})),
      li === 'win32' &&
        (e.rename = (function (u) {
          return function (a, f, m) {
            var d = Date.now(),
              g = 0
            u(a, f, function C (w) {
              if (
                w &&
                (w.code === 'EACCES' || w.code === 'EPERM') &&
                Date.now() - d < 6e4
              ) {
                setTimeout(function () {
                  e.stat(f, function (B, Y) {
                    B && B.code === 'ENOENT' ? u(a, f, C) : m(w)
                  })
                }, g),
                  g < 100 && (g += 10)
                return
              }
              m && m(w)
            })
          }
        })(e.rename)),
      (e.read = (function (u) {
        function a (f, m, d, g, C, w) {
          var B
          if (w && typeof w == 'function') {
            var Y = 0
            B = function (ne, de, ie) {
              if (ne && ne.code === 'EAGAIN' && Y < 10)
                return Y++, u.call(e, f, m, d, g, C, B)
              w.apply(this, arguments)
            }
          }
          return u.call(e, f, m, d, g, C, B)
        }
        return (a.__proto__ = u), a
      })(e.read)),
      (e.readSync = (function (u) {
        return function (a, f, m, d, g) {
          for (var C = 0; ; )
            try {
              return u.call(e, a, f, m, d, g)
            } catch (w) {
              if (w.code === 'EAGAIN' && C < 10) {
                C++
                continue
              }
              throw w
            }
        }
      })(e.readSync))
    function t (u) {
      ;(u.lchmod = function (a, f, m) {
        u.open(a, z.O_WRONLY | z.O_SYMLINK, f, function (d, g) {
          if (d) {
            m && m(d)
            return
          }
          u.fchmod(g, f, function (C) {
            u.close(g, function (w) {
              m && m(C || w)
            })
          })
        })
      }),
        (u.lchmodSync = function (a, f) {
          var m = u.openSync(a, z.O_WRONLY | z.O_SYMLINK, f),
            d = !0,
            g
          try {
            ;(g = u.fchmodSync(m, f)), (d = !1)
          } finally {
            if (d)
              try {
                u.closeSync(m)
              } catch (C) {}
            else u.closeSync(m)
          }
          return g
        })
    }
    function r (u) {
      z.hasOwnProperty('O_SYMLINK')
        ? ((u.lutimes = function (a, f, m, d) {
            u.open(a, z.O_SYMLINK, function (g, C) {
              if (g) {
                d && d(g)
                return
              }
              u.futimes(C, f, m, function (w) {
                u.close(C, function (B) {
                  d && d(w || B)
                })
              })
            })
          }),
          (u.lutimesSync = function (a, f, m) {
            var d = u.openSync(a, z.O_SYMLINK),
              g,
              C = !0
            try {
              ;(g = u.futimesSync(d, f, m)), (C = !1)
            } finally {
              if (C)
                try {
                  u.closeSync(d)
                } catch (w) {}
              else u.closeSync(d)
            }
            return g
          }))
        : ((u.lutimes = function (a, f, m, d) {
            d && process.nextTick(d)
          }),
          (u.lutimesSync = function () {}))
    }
    function n (u) {
      return (
        u &&
        function (a, f, m) {
          return u.call(e, a, f, function (d) {
            h(d) && (d = null), m && m.apply(this, arguments)
          })
        }
      )
    }
    function i (u) {
      return (
        u &&
        function (a, f) {
          try {
            return u.call(e, a, f)
          } catch (m) {
            if (!h(m)) throw m
          }
        }
      )
    }
    function o (u) {
      return (
        u &&
        function (a, f, m, d) {
          return u.call(e, a, f, m, function (g) {
            h(g) && (g = null), d && d.apply(this, arguments)
          })
        }
      )
    }
    function s (u) {
      return (
        u &&
        function (a, f, m) {
          try {
            return u.call(e, a, f, m)
          } catch (d) {
            if (!h(d)) throw d
          }
        }
      )
    }
    function c (u) {
      return (
        u &&
        function (a, f, m) {
          typeof f == 'function' && ((m = f), (f = null))
          function d (g, C) {
            C &&
              (C.uid < 0 && (C.uid += 4294967296),
              C.gid < 0 && (C.gid += 4294967296)),
              m && m.apply(this, arguments)
          }
          return f ? u.call(e, a, f, d) : u.call(e, a, d)
        }
      )
    }
    function l (u) {
      return (
        u &&
        function (a, f) {
          var m = f ? u.call(e, a, f) : u.call(e, a)
          return (
            m.uid < 0 && (m.uid += 4294967296),
            m.gid < 0 && (m.gid += 4294967296),
            m
          )
        }
      )
    }
    function h (u) {
      if (!u || u.code === 'ENOSYS') return !0
      var a = !process.getuid || process.getuid() !== 0
      return !!(a && (u.code === 'EINVAL' || u.code === 'EPERM'))
    }
  }
})
var _r = y((vu, Or) => {
  var qr = require('stream').Stream
  Or.exports = di
  function di (e) {
    return { ReadStream: t, WriteStream: r }
    function t (n, i) {
      if (!(this instanceof t)) return new t(n, i)
      qr.call(this)
      var o = this
      ;(this.path = n),
        (this.fd = null),
        (this.readable = !0),
        (this.paused = !1),
        (this.flags = 'r'),
        (this.mode = 438),
        (this.bufferSize = 64 * 1024),
        (i = i || {})
      for (var s = Object.keys(i), c = 0, l = s.length; c < l; c++) {
        var h = s[c]
        this[h] = i[h]
      }
      if (
        (this.encoding && this.setEncoding(this.encoding),
        this.start !== void 0)
      ) {
        if (typeof this.start != 'number')
          throw TypeError('start must be a Number')
        if (this.end === void 0) this.end = Infinity
        else if (typeof this.end != 'number')
          throw TypeError('end must be a Number')
        if (this.start > this.end) throw new Error('start must be <= end')
        this.pos = this.start
      }
      if (this.fd !== null) {
        process.nextTick(function () {
          o._read()
        })
        return
      }
      e.open(this.path, this.flags, this.mode, function (u, a) {
        if (u) {
          o.emit('error', u), (o.readable = !1)
          return
        }
        ;(o.fd = a), o.emit('open', a), o._read()
      })
    }
    function r (n, i) {
      if (!(this instanceof r)) return new r(n, i)
      qr.call(this),
        (this.path = n),
        (this.fd = null),
        (this.writable = !0),
        (this.flags = 'w'),
        (this.encoding = 'binary'),
        (this.mode = 438),
        (this.bytesWritten = 0),
        (i = i || {})
      for (var o = Object.keys(i), s = 0, c = o.length; s < c; s++) {
        var l = o[s]
        this[l] = i[l]
      }
      if (this.start !== void 0) {
        if (typeof this.start != 'number')
          throw TypeError('start must be a Number')
        if (this.start < 0) throw new Error('start must be >= zero')
        this.pos = this.start
      }
      ;(this.busy = !1),
        (this._queue = []),
        this.fd === null &&
          ((this._open = e.open),
          this._queue.push([
            this._open,
            this.path,
            this.flags,
            this.mode,
            void 0
          ]),
          this.flush())
    }
  }
})
var Nr = y((Fu, br) => {
  'use strict'
  br.exports = hi
  function hi (e) {
    if (e === null || typeof e != 'object') return e
    if (e instanceof Object) var t = { __proto__: e.__proto__ }
    else var t = Object.create(null)
    return (
      Object.getOwnPropertyNames(e).forEach(function (r) {
        Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r))
      }),
      t
    )
  }
})
var q = y((ku, Ke) => {
  var k = require('fs'),
    pi = xr(),
    gi = _r(),
    wi = Nr(),
    be = require('util'),
    U,
    Ne
  typeof Symbol == 'function' && typeof Symbol.for == 'function'
    ? ((U = Symbol.for('graceful-fs.queue')),
      (Ne = Symbol.for('graceful-fs.previous')))
    : ((U = '___graceful-fs.queue'), (Ne = '___graceful-fs.previous'))
  function Si () {}
  function Pr (e, t) {
    Object.defineProperty(e, U, {
      get: function () {
        return t
      }
    })
  }
  var he = Si
  be.debuglog
    ? (he = be.debuglog('gfs4'))
    : /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
      (he = function () {
        var e = be.format.apply(be, arguments)
        ;(e =
          'GFS4: ' +
          e.split(/\n/).join(`
GFS4: `)),
          console.error(e)
      })
  k[U] ||
    ((Tr = global[U] || []),
    Pr(k, Tr),
    (k.close = (function (e) {
      function t (r, n) {
        return e.call(k, r, function (i) {
          i || ee(), typeof n == 'function' && n.apply(this, arguments)
        })
      }
      return Object.defineProperty(t, Ne, { value: e }), t
    })(k.close)),
    (k.closeSync = (function (e) {
      function t (r) {
        e.apply(k, arguments), ee()
      }
      return Object.defineProperty(t, Ne, { value: e }), t
    })(k.closeSync)),
    /\bgfs4\b/i.test(process.env.NODE_DEBUG || '') &&
      process.on('exit', function () {
        he(k[U]), require('assert').equal(k[U].length, 0)
      }))
  var Tr
  global[U] || Pr(global, k[U])
  Ke.exports = Xe(wi(k))
  process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH &&
    !k.__patched &&
    ((Ke.exports = Xe(k)), (k.__patched = !0))
  function Xe (e) {
    pi(e),
      (e.gracefulify = Xe),
      (e.createReadStream = Y),
      (e.createWriteStream = ne)
    var t = e.readFile
    e.readFile = r
    function r (p, v, S) {
      return typeof v == 'function' && ((S = v), (v = null)), x(p, v, S)
      function x (M, P, O) {
        return t(M, P, function (A) {
          A && (A.code === 'EMFILE' || A.code === 'ENFILE')
            ? pe([x, [M, P, O]])
            : (typeof O == 'function' && O.apply(this, arguments), ee())
        })
      }
    }
    var n = e.writeFile
    e.writeFile = i
    function i (p, v, S, x) {
      return typeof S == 'function' && ((x = S), (S = null)), M(p, v, S, x)
      function M (P, O, A, $) {
        return n(P, O, A, function (W) {
          W && (W.code === 'EMFILE' || W.code === 'ENFILE')
            ? pe([M, [P, O, A, $]])
            : (typeof $ == 'function' && $.apply(this, arguments), ee())
        })
      }
    }
    var o = e.appendFile
    o && (e.appendFile = s)
    function s (p, v, S, x) {
      return typeof S == 'function' && ((x = S), (S = null)), M(p, v, S, x)
      function M (P, O, A, $) {
        return o(P, O, A, function (W) {
          W && (W.code === 'EMFILE' || W.code === 'ENFILE')
            ? pe([M, [P, O, A, $]])
            : (typeof $ == 'function' && $.apply(this, arguments), ee())
        })
      }
    }
    var c = e.readdir
    e.readdir = l
    function l (p, v, S) {
      var x = [p]
      return typeof v != 'function' ? x.push(v) : (S = v), x.push(M), h(x)
      function M (P, O) {
        O && O.sort && O.sort(),
          P && (P.code === 'EMFILE' || P.code === 'ENFILE')
            ? pe([h, [x]])
            : (typeof S == 'function' && S.apply(this, arguments), ee())
      }
    }
    function h (p) {
      return c.apply(e, p)
    }
    if (process.version.substr(0, 4) === 'v0.8') {
      var u = gi(e)
      ;(g = u.ReadStream), (w = u.WriteStream)
    }
    var a = e.ReadStream
    a && ((g.prototype = Object.create(a.prototype)), (g.prototype.open = C))
    var f = e.WriteStream
    f && ((w.prototype = Object.create(f.prototype)), (w.prototype.open = B)),
      Object.defineProperty(e, 'ReadStream', {
        get: function () {
          return g
        },
        set: function (p) {
          g = p
        },
        enumerable: !0,
        configurable: !0
      }),
      Object.defineProperty(e, 'WriteStream', {
        get: function () {
          return w
        },
        set: function (p) {
          w = p
        },
        enumerable: !0,
        configurable: !0
      })
    var m = g
    Object.defineProperty(e, 'FileReadStream', {
      get: function () {
        return m
      },
      set: function (p) {
        m = p
      },
      enumerable: !0,
      configurable: !0
    })
    var d = w
    Object.defineProperty(e, 'FileWriteStream', {
      get: function () {
        return d
      },
      set: function (p) {
        d = p
      },
      enumerable: !0,
      configurable: !0
    })
    function g (p, v) {
      return this instanceof g
        ? (a.apply(this, arguments), this)
        : g.apply(Object.create(g.prototype), arguments)
    }
    function C () {
      var p = this
      ie(p.path, p.flags, p.mode, function (v, S) {
        v
          ? (p.autoClose && p.destroy(), p.emit('error', v))
          : ((p.fd = S), p.emit('open', S), p.read())
      })
    }
    function w (p, v) {
      return this instanceof w
        ? (f.apply(this, arguments), this)
        : w.apply(Object.create(w.prototype), arguments)
    }
    function B () {
      var p = this
      ie(p.path, p.flags, p.mode, function (v, S) {
        v ? (p.destroy(), p.emit('error', v)) : ((p.fd = S), p.emit('open', S))
      })
    }
    function Y (p, v) {
      return new e.ReadStream(p, v)
    }
    function ne (p, v) {
      return new e.WriteStream(p, v)
    }
    var de = e.open
    e.open = ie
    function ie (p, v, S, x) {
      return typeof S == 'function' && ((x = S), (S = null)), M(p, v, S, x)
      function M (P, O, A, $) {
        return de(P, O, A, function (W, wu) {
          W && (W.code === 'EMFILE' || W.code === 'ENFILE')
            ? pe([M, [P, O, A, $]])
            : (typeof $ == 'function' && $.apply(this, arguments), ee())
        })
      }
    }
    return e
  }
  function pe (e) {
    he('ENQUEUE', e[0].name, e[1]), k[U].push(e)
  }
  function ee () {
    var e = k[U].shift()
    e && (he('RETRY', e[0].name, e[1]), e[0].apply(null, e[1]))
  }
})
var ge = y(K => {
  'use strict'
  var Rr = D().fromCallback,
    T = q(),
    Ei = [
      'access',
      'appendFile',
      'chmod',
      'chown',
      'close',
      'copyFile',
      'fchmod',
      'fchown',
      'fdatasync',
      'fstat',
      'fsync',
      'ftruncate',
      'futimes',
      'lchmod',
      'lchown',
      'link',
      'lstat',
      'mkdir',
      'mkdtemp',
      'open',
      'opendir',
      'readdir',
      'readFile',
      'readlink',
      'realpath',
      'rename',
      'rmdir',
      'stat',
      'symlink',
      'truncate',
      'unlink',
      'utimes',
      'writeFile'
    ].filter(e => typeof T[e] == 'function')
  Object.keys(T).forEach(e => {
    e !== 'promises' && (K[e] = T[e])
  })
  Ei.forEach(e => {
    K[e] = Rr(T[e])
  })
  K.exists = function (e, t) {
    return typeof t == 'function'
      ? T.exists(e, t)
      : new Promise(r => T.exists(e, r))
  }
  K.read = function (e, t, r, n, i, o) {
    return typeof o == 'function'
      ? T.read(e, t, r, n, i, o)
      : new Promise((s, c) => {
          T.read(e, t, r, n, i, (l, h, u) => {
            if (l) return c(l)
            s({ bytesRead: h, buffer: u })
          })
        })
  }
  K.write = function (e, t, ...r) {
    return typeof r[r.length - 1] == 'function'
      ? T.write(e, t, ...r)
      : new Promise((n, i) => {
          T.write(e, t, ...r, (o, s, c) => {
            if (o) return i(o)
            n({ bytesWritten: s, buffer: c })
          })
        })
  }
  typeof T.writev == 'function' &&
    (K.writev = function (e, t, ...r) {
      return typeof r[r.length - 1] == 'function'
        ? T.writev(e, t, ...r)
        : new Promise((n, i) => {
            T.writev(e, t, ...r, (o, s, c) => {
              if (o) return i(o)
              n({ bytesWritten: s, buffers: c })
            })
          })
    })
  typeof T.realpath.native == 'function' &&
    (K.realpath.native = Rr(T.realpath.native))
})
var He = y((Ou, Dr) => {
  Dr.exports = e => {
    let t = process.versions.node.split('.').map(r => parseInt(r, 10))
    return (
      (e = e.split('.').map(r => parseInt(r, 10))),
      t[0] > e[0] ||
        (t[0] === e[0] && (t[1] > e[1] || (t[1] === e[1] && t[2] >= e[2])))
    )
  }
})
var jr = y((qu, Qe) => {
  'use strict'
  var oe = ge(),
    V = require('path'),
    Ci = He(),
    Ir = Ci('10.12.0'),
    Lr = e => {
      if (
        process.platform === 'win32' &&
        /[<>:"|?*]/.test(e.replace(V.parse(e).root, ''))
      ) {
        let r = new Error(`Path contains invalid characters: ${e}`)
        throw ((r.code = 'EINVAL'), r)
      }
    },
    Mr = e => {
      let t = { mode: 511 }
      return typeof e == 'number' && (e = { mode: e }), F(F({}, t), e)
    },
    Ar = e => {
      let t = new Error(`operation not permitted, mkdir '${e}'`)
      return (
        (t.code = 'EPERM'),
        (t.errno = -4048),
        (t.path = e),
        (t.syscall = 'mkdir'),
        t
      )
    }
  Qe.exports.makeDir = async (e, t) => {
    if ((Lr(e), (t = Mr(t)), Ir)) {
      let n = V.resolve(e)
      return oe.mkdir(n, { mode: t.mode, recursive: !0 })
    }
    let r = async n => {
      try {
        await oe.mkdir(n, t.mode)
      } catch (i) {
        if (i.code === 'EPERM') throw i
        if (i.code === 'ENOENT') {
          if (V.dirname(n) === n) throw Ar(n)
          if (i.message.includes('null bytes')) throw i
          return await r(V.dirname(n)), r(n)
        }
        try {
          if (!(await oe.stat(n)).isDirectory())
            throw new Error('The path is not a directory')
        } catch {
          throw i
        }
      }
    }
    return r(V.resolve(e))
  }
  Qe.exports.makeDirSync = (e, t) => {
    if ((Lr(e), (t = Mr(t)), Ir)) {
      let n = V.resolve(e)
      return oe.mkdirSync(n, { mode: t.mode, recursive: !0 })
    }
    let r = n => {
      try {
        oe.mkdirSync(n, t.mode)
      } catch (i) {
        if (i.code === 'EPERM') throw i
        if (i.code === 'ENOENT') {
          if (V.dirname(n) === n) throw Ar(n)
          if (i.message.includes('null bytes')) throw i
          return r(V.dirname(n)), r(n)
        }
        try {
          if (!oe.statSync(n).isDirectory())
            throw new Error('The path is not a directory')
        } catch {
          throw i
        }
      }
    }
    return r(V.resolve(e))
  }
})
var J = y((_u, Br) => {
  'use strict'
  var vi = D().fromPromise,
    { makeDir: Fi, makeDirSync: Ze } = jr(),
    er = vi(Fi)
  Br.exports = {
    mkdirs: er,
    mkdirsSync: Ze,
    mkdirp: er,
    mkdirpSync: Ze,
    ensureDir: er,
    ensureDirSync: Ze
  }
})
var rr = y((bu, $r) => {
  'use strict'
  var se = q()
  function ki (e, t, r, n) {
    se.open(e, 'r+', (i, o) => {
      if (i) return n(i)
      se.futimes(o, t, r, s => {
        se.close(o, c => {
          n && n(s || c)
        })
      })
    })
  }
  function xi (e, t, r) {
    let n = se.openSync(e, 'r+')
    return se.futimesSync(n, t, r), se.closeSync(n)
  }
  $r.exports = { utimesMillis: ki, utimesMillisSync: xi }
})
var we = y((Nu, Wr) => {
  'use strict'
  var ue = ge(),
    I = require('path'),
    Oi = require('util'),
    qi = He(),
    Pe = qi('10.5.0'),
    Ur = e => (Pe ? ue.stat(e, { bigint: !0 }) : ue.stat(e)),
    tr = e => (Pe ? ue.statSync(e, { bigint: !0 }) : ue.statSync(e))
  function _i (e, t) {
    return Promise.all([
      Ur(e),
      Ur(t).catch(r => {
        if (r.code === 'ENOENT') return null
        throw r
      })
    ]).then(([r, n]) => ({ srcStat: r, destStat: n }))
  }
  function bi (e, t) {
    let r,
      n = tr(e)
    try {
      r = tr(t)
    } catch (i) {
      if (i.code === 'ENOENT') return { srcStat: n, destStat: null }
      throw i
    }
    return { srcStat: n, destStat: r }
  }
  function Ni (e, t, r, n) {
    Oi.callbackify(_i)(e, t, (i, o) => {
      if (i) return n(i)
      let { srcStat: s, destStat: c } = o
      return c && Te(s, c)
        ? n(new Error('Source and destination must not be the same.'))
        : s.isDirectory() && nr(e, t)
        ? n(new Error(Re(e, t, r)))
        : n(null, { srcStat: s, destStat: c })
    })
  }
  function Pi (e, t, r) {
    let { srcStat: n, destStat: i } = bi(e, t)
    if (i && Te(n, i))
      throw new Error('Source and destination must not be the same.')
    if (n.isDirectory() && nr(e, t)) throw new Error(Re(e, t, r))
    return { srcStat: n, destStat: i }
  }
  function Jr (e, t, r, n, i) {
    let o = I.resolve(I.dirname(e)),
      s = I.resolve(I.dirname(r))
    if (s === o || s === I.parse(s).root) return i()
    let c = (l, h) =>
      l
        ? l.code === 'ENOENT'
          ? i()
          : i(l)
        : Te(t, h)
        ? i(new Error(Re(e, r, n)))
        : Jr(e, t, s, n, i)
    Pe ? ue.stat(s, { bigint: !0 }, c) : ue.stat(s, c)
  }
  function Gr (e, t, r, n) {
    let i = I.resolve(I.dirname(e)),
      o = I.resolve(I.dirname(r))
    if (o === i || o === I.parse(o).root) return
    let s
    try {
      s = tr(o)
    } catch (c) {
      if (c.code === 'ENOENT') return
      throw c
    }
    if (Te(t, s)) throw new Error(Re(e, r, n))
    return Gr(e, t, o, n)
  }
  function Te (e, t) {
    return !!(
      t.ino &&
      t.dev &&
      t.ino === e.ino &&
      t.dev === e.dev &&
      (Pe ||
        t.ino < Number.MAX_SAFE_INTEGER ||
        (t.size === e.size &&
          t.mode === e.mode &&
          t.nlink === e.nlink &&
          t.atimeMs === e.atimeMs &&
          t.mtimeMs === e.mtimeMs &&
          t.ctimeMs === e.ctimeMs &&
          t.birthtimeMs === e.birthtimeMs))
    )
  }
  function nr (e, t) {
    let r = I.resolve(e)
        .split(I.sep)
        .filter(i => i),
      n = I.resolve(t)
        .split(I.sep)
        .filter(i => i)
    return r.reduce((i, o, s) => i && n[s] === o, !0)
  }
  function Re (e, t, r) {
    return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`
  }
  Wr.exports = {
    checkPaths: Ni,
    checkPathsSync: Pi,
    checkParentPaths: Jr,
    checkParentPathsSync: Gr,
    isSrcSubdir: nr
  }
})
var Xr = y((Pu, Yr) => {
  'use strict'
  var _ = q(),
    Se = require('path'),
    Ti = J().mkdirsSync,
    Ri = rr().utimesMillisSync,
    Ee = we()
  function Ii (e, t, r) {
    typeof r == 'function' && (r = { filter: r }),
      (r = r || {}),
      (r.clobber = 'clobber' in r ? !!r.clobber : !0),
      (r.overwrite = 'overwrite' in r ? !!r.overwrite : r.clobber),
      r.preserveTimestamps &&
        process.arch === 'ia32' &&
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`)
    let { srcStat: n, destStat: i } = Ee.checkPathsSync(e, t, 'copy')
    return Ee.checkParentPathsSync(e, n, t, 'copy'), Di(i, e, t, r)
  }
  function Di (e, t, r, n) {
    if (n.filter && !n.filter(t, r)) return
    let i = Se.dirname(r)
    return _.existsSync(i) || Ti(i), Vr(e, t, r, n)
  }
  function Vr (e, t, r, n) {
    if (!(n.filter && !n.filter(t, r))) return Li(e, t, r, n)
  }
  function Li (e, t, r, n) {
    let o = (n.dereference ? _.statSync : _.lstatSync)(t)
    if (o.isDirectory()) return Ai(o, e, t, r, n)
    if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice())
      return Mi(o, e, t, r, n)
    if (o.isSymbolicLink()) return ji(e, t, r, n)
  }
  function Mi (e, t, r, n, i) {
    return t ? Bi(e, r, n, i) : zr(e, r, n, i)
  }
  function Bi (e, t, r, n) {
    if (n.overwrite) return _.unlinkSync(r), zr(e, t, r, n)
    if (n.errorOnExist) throw new Error(`'${r}' already exists`)
  }
  function zr (e, t, r, n) {
    return (
      _.copyFileSync(t, r),
      n.preserveTimestamps && $i(e.mode, t, r),
      ir(r, e.mode)
    )
  }
  function $i (e, t, r) {
    return Wi(e) && Ui(r, e), Ji(t, r)
  }
  function Wi (e) {
    return (e & 128) == 0
  }
  function Ui (e, t) {
    return ir(e, t | 128)
  }
  function ir (e, t) {
    return _.chmodSync(e, t)
  }
  function Ji (e, t) {
    let r = _.statSync(e)
    return Ri(t, r.atime, r.mtime)
  }
  function Ai (e, t, r, n, i) {
    if (!t) return Gi(e.mode, r, n, i)
    if (t && !t.isDirectory())
      throw new Error(
        `Cannot overwrite non-directory '${n}' with directory '${r}'.`
      )
    return Kr(r, n, i)
  }
  function Gi (e, t, r, n) {
    return _.mkdirSync(r), Kr(t, r, n), ir(r, e)
  }
  function Kr (e, t, r) {
    _.readdirSync(e).forEach(n => Yi(n, e, t, r))
  }
  function Yi (e, t, r, n) {
    let i = Se.join(t, e),
      o = Se.join(r, e),
      { destStat: s } = Ee.checkPathsSync(i, o, 'copy')
    return Vr(s, i, o, n)
  }
  function ji (e, t, r, n) {
    let i = _.readlinkSync(t)
    if ((n.dereference && (i = Se.resolve(process.cwd(), i)), e)) {
      let o
      try {
        o = _.readlinkSync(r)
      } catch (s) {
        if (s.code === 'EINVAL' || s.code === 'UNKNOWN')
          return _.symlinkSync(i, r)
        throw s
      }
      if (
        (n.dereference && (o = Se.resolve(process.cwd(), o)),
        Ee.isSrcSubdir(i, o))
      )
        throw new Error(
          `Cannot copy '${i}' to a subdirectory of itself, '${o}'.`
        )
      if (_.statSync(r).isDirectory() && Ee.isSrcSubdir(o, i))
        throw new Error(`Cannot overwrite '${o}' with '${i}'.`)
      return Vi(i, r)
    } else return _.symlinkSync(i, r)
  }
  function Vi (e, t) {
    return _.unlinkSync(t), _.symlinkSync(e, t)
  }
  Yr.exports = Ii
})
var or = y((Tu, Hr) => {
  'use strict'
  Hr.exports = { copySync: Xr() }
})
var X = y((Ru, Qr) => {
  'use strict'
  var zi = D().fromPromise,
    Zr = ge()
  function Ki (e) {
    return Zr.access(e)
      .then(() => !0)
      .catch(() => !1)
  }
  Qr.exports = { pathExists: zi(Ki), pathExistsSync: Zr.existsSync }
})
var ct = y((Du, et) => {
  'use strict'
  var L = q(),
    Ce = require('path'),
    Xi = J().mkdirs,
    Hi = X().pathExists,
    Qi = rr().utimesMillis,
    ve = we()
  function Zi (e, t, r, n) {
    typeof r == 'function' && !n
      ? ((n = r), (r = {}))
      : typeof r == 'function' && (r = { filter: r }),
      (n = n || function () {}),
      (r = r || {}),
      (r.clobber = 'clobber' in r ? !!r.clobber : !0),
      (r.overwrite = 'overwrite' in r ? !!r.overwrite : r.clobber),
      r.preserveTimestamps &&
        process.arch === 'ia32' &&
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`),
      ve.checkPaths(e, t, 'copy', (i, o) => {
        if (i) return n(i)
        let { srcStat: s, destStat: c } = o
        ve.checkParentPaths(e, s, t, 'copy', l =>
          l ? n(l) : r.filter ? tt(rt, c, e, t, r, n) : rt(c, e, t, r, n)
        )
      })
  }
  function rt (e, t, r, n, i) {
    let o = Ce.dirname(r)
    Hi(o, (s, c) => {
      if (s) return i(s)
      if (c) return sr(e, t, r, n, i)
      Xi(o, l => (l ? i(l) : sr(e, t, r, n, i)))
    })
  }
  function tt (e, t, r, n, i, o) {
    Promise.resolve(i.filter(r, n)).then(
      s => (s ? e(t, r, n, i, o) : o()),
      s => o(s)
    )
  }
  function sr (e, t, r, n, i) {
    return n.filter ? tt(nt, e, t, r, n, i) : nt(e, t, r, n, i)
  }
  function nt (e, t, r, n, i) {
    ;(n.dereference ? L.stat : L.lstat)(t, (s, c) => {
      if (s) return i(s)
      if (c.isDirectory()) return ro(c, e, t, r, n, i)
      if (c.isFile() || c.isCharacterDevice() || c.isBlockDevice())
        return eo(c, e, t, r, n, i)
      if (c.isSymbolicLink()) return to(e, t, r, n, i)
    })
  }
  function eo (e, t, r, n, i, o) {
    return t ? no(e, r, n, i, o) : it(e, r, n, i, o)
  }
  function no (e, t, r, n, i) {
    if (n.overwrite) L.unlink(r, o => (o ? i(o) : it(e, t, r, n, i)))
    else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i()
  }
  function it (e, t, r, n, i) {
    L.copyFile(t, r, o =>
      o ? i(o) : n.preserveTimestamps ? io(e.mode, t, r, i) : De(r, e.mode, i)
    )
  }
  function io (e, t, r, n) {
    return oo(e) ? so(r, e, i => (i ? n(i) : ot(e, t, r, n))) : ot(e, t, r, n)
  }
  function oo (e) {
    return (e & 128) == 0
  }
  function so (e, t, r) {
    return De(e, t | 128, r)
  }
  function ot (e, t, r, n) {
    uo(t, r, i => (i ? n(i) : De(r, e, n)))
  }
  function De (e, t, r) {
    return L.chmod(e, t, r)
  }
  function uo (e, t, r) {
    L.stat(e, (n, i) => (n ? r(n) : Qi(t, i.atime, i.mtime, r)))
  }
  function ro (e, t, r, n, i, o) {
    return t
      ? t && !t.isDirectory()
        ? o(
            new Error(
              `Cannot overwrite non-directory '${n}' with directory '${r}'.`
            )
          )
        : st(r, n, i, o)
      : co(e.mode, r, n, i, o)
  }
  function co (e, t, r, n, i) {
    L.mkdir(r, o => {
      if (o) return i(o)
      st(t, r, n, s => (s ? i(s) : De(r, e, i)))
    })
  }
  function st (e, t, r, n) {
    L.readdir(e, (i, o) => (i ? n(i) : ut(o, e, t, r, n)))
  }
  function ut (e, t, r, n, i) {
    let o = e.pop()
    return o ? ao(e, o, t, r, n, i) : i()
  }
  function ao (e, t, r, n, i, o) {
    let s = Ce.join(r, t),
      c = Ce.join(n, t)
    ve.checkPaths(s, c, 'copy', (l, h) => {
      if (l) return o(l)
      let { destStat: u } = h
      sr(u, s, c, i, a => (a ? o(a) : ut(e, r, n, i, o)))
    })
  }
  function to (e, t, r, n, i) {
    L.readlink(t, (o, s) => {
      if (o) return i(o)
      if ((n.dereference && (s = Ce.resolve(process.cwd(), s)), e))
        L.readlink(r, (c, l) =>
          c
            ? c.code === 'EINVAL' || c.code === 'UNKNOWN'
              ? L.symlink(s, r, i)
              : i(c)
            : (n.dereference && (l = Ce.resolve(process.cwd(), l)),
              ve.isSrcSubdir(s, l)
                ? i(
                    new Error(
                      `Cannot copy '${s}' to a subdirectory of itself, '${l}'.`
                    )
                  )
                : e.isDirectory() && ve.isSrcSubdir(l, s)
                ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`))
                : fo(s, r, i))
        )
      else return L.symlink(s, r, i)
    })
  }
  function fo (e, t, r) {
    L.unlink(t, n => (n ? r(n) : L.symlink(e, t, r)))
  }
  et.exports = Zi
})
var ur = y((Iu, at) => {
  'use strict'
  var lo = D().fromCallback
  at.exports = { copy: lo(ct()) }
})
var wt = y((Lu, ft) => {
  'use strict'
  var lt = q(),
    mt = require('path'),
    E = require('assert'),
    Fe = process.platform === 'win32'
  function yt (e) {
    ;['unlink', 'chmod', 'stat', 'lstat', 'rmdir', 'readdir'].forEach(r => {
      ;(e[r] = e[r] || lt[r]), (r = r + 'Sync'), (e[r] = e[r] || lt[r])
    }),
      (e.maxBusyTries = e.maxBusyTries || 3)
  }
  function cr (e, t, r) {
    let n = 0
    typeof t == 'function' && ((r = t), (t = {})),
      E(e, 'rimraf: missing path'),
      E.strictEqual(typeof e, 'string', 'rimraf: path should be a string'),
      E.strictEqual(typeof r, 'function', 'rimraf: callback function required'),
      E(t, 'rimraf: invalid options argument provided'),
      E.strictEqual(typeof t, 'object', 'rimraf: options should be object'),
      yt(t),
      dt(e, t, function i (o) {
        if (o) {
          if (
            (o.code === 'EBUSY' ||
              o.code === 'ENOTEMPTY' ||
              o.code === 'EPERM') &&
            n < t.maxBusyTries
          ) {
            n++
            let s = n * 100
            return setTimeout(() => dt(e, t, i), s)
          }
          o.code === 'ENOENT' && (o = null)
        }
        r(o)
      })
  }
  function dt (e, t, r) {
    E(e),
      E(t),
      E(typeof r == 'function'),
      t.lstat(e, (n, i) => {
        if (n && n.code === 'ENOENT') return r(null)
        if (n && n.code === 'EPERM' && Fe) return ht(e, t, n, r)
        if (i && i.isDirectory()) return Ie(e, t, n, r)
        t.unlink(e, o => {
          if (o) {
            if (o.code === 'ENOENT') return r(null)
            if (o.code === 'EPERM') return Fe ? ht(e, t, o, r) : Ie(e, t, o, r)
            if (o.code === 'EISDIR') return Ie(e, t, o, r)
          }
          return r(o)
        })
      })
  }
  function ht (e, t, r, n) {
    E(e),
      E(t),
      E(typeof n == 'function'),
      t.chmod(e, 438, i => {
        i
          ? n(i.code === 'ENOENT' ? null : r)
          : t.stat(e, (o, s) => {
              o
                ? n(o.code === 'ENOENT' ? null : r)
                : s.isDirectory()
                ? Ie(e, t, r, n)
                : t.unlink(e, n)
            })
      })
  }
  function pt (e, t, r) {
    let n
    E(e), E(t)
    try {
      t.chmodSync(e, 438)
    } catch (i) {
      if (i.code === 'ENOENT') return
      throw r
    }
    try {
      n = t.statSync(e)
    } catch (i) {
      if (i.code === 'ENOENT') return
      throw r
    }
    n.isDirectory() ? Le(e, t, r) : t.unlinkSync(e)
  }
  function Ie (e, t, r, n) {
    E(e),
      E(t),
      E(typeof n == 'function'),
      t.rmdir(e, i => {
        i &&
        (i.code === 'ENOTEMPTY' || i.code === 'EEXIST' || i.code === 'EPERM')
          ? mo(e, t, n)
          : i && i.code === 'ENOTDIR'
          ? n(r)
          : n(i)
      })
  }
  function mo (e, t, r) {
    E(e),
      E(t),
      E(typeof r == 'function'),
      t.readdir(e, (n, i) => {
        if (n) return r(n)
        let o = i.length,
          s
        if (o === 0) return t.rmdir(e, r)
        i.forEach(c => {
          cr(mt.join(e, c), t, l => {
            if (!s) {
              if (l) return r((s = l))
              --o == 0 && t.rmdir(e, r)
            }
          })
        })
      })
  }
  function gt (e, t) {
    let r
    ;(t = t || {}),
      yt(t),
      E(e, 'rimraf: missing path'),
      E.strictEqual(typeof e, 'string', 'rimraf: path should be a string'),
      E(t, 'rimraf: missing options'),
      E.strictEqual(typeof t, 'object', 'rimraf: options should be object')
    try {
      r = t.lstatSync(e)
    } catch (n) {
      if (n.code === 'ENOENT') return
      n.code === 'EPERM' && Fe && pt(e, t, n)
    }
    try {
      r && r.isDirectory() ? Le(e, t, null) : t.unlinkSync(e)
    } catch (n) {
      if (n.code === 'ENOENT') return
      if (n.code === 'EPERM') return Fe ? pt(e, t, n) : Le(e, t, n)
      if (n.code !== 'EISDIR') throw n
      Le(e, t, n)
    }
  }
  function Le (e, t, r) {
    E(e), E(t)
    try {
      t.rmdirSync(e)
    } catch (n) {
      if (n.code === 'ENOTDIR') throw r
      if (n.code === 'ENOTEMPTY' || n.code === 'EEXIST' || n.code === 'EPERM')
        yo(e, t)
      else if (n.code !== 'ENOENT') throw n
    }
  }
  function yo (e, t) {
    if ((E(e), E(t), t.readdirSync(e).forEach(r => gt(mt.join(e, r), t)), Fe)) {
      let r = Date.now()
      do
        try {
          return t.rmdirSync(e, t)
        } catch {}
      while (Date.now() - r < 500)
    } else return t.rmdirSync(e, t)
  }
  ft.exports = cr
  cr.sync = gt
})
var ke = y((Mu, St) => {
  'use strict'
  var ho = D().fromCallback,
    Et = wt()
  St.exports = { remove: ho(Et), removeSync: Et.sync }
})
var _t = y((Au, Ct) => {
  'use strict'
  var po = D().fromCallback,
    vt = q(),
    Ft = require('path'),
    kt = J(),
    xt = ke(),
    Ot = po(function (t, r) {
      ;(r = r || function () {}),
        vt.readdir(t, (n, i) => {
          if (n) return kt.mkdirs(t, r)
          ;(i = i.map(s => Ft.join(t, s))), o()
          function o () {
            let s = i.pop()
            if (!s) return r()
            xt.remove(s, c => {
              if (c) return r(c)
              o()
            })
          }
        })
    })
  function qt (e) {
    let t
    try {
      t = vt.readdirSync(e)
    } catch {
      return kt.mkdirsSync(e)
    }
    t.forEach(r => {
      ;(r = Ft.join(e, r)), xt.removeSync(r)
    })
  }
  Ct.exports = {
    emptyDirSync: qt,
    emptydirSync: qt,
    emptyDir: Ot,
    emptydir: Ot
  }
})
var Tt = y((ju, bt) => {
  'use strict'
  var go = D().fromCallback,
    Nt = require('path'),
    H = q(),
    Pt = J()
  function wo (e, t) {
    function r () {
      H.writeFile(e, '', n => {
        if (n) return t(n)
        t()
      })
    }
    H.stat(e, (n, i) => {
      if (!n && i.isFile()) return t()
      let o = Nt.dirname(e)
      H.stat(o, (s, c) => {
        if (s)
          return s.code === 'ENOENT'
            ? Pt.mkdirs(o, l => {
                if (l) return t(l)
                r()
              })
            : t(s)
        c.isDirectory()
          ? r()
          : H.readdir(o, l => {
              if (l) return t(l)
            })
      })
    })
  }
  function So (e) {
    let t
    try {
      t = H.statSync(e)
    } catch {}
    if (t && t.isFile()) return
    let r = Nt.dirname(e)
    try {
      H.statSync(r).isDirectory() || H.readdirSync(r)
    } catch (n) {
      if (n && n.code === 'ENOENT') Pt.mkdirsSync(r)
      else throw n
    }
    H.writeFileSync(e, '')
  }
  bt.exports = { createFile: go(wo), createFileSync: So }
})
var Mt = y((Bu, Rt) => {
  'use strict'
  var Eo = D().fromCallback,
    Dt = require('path'),
    re = q(),
    It = J(),
    Lt = X().pathExists
  function Co (e, t, r) {
    function n (i, o) {
      re.link(i, o, s => {
        if (s) return r(s)
        r(null)
      })
    }
    Lt(t, (i, o) => {
      if (i) return r(i)
      if (o) return r(null)
      re.lstat(e, s => {
        if (s)
          return (s.message = s.message.replace('lstat', 'ensureLink')), r(s)
        let c = Dt.dirname(t)
        Lt(c, (l, h) => {
          if (l) return r(l)
          if (h) return n(e, t)
          It.mkdirs(c, u => {
            if (u) return r(u)
            n(e, t)
          })
        })
      })
    })
  }
  function vo (e, t) {
    if (re.existsSync(t)) return
    try {
      re.lstatSync(e)
    } catch (o) {
      throw ((o.message = o.message.replace('lstat', 'ensureLink')), o)
    }
    let n = Dt.dirname(t)
    return re.existsSync(n) || It.mkdirsSync(n), re.linkSync(e, t)
  }
  Rt.exports = { createLink: Eo(Co), createLinkSync: vo }
})
var jt = y(($u, At) => {
  'use strict'
  var Q = require('path'),
    xe = q(),
    Fo = X().pathExists
  function ko (e, t, r) {
    if (Q.isAbsolute(e))
      return xe.lstat(e, n =>
        n
          ? ((n.message = n.message.replace('lstat', 'ensureSymlink')), r(n))
          : r(null, { toCwd: e, toDst: e })
      )
    {
      let n = Q.dirname(t),
        i = Q.join(n, e)
      return Fo(i, (o, s) =>
        o
          ? r(o)
          : s
          ? r(null, { toCwd: i, toDst: e })
          : xe.lstat(e, c =>
              c
                ? ((c.message = c.message.replace('lstat', 'ensureSymlink')),
                  r(c))
                : r(null, { toCwd: e, toDst: Q.relative(n, e) })
            )
      )
    }
  }
  function xo (e, t) {
    let r
    if (Q.isAbsolute(e)) {
      if (((r = xe.existsSync(e)), !r))
        throw new Error('absolute srcpath does not exist')
      return { toCwd: e, toDst: e }
    } else {
      let n = Q.dirname(t),
        i = Q.join(n, e)
      if (((r = xe.existsSync(i)), r)) return { toCwd: i, toDst: e }
      if (((r = xe.existsSync(e)), !r))
        throw new Error('relative srcpath does not exist')
      return { toCwd: e, toDst: Q.relative(n, e) }
    }
  }
  At.exports = { symlinkPaths: ko, symlinkPathsSync: xo }
})
var Wt = y((Wu, Bt) => {
  'use strict'
  var $t = q()
  function Oo (e, t, r) {
    if (
      ((r = typeof t == 'function' ? t : r),
      (t = typeof t == 'function' ? !1 : t),
      t)
    )
      return r(null, t)
    $t.lstat(e, (n, i) => {
      if (n) return r(null, 'file')
      ;(t = i && i.isDirectory() ? 'dir' : 'file'), r(null, t)
    })
  }
  function qo (e, t) {
    let r
    if (t) return t
    try {
      r = $t.lstatSync(e)
    } catch {
      return 'file'
    }
    return r && r.isDirectory() ? 'dir' : 'file'
  }
  Bt.exports = { symlinkType: Oo, symlinkTypeSync: qo }
})
var Kt = y((Uu, Ut) => {
  'use strict'
  var _o = D().fromCallback,
    Jt = require('path'),
    ce = q(),
    Gt = J(),
    bo = Gt.mkdirs,
    No = Gt.mkdirsSync,
    Yt = jt(),
    Po = Yt.symlinkPaths,
    To = Yt.symlinkPathsSync,
    Vt = Wt(),
    Ro = Vt.symlinkType,
    Do = Vt.symlinkTypeSync,
    zt = X().pathExists
  function Io (e, t, r, n) {
    ;(n = typeof r == 'function' ? r : n),
      (r = typeof r == 'function' ? !1 : r),
      zt(t, (i, o) => {
        if (i) return n(i)
        if (o) return n(null)
        Po(e, t, (s, c) => {
          if (s) return n(s)
          ;(e = c.toDst),
            Ro(c.toCwd, r, (l, h) => {
              if (l) return n(l)
              let u = Jt.dirname(t)
              zt(u, (a, f) => {
                if (a) return n(a)
                if (f) return ce.symlink(e, t, h, n)
                bo(u, m => {
                  if (m) return n(m)
                  ce.symlink(e, t, h, n)
                })
              })
            })
        })
      })
  }
  function Lo (e, t, r) {
    if (ce.existsSync(t)) return
    let i = To(e, t)
    ;(e = i.toDst), (r = Do(i.toCwd, r))
    let o = Jt.dirname(t)
    return ce.existsSync(o) || No(o), ce.symlinkSync(e, t, r)
  }
  Ut.exports = { createSymlink: _o(Io), createSymlinkSync: Lo }
})
var Ht = y((Ju, Xt) => {
  'use strict'
  var Me = Tt(),
    Ae = Mt(),
    je = Kt()
  Xt.exports = {
    createFile: Me.createFile,
    createFileSync: Me.createFileSync,
    ensureFile: Me.createFile,
    ensureFileSync: Me.createFileSync,
    createLink: Ae.createLink,
    createLinkSync: Ae.createLinkSync,
    ensureLink: Ae.createLink,
    ensureLinkSync: Ae.createLinkSync,
    createSymlink: je.createSymlink,
    createSymlinkSync: je.createSymlinkSync,
    ensureSymlink: je.createSymlink,
    ensureSymlinkSync: je.createSymlinkSync
  }
})
var Be = y((Gu, Qt) => {
  function Mo (e, t = {}) {
    let r =
      t.EOL ||
      `
`
    return (
      JSON.stringify(e, t ? t.replacer : null, t.spaces).replace(/\n/g, r) + r
    )
  }
  function Ao (e) {
    return (
      Buffer.isBuffer(e) && (e = e.toString('utf8')), e.replace(/^\uFEFF/, '')
    )
  }
  Qt.exports = { stringify: Mo, stripBom: Ao }
})
var tn = y((Yu, Zt) => {
  var ae
  try {
    ae = q()
  } catch (e) {
    ae = require('fs')
  }
  var $e = D(),
    { stringify: en, stripBom: rn } = Be()
  async function jo (e, t = {}) {
    typeof t == 'string' && (t = { encoding: t })
    let r = t.fs || ae,
      n = 'throws' in t ? t.throws : !0,
      i = await $e.fromCallback(r.readFile)(e, t)
    i = rn(i)
    let o
    try {
      o = JSON.parse(i, t ? t.reviver : null)
    } catch (s) {
      if (n) throw ((s.message = `${e}: ${s.message}`), s)
      return null
    }
    return o
  }
  var Bo = $e.fromPromise(jo)
  function $o (e, t = {}) {
    typeof t == 'string' && (t = { encoding: t })
    let r = t.fs || ae,
      n = 'throws' in t ? t.throws : !0
    try {
      let i = r.readFileSync(e, t)
      return (i = rn(i)), JSON.parse(i, t.reviver)
    } catch (i) {
      if (n) throw ((i.message = `${e}: ${i.message}`), i)
      return null
    }
  }
  async function Wo (e, t, r = {}) {
    let n = r.fs || ae,
      i = en(t, r)
    await $e.fromCallback(n.writeFile)(e, i, r)
  }
  var Uo = $e.fromPromise(Wo)
  function Jo (e, t, r = {}) {
    let n = r.fs || ae,
      i = en(t, r)
    return n.writeFileSync(e, i, r)
  }
  var Go = { readFile: Bo, readFileSync: $o, writeFile: Uo, writeFileSync: Jo }
  Zt.exports = Go
})
var on = y((Vu, nn) => {
  'use strict'
  var We = tn()
  nn.exports = {
    readJson: We.readFile,
    readJsonSync: We.readFileSync,
    writeJson: We.writeFile,
    writeJsonSync: We.writeFileSync
  }
})
var Ue = y((zu, sn) => {
  'use strict'
  var Yo = D().fromCallback,
    Oe = q(),
    un = require('path'),
    cn = J(),
    Vo = X().pathExists
  function zo (e, t, r, n) {
    typeof r == 'function' && ((n = r), (r = 'utf8'))
    let i = un.dirname(e)
    Vo(i, (o, s) => {
      if (o) return n(o)
      if (s) return Oe.writeFile(e, t, r, n)
      cn.mkdirs(i, c => {
        if (c) return n(c)
        Oe.writeFile(e, t, r, n)
      })
    })
  }
  function Ko (e, ...t) {
    let r = un.dirname(e)
    if (Oe.existsSync(r)) return Oe.writeFileSync(e, ...t)
    cn.mkdirsSync(r), Oe.writeFileSync(e, ...t)
  }
  sn.exports = { outputFile: Yo(zo), outputFileSync: Ko }
})
var fn = y((Ku, an) => {
  'use strict'
  var { stringify: Xo } = Be(),
    { outputFile: Ho } = Ue()
  async function Qo (e, t, r = {}) {
    let n = Xo(t, r)
    await Ho(e, n, r)
  }
  an.exports = Qo
})
var mn = y((Xu, ln) => {
  'use strict'
  var { stringify: Zo } = Be(),
    { outputFileSync: es } = Ue()
  function rs (e, t, r) {
    let n = Zo(t, r)
    es(e, n, r)
  }
  ln.exports = rs
})
var dn = y((Hu, yn) => {
  'use strict'
  var ts = D().fromPromise,
    R = on()
  R.outputJson = ts(fn())
  R.outputJsonSync = mn()
  R.outputJSON = R.outputJson
  R.outputJSONSync = R.outputJsonSync
  R.writeJSON = R.writeJson
  R.writeJSONSync = R.writeJsonSync
  R.readJSON = R.readJson
  R.readJSONSync = R.readJsonSync
  yn.exports = R
})
var En = y((Qu, hn) => {
  'use strict'
  var pn = q(),
    ns = require('path'),
    is = or().copySync,
    gn = ke().removeSync,
    os = J().mkdirpSync,
    wn = we()
  function us (e, t, r) {
    r = r || {}
    let n = r.overwrite || r.clobber || !1,
      { srcStat: i } = wn.checkPathsSync(e, t, 'move')
    return (
      wn.checkParentPathsSync(e, i, t, 'move'), os(ns.dirname(t)), ss(e, t, n)
    )
  }
  function ss (e, t, r) {
    if (r) return gn(t), Sn(e, t, r)
    if (pn.existsSync(t)) throw new Error('dest already exists.')
    return Sn(e, t, r)
  }
  function Sn (e, t, r) {
    try {
      pn.renameSync(e, t)
    } catch (n) {
      if (n.code !== 'EXDEV') throw n
      return cs(e, t, r)
    }
  }
  function cs (e, t, r) {
    return is(e, t, { overwrite: r, errorOnExist: !0 }), gn(e)
  }
  hn.exports = us
})
var vn = y((Zu, Cn) => {
  'use strict'
  Cn.exports = { moveSync: En() }
})
var qn = y((ec, Fn) => {
  'use strict'
  var as = q(),
    fs = require('path'),
    ls = ur().copy,
    kn = ke().remove,
    ms = J().mkdirp,
    ys = X().pathExists,
    xn = we()
  function hs (e, t, r, n) {
    typeof r == 'function' && ((n = r), (r = {}))
    let i = r.overwrite || r.clobber || !1
    xn.checkPaths(e, t, 'move', (o, s) => {
      if (o) return n(o)
      let { srcStat: c } = s
      xn.checkParentPaths(e, c, t, 'move', l => {
        if (l) return n(l)
        ms(fs.dirname(t), h => (h ? n(h) : ds(e, t, i, n)))
      })
    })
  }
  function ds (e, t, r, n) {
    if (r) return kn(t, i => (i ? n(i) : On(e, t, r, n)))
    ys(t, (i, o) =>
      i ? n(i) : o ? n(new Error('dest already exists.')) : On(e, t, r, n)
    )
  }
  function On (e, t, r, n) {
    as.rename(e, t, i =>
      i ? (i.code !== 'EXDEV' ? n(i) : ps(e, t, r, n)) : n()
    )
  }
  function ps (e, t, r, n) {
    ls(e, t, { overwrite: r, errorOnExist: !0 }, o => (o ? n(o) : kn(e, n)))
  }
  Fn.exports = hs
})
var bn = y((rc, _n) => {
  'use strict'
  var gs = D().fromCallback
  _n.exports = { move: gs(qn()) }
})
var Pn = y((tc, ar) => {
  'use strict'
  ar.exports = F(
    F(
      F(
        F(
          F(
            F(F(F(F(F(F(F({}, ge()), or()), ur()), _t()), Ht()), dn()), J()),
            vn()
          ),
          bn()
        ),
        Ue()
      ),
      X()
    ),
    ke()
  )
  var Nn = require('fs')
  Object.getOwnPropertyDescriptor(Nn, 'promises') &&
    Object.defineProperty(ar.exports, 'promises', {
      get () {
        return Nn.promises
      }
    })
})
var fr = y((nc, Tn) => {
  var ws = 'presta.config.js',
    Ss = 'static',
    Es = 'functions/presta.js'
  Tn.exports = {
    CONFIG_DEFAULT: ws,
    OUTPUT_STATIC_DIR: Ss,
    OUTPUT_DYNAMIC_PAGES_ENTRY: Es
  }
})
var Ln = y((ic, qe) => {
  'use strict'
  var Cs = process.env.TERM_PROGRAM === 'Hyper',
    vs = process.platform === 'win32',
    Rn = process.platform === 'linux',
    lr = {
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
    Dn = Object.assign({}, lr, {
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
    In = Object.assign({}, lr, {
      ballotCross: '\u2718',
      check: '\u2714',
      cross: '\u2716',
      ellipsisLarge: '\u22EF',
      ellipsis: '\u2026',
      info: '\u2139',
      question: '?',
      questionFull: '\uFF1F',
      questionSmall: '\uFE56',
      pointer: Rn ? '\u25B8' : '\u276F',
      pointerSmall: Rn ? '\u2023' : '\u203A',
      radioOff: '\u25EF',
      radioOn: '\u25C9',
      warning: '\u26A0'
    })
  qe.exports = vs && !Cs ? Dn : In
  Reflect.defineProperty(qe.exports, 'common', { enumerable: !1, value: lr })
  Reflect.defineProperty(qe.exports, 'windows', { enumerable: !1, value: Dn })
  Reflect.defineProperty(qe.exports, 'other', { enumerable: !1, value: In })
})
var yr = y((oc, mr) => {
  'use strict'
  var Fs = e => e !== null && typeof e == 'object' && !Array.isArray(e),
    ks = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g,
    Mn = () => {
      let e = { enabled: !0, visible: !0, styles: {}, keys: {} }
      'FORCE_COLOR' in process.env &&
        (e.enabled = process.env.FORCE_COLOR !== '0')
      let t = o => {
          let s = (o.open = `[${o.codes[0]}m`),
            c = (o.close = `[${o.codes[1]}m`),
            l = (o.regex = new RegExp(`\\u001b\\[${o.codes[1]}m`, 'g'))
          return (
            (o.wrap = (h, u) => {
              h.includes(c) && (h = h.replace(l, c + s))
              let a = s + h + c
              return u ? a.replace(/\r*\n/g, `${c}$&${s}`) : a
            }),
            o
          )
        },
        r = (o, s, c) => (typeof o == 'function' ? o(s) : o.wrap(s, c)),
        n = (o, s) => {
          if (o === '' || o == null) return ''
          if (e.enabled === !1) return o
          if (e.visible === !1) return ''
          let c = '' + o,
            l = c.includes(`
`),
            h = s.length
          for (
            h > 0 &&
            s.includes('unstyle') &&
            (s = [...new Set(['unstyle', ...s])].reverse());
            h-- > 0;

          )
            c = r(e.styles[s[h]], c, l)
          return c
        },
        i = (o, s, c) => {
          ;(e.styles[o] = t({ name: o, codes: s })),
            (e.keys[c] || (e.keys[c] = [])).push(o),
            Reflect.defineProperty(e, o, {
              configurable: !0,
              enumerable: !0,
              set (h) {
                e.alias(o, h)
              },
              get () {
                let h = u => n(u, h.stack)
                return (
                  Reflect.setPrototypeOf(h, e),
                  (h.stack = this.stack ? this.stack.concat(o) : [o]),
                  h
                )
              }
            })
        }
      return (
        i('reset', [0, 0], 'modifier'),
        i('bold', [1, 22], 'modifier'),
        i('dim', [2, 22], 'modifier'),
        i('italic', [3, 23], 'modifier'),
        i('underline', [4, 24], 'modifier'),
        i('inverse', [7, 27], 'modifier'),
        i('hidden', [8, 28], 'modifier'),
        i('strikethrough', [9, 29], 'modifier'),
        i('black', [30, 39], 'color'),
        i('red', [31, 39], 'color'),
        i('green', [32, 39], 'color'),
        i('yellow', [33, 39], 'color'),
        i('blue', [34, 39], 'color'),
        i('magenta', [35, 39], 'color'),
        i('cyan', [36, 39], 'color'),
        i('white', [37, 39], 'color'),
        i('gray', [90, 39], 'color'),
        i('grey', [90, 39], 'color'),
        i('bgBlack', [40, 49], 'bg'),
        i('bgRed', [41, 49], 'bg'),
        i('bgGreen', [42, 49], 'bg'),
        i('bgYellow', [43, 49], 'bg'),
        i('bgBlue', [44, 49], 'bg'),
        i('bgMagenta', [45, 49], 'bg'),
        i('bgCyan', [46, 49], 'bg'),
        i('bgWhite', [47, 49], 'bg'),
        i('blackBright', [90, 39], 'bright'),
        i('redBright', [91, 39], 'bright'),
        i('greenBright', [92, 39], 'bright'),
        i('yellowBright', [93, 39], 'bright'),
        i('blueBright', [94, 39], 'bright'),
        i('magentaBright', [95, 39], 'bright'),
        i('cyanBright', [96, 39], 'bright'),
        i('whiteBright', [97, 39], 'bright'),
        i('bgBlackBright', [100, 49], 'bgBright'),
        i('bgRedBright', [101, 49], 'bgBright'),
        i('bgGreenBright', [102, 49], 'bgBright'),
        i('bgYellowBright', [103, 49], 'bgBright'),
        i('bgBlueBright', [104, 49], 'bgBright'),
        i('bgMagentaBright', [105, 49], 'bgBright'),
        i('bgCyanBright', [106, 49], 'bgBright'),
        i('bgWhiteBright', [107, 49], 'bgBright'),
        (e.ansiRegex = ks),
        (e.hasColor = e.hasAnsi = o => (
          (e.ansiRegex.lastIndex = 0),
          typeof o == 'string' && o !== '' && e.ansiRegex.test(o)
        )),
        (e.alias = (o, s) => {
          let c = typeof s == 'string' ? e[s] : s
          if (typeof c != 'function')
            throw new TypeError(
              'Expected alias to be the name of an existing color (string) or a function'
            )
          c.stack ||
            (Reflect.defineProperty(c, 'name', { value: o }),
            (e.styles[o] = c),
            (c.stack = [o])),
            Reflect.defineProperty(e, o, {
              configurable: !0,
              enumerable: !0,
              set (l) {
                e.alias(o, l)
              },
              get () {
                let l = h => n(h, l.stack)
                return (
                  Reflect.setPrototypeOf(l, e),
                  (l.stack = this.stack ? this.stack.concat(c.stack) : c.stack),
                  l
                )
              }
            })
        }),
        (e.theme = o => {
          if (!Fs(o)) throw new TypeError('Expected theme to be an object')
          for (let s of Object.keys(o)) e.alias(s, o[s])
          return e
        }),
        e.alias('unstyle', o =>
          typeof o == 'string' && o !== ''
            ? ((e.ansiRegex.lastIndex = 0), o.replace(e.ansiRegex, ''))
            : ''
        ),
        e.alias('noop', o => o),
        (e.none = e.clear = e.noop),
        (e.stripColor = e.unstyle),
        (e.symbols = Ln()),
        (e.define = i),
        e
      )
    }
  mr.exports = Mn()
  mr.exports.create = Mn
})
var jn = y((sc, An) => {
  var fe = 1e3,
    le = fe * 60,
    me = le * 60,
    te = me * 24,
    xs = te * 7,
    Os = te * 365.25
  An.exports = function (e, t) {
    t = t || {}
    var r = typeof e
    if (r === 'string' && e.length > 0) return qs(e)
    if (r === 'number' && isFinite(e)) return t.long ? bs(e) : _s(e)
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(e)
    )
  }
  function qs (e) {
    if (((e = String(e)), !(e.length > 100))) {
      var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        e
      )
      if (!!t) {
        var r = parseFloat(t[1]),
          n = (t[2] || 'ms').toLowerCase()
        switch (n) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return r * Os
          case 'weeks':
          case 'week':
          case 'w':
            return r * xs
          case 'days':
          case 'day':
          case 'd':
            return r * te
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return r * me
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return r * le
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return r * fe
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return r
          default:
            return
        }
      }
    }
  }
  function _s (e) {
    var t = Math.abs(e)
    return t >= te
      ? Math.round(e / te) + 'd'
      : t >= me
      ? Math.round(e / me) + 'h'
      : t >= le
      ? Math.round(e / le) + 'm'
      : t >= fe
      ? Math.round(e / fe) + 's'
      : e + 'ms'
  }
  function bs (e) {
    var t = Math.abs(e)
    return t >= te
      ? Je(e, t, te, 'day')
      : t >= me
      ? Je(e, t, me, 'hour')
      : t >= le
      ? Je(e, t, le, 'minute')
      : t >= fe
      ? Je(e, t, fe, 'second')
      : e + ' ms'
  }
  function Je (e, t, r, n) {
    var i = t >= r * 1.5
    return Math.round(e / r) + ' ' + n + (i ? 's' : '')
  }
})
var dr = y((uc, Bn) => {
  function Ns (e) {
    ;(r.debug = r),
      (r.default = r),
      (r.coerce = h),
      (r.disable = s),
      (r.enable = o),
      (r.enabled = c),
      (r.humanize = jn()),
      Object.keys(e).forEach(u => {
        r[u] = e[u]
      }),
      (r.instances = []),
      (r.names = []),
      (r.skips = []),
      (r.formatters = {})
    function t (u) {
      let a = 0
      for (let f = 0; f < u.length; f++)
        (a = (a << 5) - a + u.charCodeAt(f)), (a |= 0)
      return r.colors[Math.abs(a) % r.colors.length]
    }
    r.selectColor = t
    function r (u) {
      let a
      function f (...m) {
        if (!f.enabled) return
        let d = f,
          g = Number(new Date()),
          C = g - (a || g)
        ;(d.diff = C),
          (d.prev = a),
          (d.curr = g),
          (a = g),
          (m[0] = r.coerce(m[0])),
          typeof m[0] != 'string' && m.unshift('%O')
        let w = 0
        ;(m[0] = m[0].replace(/%([a-zA-Z%])/g, (Y, ne) => {
          if (Y === '%%') return Y
          w++
          let de = r.formatters[ne]
          if (typeof de == 'function') {
            let ie = m[w]
            ;(Y = de.call(d, ie)), m.splice(w, 1), w--
          }
          return Y
        })),
          r.formatArgs.call(d, m),
          (d.log || r.log).apply(d, m)
      }
      return (
        (f.namespace = u),
        (f.enabled = r.enabled(u)),
        (f.useColors = r.useColors()),
        (f.color = t(u)),
        (f.destroy = n),
        (f.extend = i),
        typeof r.init == 'function' && r.init(f),
        r.instances.push(f),
        f
      )
    }
    function n () {
      let u = r.instances.indexOf(this)
      return u !== -1 ? (r.instances.splice(u, 1), !0) : !1
    }
    function i (u, a) {
      let f = r(this.namespace + (typeof a == 'undefined' ? ':' : a) + u)
      return (f.log = this.log), f
    }
    function o (u) {
      r.save(u), (r.names = []), (r.skips = [])
      let a,
        f = (typeof u == 'string' ? u : '').split(/[\s,]+/),
        m = f.length
      for (a = 0; a < m; a++)
        !f[a] ||
          ((u = f[a].replace(/\*/g, '.*?')),
          u[0] === '-'
            ? r.skips.push(new RegExp('^' + u.substr(1) + '$'))
            : r.names.push(new RegExp('^' + u + '$')))
      for (a = 0; a < r.instances.length; a++) {
        let d = r.instances[a]
        d.enabled = r.enabled(d.namespace)
      }
    }
    function s () {
      let u = [...r.names.map(l), ...r.skips.map(l).map(a => '-' + a)].join(',')
      return r.enable(''), u
    }
    function c (u) {
      if (u[u.length - 1] === '*') return !0
      let a, f
      for (a = 0, f = r.skips.length; a < f; a++)
        if (r.skips[a].test(u)) return !1
      for (a = 0, f = r.names.length; a < f; a++)
        if (r.names[a].test(u)) return !0
      return !1
    }
    function l (u) {
      return u
        .toString()
        .substring(2, u.toString().length - 2)
        .replace(/\.\*\?$/, '*')
    }
    function h (u) {
      return u instanceof Error ? u.stack || u.message : u
    }
    return r.enable(r.load()), r
  }
  Bn.exports = Ns
})
var $n = y((j, Ge) => {
  j.log = Ps
  j.formatArgs = Ts
  j.save = Rs
  j.load = Ds
  j.useColors = Is
  j.storage = Ls()
  j.colors = [
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
  function Is () {
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
  function Ts (e) {
    if (
      ((e[0] =
        (this.useColors ? '%c' : '') +
        this.namespace +
        (this.useColors ? ' %c' : ' ') +
        e[0] +
        (this.useColors ? '%c ' : ' ') +
        '+' +
        Ge.exports.humanize(this.diff)),
      !this.useColors)
    )
      return
    let t = 'color: ' + this.color
    e.splice(1, 0, t, 'color: inherit')
    let r = 0,
      n = 0
    e[0].replace(/%[a-zA-Z%]/g, i => {
      i !== '%%' && (r++, i === '%c' && (n = r))
    }),
      e.splice(n, 0, t)
  }
  function Ps (...e) {
    return typeof console == 'object' && console.log && console.log(...e)
  }
  function Rs (e) {
    try {
      e ? j.storage.setItem('debug', e) : j.storage.removeItem('debug')
    } catch (t) {}
  }
  function Ds () {
    let e
    try {
      e = j.storage.getItem('debug')
    } catch (t) {}
    return (
      !e &&
        typeof process != 'undefined' &&
        'env' in process &&
        (e = process.env.DEBUG),
      e
    )
  }
  function Ls () {
    try {
      return localStorage
    } catch (e) {}
  }
  Ge.exports = dr()(j)
  var { formatters: Ms } = Ge.exports
  Ms.j = function (e) {
    try {
      return JSON.stringify(e)
    } catch (t) {
      return '[UnexpectedJSONParseError]: ' + t.message
    }
  }
})
var Un = y((cc, Wn) => {
  'use strict'
  Wn.exports = (e, t) => {
    t = t || process.argv
    let r = e.startsWith('-') ? '' : e.length === 1 ? '-' : '--',
      n = t.indexOf(r + e),
      i = t.indexOf('--')
    return n !== -1 && (i === -1 ? !0 : n < i)
  }
})
var Gn = y((ac, Jn) => {
  'use strict'
  var As = require('os'),
    G = Un(),
    b = process.env,
    ye
  G('no-color') || G('no-colors') || G('color=false')
    ? (ye = !1)
    : (G('color') || G('colors') || G('color=true') || G('color=always')) &&
      (ye = !0)
  'FORCE_COLOR' in b &&
    (ye = b.FORCE_COLOR.length === 0 || parseInt(b.FORCE_COLOR, 10) !== 0)
  function js (e) {
    return e === 0
      ? !1
      : { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 }
  }
  function Bs (e) {
    if (ye === !1) return 0
    if (G('color=16m') || G('color=full') || G('color=truecolor')) return 3
    if (G('color=256')) return 2
    if (e && !e.isTTY && ye !== !0) return 0
    let t = ye ? 1 : 0
    if (process.platform === 'win32') {
      let r = As.release().split('.')
      return Number(process.versions.node.split('.')[0]) >= 8 &&
        Number(r[0]) >= 10 &&
        Number(r[2]) >= 10586
        ? Number(r[2]) >= 14931
          ? 3
          : 2
        : 1
    }
    if ('CI' in b)
      return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(
        r => r in b
      ) || b.CI_NAME === 'codeship'
        ? 1
        : t
    if ('TEAMCITY_VERSION' in b)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(b.TEAMCITY_VERSION) ? 1 : 0
    if (b.COLORTERM === 'truecolor') return 3
    if ('TERM_PROGRAM' in b) {
      let r = parseInt((b.TERM_PROGRAM_VERSION || '').split('.')[0], 10)
      switch (b.TERM_PROGRAM) {
        case 'iTerm.app':
          return r >= 3 ? 3 : 2
        case 'Apple_Terminal':
          return 2
      }
    }
    return /-256(color)?$/i.test(b.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
          b.TERM
        ) || 'COLORTERM' in b
      ? 1
      : (b.TERM === 'dumb', t)
  }
  function hr (e) {
    let t = Bs(e)
    return js(t)
  }
  Jn.exports = {
    supportsColor: hr,
    stdout: hr(process.stdout),
    stderr: hr(process.stderr)
  }
})
var Vn = y((N, Ye) => {
  var $s = require('tty'),
    pr = require('util')
  N.init = Ws
  N.log = Us
  N.formatArgs = Js
  N.save = Gs
  N.load = Ys
  N.useColors = Vs
  N.colors = [6, 2, 3, 4, 5, 1]
  try {
    let e = Gn()
    e &&
      (e.stderr || e).level >= 2 &&
      (N.colors = [
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
  N.inspectOpts = Object.keys(process.env)
    .filter(e => /^debug_/i.test(e))
    .reduce((e, t) => {
      let r = t
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (i, o) => o.toUpperCase()),
        n = process.env[t]
      return (
        /^(yes|on|true|enabled)$/i.test(n)
          ? (n = !0)
          : /^(no|off|false|disabled)$/i.test(n)
          ? (n = !1)
          : n === 'null'
          ? (n = null)
          : (n = Number(n)),
        (e[r] = n),
        e
      )
    }, {})
  function Vs () {
    return 'colors' in N.inspectOpts
      ? Boolean(N.inspectOpts.colors)
      : $s.isatty(process.stderr.fd)
  }
  function Js (e) {
    let { namespace: t, useColors: r } = this
    if (r) {
      let n = this.color,
        i = '[3' + (n < 8 ? n : '8;5;' + n),
        o = `  ${i};1m${t} [0m`
      ;(e[0] =
        o +
        e[0]
          .split(
            `
`
          )
          .join(
            `
` + o
          )),
        e.push(i + 'm+' + Ye.exports.humanize(this.diff) + '[0m')
    } else e[0] = zs() + t + ' ' + e[0]
  }
  function zs () {
    return N.inspectOpts.hideDate ? '' : new Date().toISOString() + ' '
  }
  function Us (...e) {
    return process.stderr.write(
      pr.format(...e) +
        `
`
    )
  }
  function Gs (e) {
    e ? (process.env.DEBUG = e) : delete process.env.DEBUG
  }
  function Ys () {
    return process.env.DEBUG
  }
  function Ws (e) {
    e.inspectOpts = {}
    let t = Object.keys(N.inspectOpts)
    for (let r = 0; r < t.length; r++) e.inspectOpts[t[r]] = N.inspectOpts[t[r]]
  }
  Ye.exports = dr()(N)
  var { formatters: Yn } = Ye.exports
  Yn.o = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      pr.inspect(e, this.inspectOpts).replace(/\s*\n\s*/g, ' ')
    )
  }
  Yn.O = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      pr.inspect(e, this.inspectOpts)
    )
  }
})
var zn = y((fc, gr) => {
  typeof process == 'undefined' ||
  process.type === 'renderer' ||
  process.browser === !0 ||
  process.__nwjs
    ? (gr.exports = $n())
    : (gr.exports = Vn())
})
var Xn = y((lc, Kn) => {
  var Ks = zn(),
    Xs = Ks('presta')
  Kn.exports = { debug: Xs }
})
var ei = y((mc, Hn) => {
  var Qn = yr(),
    { NODE_ENV: wr } = process.env,
    Zn = ''
  function Hs () {
    if (!wr === 'test')
      throw new Error('Internal method was called outside test mode')
    return Zn
  }
  function Qs (e) {
    wr === 'test' ? (Zn += e) : console.log(e)
  }
  function Zs ({ action: e, meta: t, description: r, color: n = 'blue' }) {
    if (wr !== 'test') {
      let i = `  ${Qn[n](e)} ${Qn.gray(t)}`
      console.log(i.padEnd(40) + r)
    }
  }
  Hn.exports = { getLogs: Hs, log: Qs, formatLog: Zs }
})
var ti = y((yc, ri) => {
  function eu () {
    let e = {}
    function t (o, ...s) {
      return e[o] ? e[o].map(c => c(...s)) : []
    }
    function r (o, s) {
      return (
        (e[o] = e[o] ? e[o].concat(s) : [s]),
        () => e[o].splice(e[o].indexOf(s), 1)
      )
    }
    function n () {
      e = {}
    }
    function i (o) {
      return e[o] || []
    }
    return { emit: t, on: r, clear: n, listeners: i }
  }
  ri.exports = { createEmitter: eu }
})
var si = y((dc, ni) => {
  var Z = require('path'),
    ru = yr(),
    { CONFIG_DEFAULT: ii, OUTPUT_DYNAMIC_PAGES_ENTRY: tu } = fr(),
    { debug: nu } = Xn(),
    { log: iu } = ei(),
    { createEmitter: ou } = ti(),
    Ve = process.cwd()
  global.__presta__ = global.__presta__ || {
    cliArgs: {},
    configFile: {},
    pid: process.pid
  }
  function Sr (e) {
    return (
      e.files && (e.files = [].concat(e.files).map(t => Z.resolve(Ve, t))),
      e.output && (e.output = Z.resolve(Ve, e.output)),
      e.assets && (e.assets = Z.resolve(Ve, e.assets)),
      e
    )
  }
  function su (e, t) {
    try {
      return require(Z.resolve(e || ii))
    } catch (r) {
      return (
        e &&
          (iu(`${ru.red('~ error')} ${e}

  > ${r.stack || r}
`),
          t && process.exit(1)),
        {}
      )
    }
  }
  function oi ({
    env: e = global.__presta__.env,
    configFile: t = global.__presta__.configFile,
    cliArgs: r = global.__presta__.cliArgs
  }) {
    ;(t = Sr(F({}, t))), (r = Sr(r))
    let n = {
      output: r.output || t.output || Z.resolve('build'),
      assets: r.assets || t.assets || Z.resolve('public'),
      files:
        r.files && r.files.length ? r.files : t.files ? [].concat(t.files) : []
    }
    return (
      (global.__presta__ = F(F({}, global.__presta__), {
        env: e,
        cwd: Ve,
        configFile: t,
        cliArgs: r,
        merged: n,
        configFilepath: Z.resolve(r.config || ii),
        dynamicEntryFilepath: Z.join(n.output, tu),
        emitter: ou()
      })),
      nu('config created', global.__presta__),
      global.__presta__
    )
  }
  function uu () {
    return (
      (global.__presta__ = oi(F(F({}, global.__presta__), { configFile: {} }))),
      global.__presta__
    )
  }
  function cu (e) {
    return JSON.stringify({
      cwd: e.cwd,
      files: e.merged.files,
      output: e.merged.output,
      assets: e.merged.assets
    })
  }
  function au () {
    return global.__presta__
  }
  function fu () {
    global.__presta__ = { cliArgs: {}, configFile: {} }
  }
  ni.exports = {
    getCurrentConfig: au,
    clearCurrentConfig: fu,
    resolvePaths: Sr,
    getConfigFile: su,
    createConfig: oi,
    removeConfigValues: uu,
    serialize: cu
  }
})
var lu = Pn(),
  mu = require('path'),
  Er = require('assert'),
  { OUTPUT_STATIC_DIR: yu } = fr(),
  { getCurrentConfig: du } = si()
function hu (e) {
  for (var t = 5381, r = e.length; r; ) t = (t * 33) ^ e.charCodeAt(--r)
  return (t >>> 0).toString(36)
}
function Cr (e, t, r) {
  Er(!!e, 'Nothing to extract'),
    Er(!!t, 'Please specify an extension'),
    Er(!!r, 'Please specify a key')
  let { env: n, cwd: i, merged: o } = du(),
    c = n === 'production' ? r + '-' + hu(e) : r,
    l = '/' + c + '.' + t
  return lu.outputFileSync(mu.join(o.output, yu, l), e), l
}
function pu (e, t) {
  return Cr(e, 'css', t)
}
function gu (e, t) {
  return Cr(e, 'js', t)
}
module.exports = { extract: Cr, css: pu, js: gu }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL3VuaXZlcnNhbGlmeS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvcG9seWZpbGxzLmpzIiwgIm5vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9sZWdhY3ktc3RyZWFtcy5qcyIsICJub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvY2xvbmUuanMiLCAibm9kZV9tb2R1bGVzL2dyYWNlZnVsLWZzL2dyYWNlZnVsLWZzLmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZnMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2F0LWxlYXN0LW5vZGUvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvbWFrZS1kaXIuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi91dGlsL3V0aW1lcy5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3V0aWwvc3RhdC5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2NvcHktc3luYy9jb3B5LXN5bmMuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5LXN5bmMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9wYXRoLWV4aXN0cy9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2NvcHkvY29weS5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2NvcHkvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9yZW1vdmUvcmltcmFmLmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvcmVtb3ZlL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW1wdHkvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvZmlsZS5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2Vuc3VyZS9saW5rLmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmstcGF0aHMuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvc3ltbGluay10eXBlLmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmsuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2pzb25maWxlL3V0aWxzLmpzIiwgIm5vZGVfbW9kdWxlcy9qc29uZmlsZS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2pzb24vanNvbmZpbGUuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9vdXRwdXQvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9qc29uL291dHB1dC1qc29uLmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvanNvbi9vdXRwdXQtanNvbi1zeW5jLmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvanNvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21vdmUtc3luYy9tb3ZlLXN5bmMuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9tb3ZlLXN5bmMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9tb3ZlL21vdmUuanMiLCAibm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9tb3ZlL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvaW5kZXguanMiLCAibGliL2NvbnN0YW50cy5qcyIsICJub2RlX21vZHVsZXMvYW5zaS1jb2xvcnMvc3ltYm9scy5qcyIsICJub2RlX21vZHVsZXMvYW5zaS1jb2xvcnMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL21zL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvY29tbW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qcyIsICJub2RlX21vZHVsZXMvaGFzLWZsYWcvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL3N1cHBvcnRzLWNvbG9yL2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvbm9kZS5qcyIsICJub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzIiwgImxpYi9kZWJ1Zy5qcyIsICJsaWIvbG9nLmpzIiwgImxpYi9jcmVhdGVFbWl0dGVyLmpzIiwgImxpYi9jb25maWcuanMiLCAibGliL2V4dHJhY3QuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmZyb21DYWxsYmFjayA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgaWYgKHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIGZuLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmbi5hcHBseShcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIGFyZ3MuY29uY2F0KFsoZXJyLCByZXMpID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShyZXMpXSlcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG4gIH0sICduYW1lJywgeyB2YWx1ZTogZm4ubmFtZSB9KVxufVxuXG5leHBvcnRzLmZyb21Qcm9taXNlID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBjb25zdCBjYiA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXVxuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKVxuICAgIGVsc2UgZm4uYXBwbHkodGhpcywgYXJncy5zbGljZSgwLCAtMSkpLnRoZW4ociA9PiBjYihudWxsLCByKSwgY2IpXG4gIH0sICduYW1lJywgeyB2YWx1ZTogZm4ubmFtZSB9KVxufVxuIiwgInZhciBjb25zdGFudHMgPSByZXF1aXJlKCdjb25zdGFudHMnKVxuXG52YXIgb3JpZ0N3ZCA9IHByb2Nlc3MuY3dkXG52YXIgY3dkID0gbnVsbFxuXG52YXIgcGxhdGZvcm0gPSBwcm9jZXNzLmVudi5HUkFDRUZVTF9GU19QTEFURk9STSB8fCBwcm9jZXNzLnBsYXRmb3JtXG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24oKSB7XG4gIGlmICghY3dkKVxuICAgIGN3ZCA9IG9yaWdDd2QuY2FsbChwcm9jZXNzKVxuICByZXR1cm4gY3dkXG59XG50cnkge1xuICBwcm9jZXNzLmN3ZCgpXG59IGNhdGNoIChlcikge31cblxudmFyIGNoZGlyID0gcHJvY2Vzcy5jaGRpclxucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uKGQpIHtcbiAgY3dkID0gbnVsbFxuICBjaGRpci5jYWxsKHByb2Nlc3MsIGQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hcblxuZnVuY3Rpb24gcGF0Y2ggKGZzKSB7XG4gIC8vIChyZS0paW1wbGVtZW50IHNvbWUgdGhpbmdzIHRoYXQgYXJlIGtub3duIGJ1c3RlZCBvciBtaXNzaW5nLlxuXG4gIC8vIGxjaG1vZCwgYnJva2VuIHByaW9yIHRvIDAuNi4yXG4gIC8vIGJhY2stcG9ydCB0aGUgZml4IGhlcmUuXG4gIGlmIChjb25zdGFudHMuaGFzT3duUHJvcGVydHkoJ09fU1lNTElOSycpICYmXG4gICAgICBwcm9jZXNzLnZlcnNpb24ubWF0Y2goL152MFxcLjZcXC5bMC0yXXxedjBcXC41XFwuLykpIHtcbiAgICBwYXRjaExjaG1vZChmcylcbiAgfVxuXG4gIC8vIGx1dGltZXMgaW1wbGVtZW50YXRpb24sIG9yIG5vLW9wXG4gIGlmICghZnMubHV0aW1lcykge1xuICAgIHBhdGNoTHV0aW1lcyhmcylcbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS1ncmFjZWZ1bC1mcy9pc3N1ZXMvNFxuICAvLyBDaG93biBzaG91bGQgbm90IGZhaWwgb24gZWludmFsIG9yIGVwZXJtIGlmIG5vbi1yb290LlxuICAvLyBJdCBzaG91bGQgbm90IGZhaWwgb24gZW5vc3lzIGV2ZXIsIGFzIHRoaXMganVzdCBpbmRpY2F0ZXNcbiAgLy8gdGhhdCBhIGZzIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgaW50ZW5kZWQgb3BlcmF0aW9uLlxuXG4gIGZzLmNob3duID0gY2hvd25GaXgoZnMuY2hvd24pXG4gIGZzLmZjaG93biA9IGNob3duRml4KGZzLmZjaG93bilcbiAgZnMubGNob3duID0gY2hvd25GaXgoZnMubGNob3duKVxuXG4gIGZzLmNobW9kID0gY2htb2RGaXgoZnMuY2htb2QpXG4gIGZzLmZjaG1vZCA9IGNobW9kRml4KGZzLmZjaG1vZClcbiAgZnMubGNobW9kID0gY2htb2RGaXgoZnMubGNobW9kKVxuXG4gIGZzLmNob3duU3luYyA9IGNob3duRml4U3luYyhmcy5jaG93blN5bmMpXG4gIGZzLmZjaG93blN5bmMgPSBjaG93bkZpeFN5bmMoZnMuZmNob3duU3luYylcbiAgZnMubGNob3duU3luYyA9IGNob3duRml4U3luYyhmcy5sY2hvd25TeW5jKVxuXG4gIGZzLmNobW9kU3luYyA9IGNobW9kRml4U3luYyhmcy5jaG1vZFN5bmMpXG4gIGZzLmZjaG1vZFN5bmMgPSBjaG1vZEZpeFN5bmMoZnMuZmNobW9kU3luYylcbiAgZnMubGNobW9kU3luYyA9IGNobW9kRml4U3luYyhmcy5sY2htb2RTeW5jKVxuXG4gIGZzLnN0YXQgPSBzdGF0Rml4KGZzLnN0YXQpXG4gIGZzLmZzdGF0ID0gc3RhdEZpeChmcy5mc3RhdClcbiAgZnMubHN0YXQgPSBzdGF0Rml4KGZzLmxzdGF0KVxuXG4gIGZzLnN0YXRTeW5jID0gc3RhdEZpeFN5bmMoZnMuc3RhdFN5bmMpXG4gIGZzLmZzdGF0U3luYyA9IHN0YXRGaXhTeW5jKGZzLmZzdGF0U3luYylcbiAgZnMubHN0YXRTeW5jID0gc3RhdEZpeFN5bmMoZnMubHN0YXRTeW5jKVxuXG4gIC8vIGlmIGxjaG1vZC9sY2hvd24gZG8gbm90IGV4aXN0LCB0aGVuIG1ha2UgdGhlbSBuby1vcHNcbiAgaWYgKCFmcy5sY2htb2QpIHtcbiAgICBmcy5sY2htb2QgPSBmdW5jdGlvbiAocGF0aCwgbW9kZSwgY2IpIHtcbiAgICAgIGlmIChjYikgcHJvY2Vzcy5uZXh0VGljayhjYilcbiAgICB9XG4gICAgZnMubGNobW9kU3luYyA9IGZ1bmN0aW9uICgpIHt9XG4gIH1cbiAgaWYgKCFmcy5sY2hvd24pIHtcbiAgICBmcy5sY2hvd24gPSBmdW5jdGlvbiAocGF0aCwgdWlkLCBnaWQsIGNiKSB7XG4gICAgICBpZiAoY2IpIHByb2Nlc3MubmV4dFRpY2soY2IpXG4gICAgfVxuICAgIGZzLmxjaG93blN5bmMgPSBmdW5jdGlvbiAoKSB7fVxuICB9XG5cbiAgLy8gb24gV2luZG93cywgQS9WIHNvZnR3YXJlIGNhbiBsb2NrIHRoZSBkaXJlY3RvcnksIGNhdXNpbmcgdGhpc1xuICAvLyB0byBmYWlsIHdpdGggYW4gRUFDQ0VTIG9yIEVQRVJNIGlmIHRoZSBkaXJlY3RvcnkgY29udGFpbnMgbmV3bHlcbiAgLy8gY3JlYXRlZCBmaWxlcy4gIFRyeSBhZ2FpbiBvbiBmYWlsdXJlLCBmb3IgdXAgdG8gNjAgc2Vjb25kcy5cblxuICAvLyBTZXQgdGhlIHRpbWVvdXQgdGhpcyBsb25nIGJlY2F1c2Ugc29tZSBXaW5kb3dzIEFudGktVmlydXMsIHN1Y2ggYXMgUGFyaXR5XG4gIC8vIGJpdDksIG1heSBsb2NrIGZpbGVzIGZvciB1cCB0byBhIG1pbnV0ZSwgY2F1c2luZyBucG0gcGFja2FnZSBpbnN0YWxsXG4gIC8vIGZhaWx1cmVzLiBBbHNvLCB0YWtlIGNhcmUgdG8geWllbGQgdGhlIHNjaGVkdWxlci4gV2luZG93cyBzY2hlZHVsaW5nIGdpdmVzXG4gIC8vIENQVSB0byBhIGJ1c3kgbG9vcGluZyBwcm9jZXNzLCB3aGljaCBjYW4gY2F1c2UgdGhlIHByb2dyYW0gY2F1c2luZyB0aGUgbG9ja1xuICAvLyBjb250ZW50aW9uIHRvIGJlIHN0YXJ2ZWQgb2YgQ1BVIGJ5IG5vZGUsIHNvIHRoZSBjb250ZW50aW9uIGRvZXNuJ3QgcmVzb2x2ZS5cbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcbiAgICBmcy5yZW5hbWUgPSAoZnVuY3Rpb24gKGZzJHJlbmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKGZyb20sIHRvLCBjYikge1xuICAgICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgICAgdmFyIGJhY2tvZmYgPSAwO1xuICAgICAgZnMkcmVuYW1lKGZyb20sIHRvLCBmdW5jdGlvbiBDQiAoZXIpIHtcbiAgICAgICAgaWYgKGVyXG4gICAgICAgICAgICAmJiAoZXIuY29kZSA9PT0gXCJFQUNDRVNcIiB8fCBlci5jb2RlID09PSBcIkVQRVJNXCIpXG4gICAgICAgICAgICAmJiBEYXRlLm5vdygpIC0gc3RhcnQgPCA2MDAwMCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmcy5zdGF0KHRvLCBmdW5jdGlvbiAoc3RhdGVyLCBzdCkge1xuICAgICAgICAgICAgICBpZiAoc3RhdGVyICYmIHN0YXRlci5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgICAgICAgICAgIGZzJHJlbmFtZShmcm9tLCB0bywgQ0IpO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2IoZXIpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sIGJhY2tvZmYpXG4gICAgICAgICAgaWYgKGJhY2tvZmYgPCAxMDApXG4gICAgICAgICAgICBiYWNrb2ZmICs9IDEwO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2IpIGNiKGVyKVxuICAgICAgfSlcbiAgICB9fSkoZnMucmVuYW1lKVxuICB9XG5cbiAgLy8gaWYgcmVhZCgpIHJldHVybnMgRUFHQUlOLCB0aGVuIGp1c3QgdHJ5IGl0IGFnYWluLlxuICBmcy5yZWFkID0gKGZ1bmN0aW9uIChmcyRyZWFkKSB7XG4gICAgZnVuY3Rpb24gcmVhZCAoZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uLCBjYWxsYmFja18pIHtcbiAgICAgIHZhciBjYWxsYmFja1xuICAgICAgaWYgKGNhbGxiYWNrXyAmJiB0eXBlb2YgY2FsbGJhY2tfID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBlYWdDb3VudGVyID0gMFxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChlciwgXywgX18pIHtcbiAgICAgICAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VBR0FJTicgJiYgZWFnQ291bnRlciA8IDEwKSB7XG4gICAgICAgICAgICBlYWdDb3VudGVyICsrXG4gICAgICAgICAgICByZXR1cm4gZnMkcmVhZC5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFja18uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnMkcmVhZC5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICAgIH1cblxuICAgIC8vIFRoaXMgZW5zdXJlcyBgdXRpbC5wcm9taXNpZnlgIHdvcmtzIGFzIGl0IGRvZXMgZm9yIG5hdGl2ZSBgZnMucmVhZGAuXG4gICAgcmVhZC5fX3Byb3RvX18gPSBmcyRyZWFkXG4gICAgcmV0dXJuIHJlYWRcbiAgfSkoZnMucmVhZClcblxuICBmcy5yZWFkU3luYyA9IChmdW5jdGlvbiAoZnMkcmVhZFN5bmMpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24pIHtcbiAgICB2YXIgZWFnQ291bnRlciA9IDBcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZzJHJlYWRTeW5jLmNhbGwoZnMsIGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbilcbiAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRUFHQUlOJyAmJiBlYWdDb3VudGVyIDwgMTApIHtcbiAgICAgICAgICBlYWdDb3VudGVyICsrXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlclxuICAgICAgfVxuICAgIH1cbiAgfX0pKGZzLnJlYWRTeW5jKVxuXG4gIGZ1bmN0aW9uIHBhdGNoTGNobW9kIChmcykge1xuICAgIGZzLmxjaG1vZCA9IGZ1bmN0aW9uIChwYXRoLCBtb2RlLCBjYWxsYmFjaykge1xuICAgICAgZnMub3BlbiggcGF0aFxuICAgICAgICAgICAgICwgY29uc3RhbnRzLk9fV1JPTkxZIHwgY29uc3RhbnRzLk9fU1lNTElOS1xuICAgICAgICAgICAgICwgbW9kZVxuICAgICAgICAgICAgICwgZnVuY3Rpb24gKGVyciwgZmQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIC8vIHByZWZlciB0byByZXR1cm4gdGhlIGNobW9kIGVycm9yLCBpZiBvbmUgb2NjdXJzLFxuICAgICAgICAvLyBidXQgc3RpbGwgdHJ5IHRvIGNsb3NlLCBhbmQgcmVwb3J0IGNsb3NpbmcgZXJyb3JzIGlmIHRoZXkgb2NjdXIuXG4gICAgICAgIGZzLmZjaG1vZChmZCwgbW9kZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGZzLmNsb3NlKGZkLCBmdW5jdGlvbihlcnIyKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKGVyciB8fCBlcnIyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZzLmxjaG1vZFN5bmMgPSBmdW5jdGlvbiAocGF0aCwgbW9kZSkge1xuICAgICAgdmFyIGZkID0gZnMub3BlblN5bmMocGF0aCwgY29uc3RhbnRzLk9fV1JPTkxZIHwgY29uc3RhbnRzLk9fU1lNTElOSywgbW9kZSlcblxuICAgICAgLy8gcHJlZmVyIHRvIHJldHVybiB0aGUgY2htb2QgZXJyb3IsIGlmIG9uZSBvY2N1cnMsXG4gICAgICAvLyBidXQgc3RpbGwgdHJ5IHRvIGNsb3NlLCBhbmQgcmVwb3J0IGNsb3NpbmcgZXJyb3JzIGlmIHRoZXkgb2NjdXIuXG4gICAgICB2YXIgdGhyZXcgPSB0cnVlXG4gICAgICB2YXIgcmV0XG4gICAgICB0cnkge1xuICAgICAgICByZXQgPSBmcy5mY2htb2RTeW5jKGZkLCBtb2RlKVxuICAgICAgICB0aHJldyA9IGZhbHNlXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAodGhyZXcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgICAgIH0gY2F0Y2ggKGVyKSB7fVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGNoTHV0aW1lcyAoZnMpIHtcbiAgICBpZiAoY29uc3RhbnRzLmhhc093blByb3BlcnR5KFwiT19TWU1MSU5LXCIpKSB7XG4gICAgICBmcy5sdXRpbWVzID0gZnVuY3Rpb24gKHBhdGgsIGF0LCBtdCwgY2IpIHtcbiAgICAgICAgZnMub3BlbihwYXRoLCBjb25zdGFudHMuT19TWU1MSU5LLCBmdW5jdGlvbiAoZXIsIGZkKSB7XG4gICAgICAgICAgaWYgKGVyKSB7XG4gICAgICAgICAgICBpZiAoY2IpIGNiKGVyKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGZzLmZ1dGltZXMoZmQsIGF0LCBtdCwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgICAgICBmcy5jbG9zZShmZCwgZnVuY3Rpb24gKGVyMikge1xuICAgICAgICAgICAgICBpZiAoY2IpIGNiKGVyIHx8IGVyMilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZnMubHV0aW1lc1N5bmMgPSBmdW5jdGlvbiAocGF0aCwgYXQsIG10KSB7XG4gICAgICAgIHZhciBmZCA9IGZzLm9wZW5TeW5jKHBhdGgsIGNvbnN0YW50cy5PX1NZTUxJTkspXG4gICAgICAgIHZhciByZXRcbiAgICAgICAgdmFyIHRocmV3ID0gdHJ1ZVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldCA9IGZzLmZ1dGltZXNTeW5jKGZkLCBhdCwgbXQpXG4gICAgICAgICAgdGhyZXcgPSBmYWxzZVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmICh0aHJldykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgICAgICAgfSBjYXRjaCAoZXIpIHt9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLmx1dGltZXMgPSBmdW5jdGlvbiAoX2EsIF9iLCBfYywgY2IpIHsgaWYgKGNiKSBwcm9jZXNzLm5leHRUaWNrKGNiKSB9XG4gICAgICBmcy5sdXRpbWVzU3luYyA9IGZ1bmN0aW9uICgpIHt9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2htb2RGaXggKG9yaWcpIHtcbiAgICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIG1vZGUsIGNiKSB7XG4gICAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIG1vZGUsIGZ1bmN0aW9uIChlcikge1xuICAgICAgICBpZiAoY2hvd25Fck9rKGVyKSkgZXIgPSBudWxsXG4gICAgICAgIGlmIChjYikgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaG1vZEZpeFN5bmMgKG9yaWcpIHtcbiAgICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIG1vZGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgbW9kZSlcbiAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgIGlmICghY2hvd25Fck9rKGVyKSkgdGhyb3cgZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGNob3duRml4IChvcmlnKSB7XG4gICAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCB1aWQsIGdpZCwgY2IpIHtcbiAgICAgIHJldHVybiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgdWlkLCBnaWQsIGZ1bmN0aW9uIChlcikge1xuICAgICAgICBpZiAoY2hvd25Fck9rKGVyKSkgZXIgPSBudWxsXG4gICAgICAgIGlmIChjYikgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaG93bkZpeFN5bmMgKG9yaWcpIHtcbiAgICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHVpZCwgZ2lkKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIHVpZCwgZ2lkKVxuICAgICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgICAgaWYgKCFjaG93bkVyT2soZXIpKSB0aHJvdyBlclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXRGaXggKG9yaWcpIHtcbiAgICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gICAgLy8gT2xkZXIgdmVyc2lvbnMgb2YgTm9kZSBlcnJvbmVvdXNseSByZXR1cm5lZCBzaWduZWQgaW50ZWdlcnMgZm9yXG4gICAgLy8gdWlkICsgZ2lkLlxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zLCBjYikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNiID0gb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0gbnVsbFxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gY2FsbGJhY2sgKGVyLCBzdGF0cykge1xuICAgICAgICBpZiAoc3RhdHMpIHtcbiAgICAgICAgICBpZiAoc3RhdHMudWlkIDwgMCkgc3RhdHMudWlkICs9IDB4MTAwMDAwMDAwXG4gICAgICAgICAgaWYgKHN0YXRzLmdpZCA8IDApIHN0YXRzLmdpZCArPSAweDEwMDAwMDAwMFxuICAgICAgICB9XG4gICAgICAgIGlmIChjYikgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbnMgPyBvcmlnLmNhbGwoZnMsIHRhcmdldCwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgICAgIDogb3JpZy5jYWxsKGZzLCB0YXJnZXQsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXRGaXhTeW5jIChvcmlnKSB7XG4gICAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAgIC8vIE9sZGVyIHZlcnNpb25zIG9mIE5vZGUgZXJyb25lb3VzbHkgcmV0dXJuZWQgc2lnbmVkIGludGVnZXJzIGZvclxuICAgIC8vIHVpZCArIGdpZC5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgdmFyIHN0YXRzID0gb3B0aW9ucyA/IG9yaWcuY2FsbChmcywgdGFyZ2V0LCBvcHRpb25zKVxuICAgICAgICA6IG9yaWcuY2FsbChmcywgdGFyZ2V0KVxuICAgICAgaWYgKHN0YXRzLnVpZCA8IDApIHN0YXRzLnVpZCArPSAweDEwMDAwMDAwMFxuICAgICAgaWYgKHN0YXRzLmdpZCA8IDApIHN0YXRzLmdpZCArPSAweDEwMDAwMDAwMFxuICAgICAgcmV0dXJuIHN0YXRzO1xuICAgIH1cbiAgfVxuXG4gIC8vIEVOT1NZUyBtZWFucyB0aGF0IHRoZSBmcyBkb2Vzbid0IHN1cHBvcnQgdGhlIG9wLiBKdXN0IGlnbm9yZVxuICAvLyB0aGF0LCBiZWNhdXNlIGl0IGRvZXNuJ3QgbWF0dGVyLlxuICAvL1xuICAvLyBpZiB0aGVyZSdzIG5vIGdldHVpZCwgb3IgaWYgZ2V0dWlkKCkgaXMgc29tZXRoaW5nIG90aGVyXG4gIC8vIHRoYW4gMCwgYW5kIHRoZSBlcnJvciBpcyBFSU5WQUwgb3IgRVBFUk0sIHRoZW4ganVzdCBpZ25vcmVcbiAgLy8gaXQuXG4gIC8vXG4gIC8vIFRoaXMgc3BlY2lmaWMgY2FzZSBpcyBhIHNpbGVudCBmYWlsdXJlIGluIGNwLCBpbnN0YWxsLCB0YXIsXG4gIC8vIGFuZCBtb3N0IG90aGVyIHVuaXggdG9vbHMgdGhhdCBtYW5hZ2UgcGVybWlzc2lvbnMuXG4gIC8vXG4gIC8vIFdoZW4gcnVubmluZyBhcyByb290LCBvciBpZiBvdGhlciB0eXBlcyBvZiBlcnJvcnMgYXJlXG4gIC8vIGVuY291bnRlcmVkLCB0aGVuIGl0J3Mgc3RyaWN0LlxuICBmdW5jdGlvbiBjaG93bkVyT2sgKGVyKSB7XG4gICAgaWYgKCFlcilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiAoZXIuY29kZSA9PT0gXCJFTk9TWVNcIilcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICB2YXIgbm9ucm9vdCA9ICFwcm9jZXNzLmdldHVpZCB8fCBwcm9jZXNzLmdldHVpZCgpICE9PSAwXG4gICAgaWYgKG5vbnJvb3QpIHtcbiAgICAgIGlmIChlci5jb2RlID09PSBcIkVJTlZBTFwiIHx8IGVyLmNvZGUgPT09IFwiRVBFUk1cIilcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuIiwgInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW1cblxubW9kdWxlLmV4cG9ydHMgPSBsZWdhY3lcblxuZnVuY3Rpb24gbGVnYWN5IChmcykge1xuICByZXR1cm4ge1xuICAgIFJlYWRTdHJlYW06IFJlYWRTdHJlYW0sXG4gICAgV3JpdGVTdHJlYW06IFdyaXRlU3RyZWFtXG4gIH1cblxuICBmdW5jdGlvbiBSZWFkU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRTdHJlYW0pKSByZXR1cm4gbmV3IFJlYWRTdHJlYW0ocGF0aCwgb3B0aW9ucyk7XG5cbiAgICBTdHJlYW0uY2FsbCh0aGlzKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5mZCA9IG51bGw7XG4gICAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZmxhZ3MgPSAncic7XG4gICAgdGhpcy5tb2RlID0gNDM4OyAvKj0wNjY2Ki9cbiAgICB0aGlzLmJ1ZmZlclNpemUgPSA2NCAqIDEwMjQ7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIE1peGluIG9wdGlvbnMgaW50byB0aGlzXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuY29kaW5nKSB0aGlzLnNldEVuY29kaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5zdGFydCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3N0YXJ0IG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZW5kID0gSW5maW5pdHk7XG4gICAgICB9IGVsc2UgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5lbmQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdlbmQgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGFydCA+IHRoaXMuZW5kKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc3RhcnQgbXVzdCBiZSA8PSBlbmQnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnN0YXJ0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZkICE9PSBudWxsKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLl9yZWFkKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmcy5vcGVuKHRoaXMucGF0aCwgdGhpcy5mbGFncywgdGhpcy5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgc2VsZi5yZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuZmQgPSBmZDtcbiAgICAgIHNlbGYuZW1pdCgnb3BlbicsIGZkKTtcbiAgICAgIHNlbGYuX3JlYWQoKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gV3JpdGVTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgV3JpdGVTdHJlYW0pKSByZXR1cm4gbmV3IFdyaXRlU3RyZWFtKHBhdGgsIG9wdGlvbnMpO1xuXG4gICAgU3RyZWFtLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMuZmQgPSBudWxsO1xuICAgIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgdGhpcy5mbGFncyA9ICd3JztcbiAgICB0aGlzLmVuY29kaW5nID0gJ2JpbmFyeSc7XG4gICAgdGhpcy5tb2RlID0gNDM4OyAvKj0wNjY2Ki9cbiAgICB0aGlzLmJ5dGVzV3JpdHRlbiA9IDA7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIE1peGluIG9wdGlvbnMgaW50byB0aGlzXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICgnbnVtYmVyJyAhPT0gdHlwZW9mIHRoaXMuc3RhcnQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzdGFydCBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGFydCA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBtdXN0IGJlID49IHplcm8nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnN0YXJ0O1xuICAgIH1cblxuICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICAgIHRoaXMuX3F1ZXVlID0gW107XG5cbiAgICBpZiAodGhpcy5mZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fb3BlbiA9IGZzLm9wZW47XG4gICAgICB0aGlzLl9xdWV1ZS5wdXNoKFt0aGlzLl9vcGVuLCB0aGlzLnBhdGgsIHRoaXMuZmxhZ3MsIHRoaXMubW9kZSwgdW5kZWZpbmVkXSk7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgfVxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVcblxuZnVuY3Rpb24gY2xvbmUgKG9iaikge1xuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBvYmpcblxuICBpZiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgIHZhciBjb3B5ID0geyBfX3Byb3RvX186IG9iai5fX3Byb3RvX18gfVxuICBlbHNlXG4gICAgdmFyIGNvcHkgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29weSwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSlcbiAgfSlcblxuICByZXR1cm4gY29weVxufVxuIiwgInZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBwb2x5ZmlsbHMgPSByZXF1aXJlKCcuL3BvbHlmaWxscy5qcycpXG52YXIgbGVnYWN5ID0gcmVxdWlyZSgnLi9sZWdhY3ktc3RyZWFtcy5qcycpXG52YXIgY2xvbmUgPSByZXF1aXJlKCcuL2Nsb25lLmpzJylcblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgLSBub2RlIDAueCBwb2x5ZmlsbCAqL1xudmFyIGdyYWNlZnVsUXVldWVcbnZhciBwcmV2aW91c1N5bWJvbFxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAtIG5vZGUgMC54IHBvbHlmaWxsICovXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLmZvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBncmFjZWZ1bFF1ZXVlID0gU3ltYm9sLmZvcignZ3JhY2VmdWwtZnMucXVldWUnKVxuICAvLyBUaGlzIGlzIHVzZWQgaW4gdGVzdGluZyBieSBmdXR1cmUgdmVyc2lvbnNcbiAgcHJldmlvdXNTeW1ib2wgPSBTeW1ib2wuZm9yKCdncmFjZWZ1bC1mcy5wcmV2aW91cycpXG59IGVsc2Uge1xuICBncmFjZWZ1bFF1ZXVlID0gJ19fX2dyYWNlZnVsLWZzLnF1ZXVlJ1xuICBwcmV2aW91c1N5bWJvbCA9ICdfX19ncmFjZWZ1bC1mcy5wcmV2aW91cydcbn1cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuXG5mdW5jdGlvbiBwdWJsaXNoUXVldWUoY29udGV4dCwgcXVldWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnRleHQsIGdyYWNlZnVsUXVldWUsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHF1ZXVlXG4gICAgfVxuICB9KVxufVxuXG52YXIgZGVidWcgPSBub29wXG5pZiAodXRpbC5kZWJ1Z2xvZylcbiAgZGVidWcgPSB1dGlsLmRlYnVnbG9nKCdnZnM0JylcbmVsc2UgaWYgKC9cXGJnZnM0XFxiL2kudGVzdChwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnKSlcbiAgZGVidWcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbSA9IHV0aWwuZm9ybWF0LmFwcGx5KHV0aWwsIGFyZ3VtZW50cylcbiAgICBtID0gJ0dGUzQ6ICcgKyBtLnNwbGl0KC9cXG4vKS5qb2luKCdcXG5HRlM0OiAnKVxuICAgIGNvbnNvbGUuZXJyb3IobSlcbiAgfVxuXG4vLyBPbmNlIHRpbWUgaW5pdGlhbGl6YXRpb25cbmlmICghZnNbZ3JhY2VmdWxRdWV1ZV0pIHtcbiAgLy8gVGhpcyBxdWV1ZSBjYW4gYmUgc2hhcmVkIGJ5IG11bHRpcGxlIGxvYWRlZCBpbnN0YW5jZXNcbiAgdmFyIHF1ZXVlID0gZ2xvYmFsW2dyYWNlZnVsUXVldWVdIHx8IFtdXG4gIHB1Ymxpc2hRdWV1ZShmcywgcXVldWUpXG5cbiAgLy8gUGF0Y2ggZnMuY2xvc2UvY2xvc2VTeW5jIHRvIHNoYXJlZCBxdWV1ZSB2ZXJzaW9uLCBiZWNhdXNlIHdlIG5lZWRcbiAgLy8gdG8gcmV0cnkoKSB3aGVuZXZlciBhIGNsb3NlIGhhcHBlbnMgKmFueXdoZXJlKiBpbiB0aGUgcHJvZ3JhbS5cbiAgLy8gVGhpcyBpcyBlc3NlbnRpYWwgd2hlbiBtdWx0aXBsZSBncmFjZWZ1bC1mcyBpbnN0YW5jZXMgYXJlXG4gIC8vIGluIHBsYXkgYXQgdGhlIHNhbWUgdGltZS5cbiAgZnMuY2xvc2UgPSAoZnVuY3Rpb24gKGZzJGNsb3NlKSB7XG4gICAgZnVuY3Rpb24gY2xvc2UgKGZkLCBjYikge1xuICAgICAgcmV0dXJuIGZzJGNsb3NlLmNhbGwoZnMsIGZkLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gdXNlcyB0aGUgZ3JhY2VmdWwtZnMgc2hhcmVkIHF1ZXVlXG4gICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgcmV0cnkoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbG9zZSwgcHJldmlvdXNTeW1ib2wsIHtcbiAgICAgIHZhbHVlOiBmcyRjbG9zZVxuICAgIH0pXG4gICAgcmV0dXJuIGNsb3NlXG4gIH0pKGZzLmNsb3NlKVxuXG4gIGZzLmNsb3NlU3luYyA9IChmdW5jdGlvbiAoZnMkY2xvc2VTeW5jKSB7XG4gICAgZnVuY3Rpb24gY2xvc2VTeW5jIChmZCkge1xuICAgICAgLy8gVGhpcyBmdW5jdGlvbiB1c2VzIHRoZSBncmFjZWZ1bC1mcyBzaGFyZWQgcXVldWVcbiAgICAgIGZzJGNsb3NlU3luYy5hcHBseShmcywgYXJndW1lbnRzKVxuICAgICAgcmV0cnkoKVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbG9zZVN5bmMsIHByZXZpb3VzU3ltYm9sLCB7XG4gICAgICB2YWx1ZTogZnMkY2xvc2VTeW5jXG4gICAgfSlcbiAgICByZXR1cm4gY2xvc2VTeW5jXG4gIH0pKGZzLmNsb3NlU3luYylcblxuICBpZiAoL1xcYmdmczRcXGIvaS50ZXN0KHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJycpKSB7XG4gICAgcHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZGVidWcoZnNbZ3JhY2VmdWxRdWV1ZV0pXG4gICAgICByZXF1aXJlKCdhc3NlcnQnKS5lcXVhbChmc1tncmFjZWZ1bFF1ZXVlXS5sZW5ndGgsIDApXG4gICAgfSlcbiAgfVxufVxuXG5pZiAoIWdsb2JhbFtncmFjZWZ1bFF1ZXVlXSkge1xuICBwdWJsaXNoUXVldWUoZ2xvYmFsLCBmc1tncmFjZWZ1bFF1ZXVlXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2goY2xvbmUoZnMpKVxuaWYgKHByb2Nlc3MuZW52LlRFU1RfR1JBQ0VGVUxfRlNfR0xPQkFMX1BBVENIICYmICFmcy5fX3BhdGNoZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHBhdGNoKGZzKVxuICAgIGZzLl9fcGF0Y2hlZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHBhdGNoIChmcykge1xuICAvLyBFdmVyeXRoaW5nIHRoYXQgcmVmZXJlbmNlcyB0aGUgb3BlbigpIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIGluIGhlcmVcbiAgcG9seWZpbGxzKGZzKVxuICBmcy5ncmFjZWZ1bGlmeSA9IHBhdGNoXG5cbiAgZnMuY3JlYXRlUmVhZFN0cmVhbSA9IGNyZWF0ZVJlYWRTdHJlYW1cbiAgZnMuY3JlYXRlV3JpdGVTdHJlYW0gPSBjcmVhdGVXcml0ZVN0cmVhbVxuICB2YXIgZnMkcmVhZEZpbGUgPSBmcy5yZWFkRmlsZVxuICBmcy5yZWFkRmlsZSA9IHJlYWRGaWxlXG4gIGZ1bmN0aW9uIHJlYWRGaWxlIChwYXRoLCBvcHRpb25zLCBjYikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IG51bGxcblxuICAgIHJldHVybiBnbyRyZWFkRmlsZShwYXRoLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJHJlYWRGaWxlIChwYXRoLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIGZzJHJlYWRGaWxlKHBhdGgsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09ICdFTUZJTEUnIHx8IGVyci5jb2RlID09PSAnRU5GSUxFJykpXG4gICAgICAgICAgZW5xdWV1ZShbZ28kcmVhZEZpbGUsIFtwYXRoLCBvcHRpb25zLCBjYl1dKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJldHJ5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkd3JpdGVGaWxlID0gZnMud3JpdGVGaWxlXG4gIGZzLndyaXRlRmlsZSA9IHdyaXRlRmlsZVxuICBmdW5jdGlvbiB3cml0ZUZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJHdyaXRlRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJHdyaXRlRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiBmcyR3cml0ZUZpbGUocGF0aCwgZGF0YSwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyR3cml0ZUZpbGUsIFtwYXRoLCBkYXRhLCBvcHRpb25zLCBjYl1dKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJldHJ5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkYXBwZW5kRmlsZSA9IGZzLmFwcGVuZEZpbGVcbiAgaWYgKGZzJGFwcGVuZEZpbGUpXG4gICAgZnMuYXBwZW5kRmlsZSA9IGFwcGVuZEZpbGVcbiAgZnVuY3Rpb24gYXBwZW5kRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYiA9IG9wdGlvbnMsIG9wdGlvbnMgPSBudWxsXG5cbiAgICByZXR1cm4gZ28kYXBwZW5kRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJGFwcGVuZEZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gZnMkYXBwZW5kRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJGFwcGVuZEZpbGUsIFtwYXRoLCBkYXRhLCBvcHRpb25zLCBjYl1dKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJldHJ5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkcmVhZGRpciA9IGZzLnJlYWRkaXJcbiAgZnMucmVhZGRpciA9IHJlYWRkaXJcbiAgZnVuY3Rpb24gcmVhZGRpciAocGF0aCwgb3B0aW9ucywgY2IpIHtcbiAgICB2YXIgYXJncyA9IFtwYXRoXVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJncy5wdXNoKG9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNiID0gb3B0aW9uc1xuICAgIH1cbiAgICBhcmdzLnB1c2goZ28kcmVhZGRpciRjYilcblxuICAgIHJldHVybiBnbyRyZWFkZGlyKGFyZ3MpXG5cbiAgICBmdW5jdGlvbiBnbyRyZWFkZGlyJGNiIChlcnIsIGZpbGVzKSB7XG4gICAgICBpZiAoZmlsZXMgJiYgZmlsZXMuc29ydClcbiAgICAgICAgZmlsZXMuc29ydCgpXG5cbiAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICBlbnF1ZXVlKFtnbyRyZWFkZGlyLCBbYXJnc11dKVxuXG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIHJldHJ5KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyRyZWFkZGlyIChhcmdzKSB7XG4gICAgcmV0dXJuIGZzJHJlYWRkaXIuYXBwbHkoZnMsIGFyZ3MpXG4gIH1cblxuICBpZiAocHJvY2Vzcy52ZXJzaW9uLnN1YnN0cigwLCA0KSA9PT0gJ3YwLjgnKSB7XG4gICAgdmFyIGxlZ1N0cmVhbXMgPSBsZWdhY3koZnMpXG4gICAgUmVhZFN0cmVhbSA9IGxlZ1N0cmVhbXMuUmVhZFN0cmVhbVxuICAgIFdyaXRlU3RyZWFtID0gbGVnU3RyZWFtcy5Xcml0ZVN0cmVhbVxuICB9XG5cbiAgdmFyIGZzJFJlYWRTdHJlYW0gPSBmcy5SZWFkU3RyZWFtXG4gIGlmIChmcyRSZWFkU3RyZWFtKSB7XG4gICAgUmVhZFN0cmVhbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGZzJFJlYWRTdHJlYW0ucHJvdG90eXBlKVxuICAgIFJlYWRTdHJlYW0ucHJvdG90eXBlLm9wZW4gPSBSZWFkU3RyZWFtJG9wZW5cbiAgfVxuXG4gIHZhciBmcyRXcml0ZVN0cmVhbSA9IGZzLldyaXRlU3RyZWFtXG4gIGlmIChmcyRXcml0ZVN0cmVhbSkge1xuICAgIFdyaXRlU3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoZnMkV3JpdGVTdHJlYW0ucHJvdG90eXBlKVxuICAgIFdyaXRlU3RyZWFtLnByb3RvdHlwZS5vcGVuID0gV3JpdGVTdHJlYW0kb3BlblxuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZzLCAnUmVhZFN0cmVhbScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBSZWFkU3RyZWFtXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIFJlYWRTdHJlYW0gPSB2YWxcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmcywgJ1dyaXRlU3RyZWFtJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFdyaXRlU3RyZWFtXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIFdyaXRlU3RyZWFtID0gdmFsXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxuXG4gIC8vIGxlZ2FjeSBuYW1lc1xuICB2YXIgRmlsZVJlYWRTdHJlYW0gPSBSZWFkU3RyZWFtXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmcywgJ0ZpbGVSZWFkU3RyZWFtJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIEZpbGVSZWFkU3RyZWFtXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIEZpbGVSZWFkU3RyZWFtID0gdmFsXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxuICB2YXIgRmlsZVdyaXRlU3RyZWFtID0gV3JpdGVTdHJlYW1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZzLCAnRmlsZVdyaXRlU3RyZWFtJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIEZpbGVXcml0ZVN0cmVhbVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBGaWxlV3JpdGVTdHJlYW0gPSB2YWxcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG5cbiAgZnVuY3Rpb24gUmVhZFN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgUmVhZFN0cmVhbSlcbiAgICAgIHJldHVybiBmcyRSZWFkU3RyZWFtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRoaXNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gUmVhZFN0cmVhbS5hcHBseShPYmplY3QuY3JlYXRlKFJlYWRTdHJlYW0ucHJvdG90eXBlKSwgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gUmVhZFN0cmVhbSRvcGVuICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBvcGVuKHRoYXQucGF0aCwgdGhhdC5mbGFncywgdGhhdC5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAodGhhdC5hdXRvQ2xvc2UpXG4gICAgICAgICAgdGhhdC5kZXN0cm95KClcblxuICAgICAgICB0aGF0LmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5mZCA9IGZkXG4gICAgICAgIHRoYXQuZW1pdCgnb3BlbicsIGZkKVxuICAgICAgICB0aGF0LnJlYWQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBXcml0ZVN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgV3JpdGVTdHJlYW0pXG4gICAgICByZXR1cm4gZnMkV3JpdGVTdHJlYW0uYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdGhpc1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBXcml0ZVN0cmVhbS5hcHBseShPYmplY3QuY3JlYXRlKFdyaXRlU3RyZWFtLnByb3RvdHlwZSksIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIFdyaXRlU3RyZWFtJG9wZW4gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIG9wZW4odGhhdC5wYXRoLCB0aGF0LmZsYWdzLCB0aGF0Lm1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoYXQuZGVzdHJveSgpXG4gICAgICAgIHRoYXQuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0LmZkID0gZmRcbiAgICAgICAgdGhhdC5lbWl0KCdvcGVuJywgZmQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlYWRTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IGZzLlJlYWRTdHJlYW0ocGF0aCwgb3B0aW9ucylcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVdyaXRlU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBmcy5Xcml0ZVN0cmVhbShwYXRoLCBvcHRpb25zKVxuICB9XG5cbiAgdmFyIGZzJG9wZW4gPSBmcy5vcGVuXG4gIGZzLm9wZW4gPSBvcGVuXG4gIGZ1bmN0aW9uIG9wZW4gKHBhdGgsIGZsYWdzLCBtb2RlLCBjYikge1xuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gbW9kZSwgbW9kZSA9IG51bGxcblxuICAgIHJldHVybiBnbyRvcGVuKHBhdGgsIGZsYWdzLCBtb2RlLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJG9wZW4gKHBhdGgsIGZsYWdzLCBtb2RlLCBjYikge1xuICAgICAgcmV0dXJuIGZzJG9wZW4ocGF0aCwgZmxhZ3MsIG1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJG9wZW4sIFtwYXRoLCBmbGFncywgbW9kZSwgY2JdXSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICByZXRyeSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZzXG59XG5cbmZ1bmN0aW9uIGVucXVldWUgKGVsZW0pIHtcbiAgZGVidWcoJ0VOUVVFVUUnLCBlbGVtWzBdLm5hbWUsIGVsZW1bMV0pXG4gIGZzW2dyYWNlZnVsUXVldWVdLnB1c2goZWxlbSlcbn1cblxuZnVuY3Rpb24gcmV0cnkgKCkge1xuICB2YXIgZWxlbSA9IGZzW2dyYWNlZnVsUXVldWVdLnNoaWZ0KClcbiAgaWYgKGVsZW0pIHtcbiAgICBkZWJ1ZygnUkVUUlknLCBlbGVtWzBdLm5hbWUsIGVsZW1bMV0pXG4gICAgZWxlbVswXS5hcHBseShudWxsLCBlbGVtWzFdKVxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG4vLyBUaGlzIGlzIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9ybWFsaXplL216XG4vLyBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNiBKb25hdGhhbiBPbmcgbWVAam9uZ2xlYmVycnkuY29tIGFuZCBDb250cmlidXRvcnNcbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuXG5jb25zdCBhcGkgPSBbXG4gICdhY2Nlc3MnLFxuICAnYXBwZW5kRmlsZScsXG4gICdjaG1vZCcsXG4gICdjaG93bicsXG4gICdjbG9zZScsXG4gICdjb3B5RmlsZScsXG4gICdmY2htb2QnLFxuICAnZmNob3duJyxcbiAgJ2ZkYXRhc3luYycsXG4gICdmc3RhdCcsXG4gICdmc3luYycsXG4gICdmdHJ1bmNhdGUnLFxuICAnZnV0aW1lcycsXG4gICdsY2htb2QnLFxuICAnbGNob3duJyxcbiAgJ2xpbmsnLFxuICAnbHN0YXQnLFxuICAnbWtkaXInLFxuICAnbWtkdGVtcCcsXG4gICdvcGVuJyxcbiAgJ29wZW5kaXInLFxuICAncmVhZGRpcicsXG4gICdyZWFkRmlsZScsXG4gICdyZWFkbGluaycsXG4gICdyZWFscGF0aCcsXG4gICdyZW5hbWUnLFxuICAncm1kaXInLFxuICAnc3RhdCcsXG4gICdzeW1saW5rJyxcbiAgJ3RydW5jYXRlJyxcbiAgJ3VubGluaycsXG4gICd1dGltZXMnLFxuICAnd3JpdGVGaWxlJ1xuXS5maWx0ZXIoa2V5ID0+IHtcbiAgLy8gU29tZSBjb21tYW5kcyBhcmUgbm90IGF2YWlsYWJsZSBvbiBzb21lIHN5c3RlbXMuIEV4OlxuICAvLyBmcy5vcGVuZGlyIHdhcyBhZGRlZCBpbiBOb2RlLmpzIHYxMi4xMi4wXG4gIC8vIGZzLmxjaG93biBpcyBub3QgYXZhaWxhYmxlIG9uIGF0IGxlYXN0IHNvbWUgTGludXhcbiAgcmV0dXJuIHR5cGVvZiBmc1trZXldID09PSAnZnVuY3Rpb24nXG59KVxuXG4vLyBFeHBvcnQgYWxsIGtleXM6XG5PYmplY3Qua2V5cyhmcykuZm9yRWFjaChrZXkgPT4ge1xuICBpZiAoa2V5ID09PSAncHJvbWlzZXMnKSB7XG4gICAgLy8gZnMucHJvbWlzZXMgaXMgYSBnZXR0ZXIgcHJvcGVydHkgdGhhdCB0cmlnZ2VycyBFeHBlcmltZW50YWxXYXJuaW5nXG4gICAgLy8gRG9uJ3QgcmUtZXhwb3J0IGl0IGhlcmUsIHRoZSBnZXR0ZXIgaXMgZGVmaW5lZCBpbiBcImxpYi9pbmRleC5qc1wiXG4gICAgcmV0dXJuXG4gIH1cbiAgZXhwb3J0c1trZXldID0gZnNba2V5XVxufSlcblxuLy8gVW5pdmVyc2FsaWZ5IGFzeW5jIG1ldGhvZHM6XG5hcGkuZm9yRWFjaChtZXRob2QgPT4ge1xuICBleHBvcnRzW21ldGhvZF0gPSB1KGZzW21ldGhvZF0pXG59KVxuXG4vLyBXZSBkaWZmZXIgZnJvbSBtei9mcyBpbiB0aGF0IHdlIHN0aWxsIHNoaXAgdGhlIG9sZCwgYnJva2VuLCBmcy5leGlzdHMoKVxuLy8gc2luY2Ugd2UgYXJlIGEgZHJvcC1pbiByZXBsYWNlbWVudCBmb3IgdGhlIG5hdGl2ZSBtb2R1bGVcbmV4cG9ydHMuZXhpc3RzID0gZnVuY3Rpb24gKGZpbGVuYW1lLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0cyhmaWxlbmFtZSwgY2FsbGJhY2spXG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIHJldHVybiBmcy5leGlzdHMoZmlsZW5hbWUsIHJlc29sdmUpXG4gIH0pXG59XG5cbi8vIGZzLnJlYWQoKSwgZnMud3JpdGUoKSwgJiBmcy53cml0ZXYoKSBuZWVkIHNwZWNpYWwgdHJlYXRtZW50IGR1ZSB0byBtdWx0aXBsZSBjYWxsYmFjayBhcmdzXG5cbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZnMucmVhZChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZnMucmVhZChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIChlcnIsIGJ5dGVzUmVhZCwgYnVmZmVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUoeyBieXRlc1JlYWQsIGJ1ZmZlciB9KVxuICAgIH0pXG4gIH0pXG59XG5cbi8vIEZ1bmN0aW9uIHNpZ25hdHVyZSBjYW4gYmVcbi8vIGZzLndyaXRlKGZkLCBidWZmZXJbLCBvZmZzZXRbLCBsZW5ndGhbLCBwb3NpdGlvbl1dXSwgY2FsbGJhY2spXG4vLyBPUlxuLy8gZnMud3JpdGUoZmQsIHN0cmluZ1ssIHBvc2l0aW9uWywgZW5jb2RpbmddXSwgY2FsbGJhY2spXG4vLyBXZSBuZWVkIHRvIGhhbmRsZSBib3RoIGNhc2VzLCBzbyB3ZSB1c2UgLi4uYXJnc1xuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChmZCwgYnVmZmVyLCAuLi5hcmdzKSB7XG4gIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZzLndyaXRlKGZkLCBidWZmZXIsIC4uLmFyZ3MpXG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLndyaXRlKGZkLCBidWZmZXIsIC4uLmFyZ3MsIChlcnIsIGJ5dGVzV3JpdHRlbiwgYnVmZmVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUoeyBieXRlc1dyaXR0ZW4sIGJ1ZmZlciB9KVxuICAgIH0pXG4gIH0pXG59XG5cbi8vIGZzLndyaXRldiBvbmx5IGF2YWlsYWJsZSBpbiBOb2RlIHYxMi45LjArXG5pZiAodHlwZW9mIGZzLndyaXRldiA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBGdW5jdGlvbiBzaWduYXR1cmUgaXNcbiAgLy8gcy53cml0ZXYoZmQsIGJ1ZmZlcnNbLCBwb3NpdGlvbl0sIGNhbGxiYWNrKVxuICAvLyBXZSBuZWVkIHRvIGhhbmRsZSB0aGUgb3B0aW9uYWwgYXJnLCBzbyB3ZSB1c2UgLi4uYXJnc1xuICBleHBvcnRzLndyaXRldiA9IGZ1bmN0aW9uIChmZCwgYnVmZmVycywgLi4uYXJncykge1xuICAgIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZnMud3JpdGV2KGZkLCBidWZmZXJzLCAuLi5hcmdzKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmcy53cml0ZXYoZmQsIGJ1ZmZlcnMsIC4uLmFyZ3MsIChlcnIsIGJ5dGVzV3JpdHRlbiwgYnVmZmVycykgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZSh7IGJ5dGVzV3JpdHRlbiwgYnVmZmVycyB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbi8vIGZzLnJlYWxwYXRoLm5hdGl2ZSBvbmx5IGF2YWlsYWJsZSBpbiBOb2RlIHY5LjIrXG5pZiAodHlwZW9mIGZzLnJlYWxwYXRoLm5hdGl2ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBleHBvcnRzLnJlYWxwYXRoLm5hdGl2ZSA9IHUoZnMucmVhbHBhdGgubmF0aXZlKVxufVxuIiwgIm1vZHVsZS5leHBvcnRzID0gciA9PiB7XG4gIGNvbnN0IG4gPSBwcm9jZXNzLnZlcnNpb25zLm5vZGUuc3BsaXQoJy4nKS5tYXAoeCA9PiBwYXJzZUludCh4LCAxMCkpXG4gIHIgPSByLnNwbGl0KCcuJykubWFwKHggPT4gcGFyc2VJbnQoeCwgMTApKVxuICByZXR1cm4gblswXSA+IHJbMF0gfHwgKG5bMF0gPT09IHJbMF0gJiYgKG5bMV0gPiByWzFdIHx8IChuWzFdID09PSByWzFdICYmIG5bMl0gPj0gclsyXSkpKVxufVxuIiwgIi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL21ha2UtZGlyXG4vLyBDb3B5cmlnaHQgKGMpIFNpbmRyZSBTb3JodXMgPHNpbmRyZXNvcmh1c0BnbWFpbC5jb20+IChzaW5kcmVzb3JodXMuY29tKVxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4ndXNlIHN0cmljdCdcbmNvbnN0IGZzID0gcmVxdWlyZSgnLi4vZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgYXRMZWFzdE5vZGUgPSByZXF1aXJlKCdhdC1sZWFzdC1ub2RlJylcblxuY29uc3QgdXNlTmF0aXZlUmVjdXJzaXZlT3B0aW9uID0gYXRMZWFzdE5vZGUoJzEwLjEyLjAnKVxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzg5ODdcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9saWJ1di9saWJ1di9wdWxsLzEwODhcbmNvbnN0IGNoZWNrUGF0aCA9IHB0aCA9PiB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgY29uc3QgcGF0aEhhc0ludmFsaWRXaW5DaGFyYWN0ZXJzID0gL1s8PjpcInw/Kl0vLnRlc3QocHRoLnJlcGxhY2UocGF0aC5wYXJzZShwdGgpLnJvb3QsICcnKSlcblxuICAgIGlmIChwYXRoSGFzSW52YWxpZFdpbkNoYXJhY3RlcnMpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBQYXRoIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyczogJHtwdGh9YClcbiAgICAgIGVycm9yLmNvZGUgPSAnRUlOVkFMJ1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgcHJvY2Vzc09wdGlvbnMgPSBvcHRpb25zID0+IHtcbiAgY29uc3QgZGVmYXVsdHMgPSB7IG1vZGU6IDBvNzc3IH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykgb3B0aW9ucyA9IHsgbW9kZTogb3B0aW9ucyB9XG4gIHJldHVybiB7IC4uLmRlZmF1bHRzLCAuLi5vcHRpb25zIH1cbn1cblxuY29uc3QgcGVybWlzc2lvbkVycm9yID0gcHRoID0+IHtcbiAgLy8gVGhpcyByZXBsaWNhdGVzIHRoZSBleGNlcHRpb24gb2YgYGZzLm1rZGlyYCB3aXRoIG5hdGl2ZSB0aGVcbiAgLy8gYHJlY3VzaXZlYCBvcHRpb24gd2hlbiBydW4gb24gYW4gaW52YWxpZCBkcml2ZSB1bmRlciBXaW5kb3dzLlxuICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgb3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWQsIG1rZGlyICcke3B0aH0nYClcbiAgZXJyb3IuY29kZSA9ICdFUEVSTSdcbiAgZXJyb3IuZXJybm8gPSAtNDA0OFxuICBlcnJvci5wYXRoID0gcHRoXG4gIGVycm9yLnN5c2NhbGwgPSAnbWtkaXInXG4gIHJldHVybiBlcnJvclxufVxuXG5tb2R1bGUuZXhwb3J0cy5tYWtlRGlyID0gYXN5bmMgKGlucHV0LCBvcHRpb25zKSA9PiB7XG4gIGNoZWNrUGF0aChpbnB1dClcbiAgb3B0aW9ucyA9IHByb2Nlc3NPcHRpb25zKG9wdGlvbnMpXG5cbiAgaWYgKHVzZU5hdGl2ZVJlY3Vyc2l2ZU9wdGlvbikge1xuICAgIGNvbnN0IHB0aCA9IHBhdGgucmVzb2x2ZShpbnB1dClcblxuICAgIHJldHVybiBmcy5ta2RpcihwdGgsIHtcbiAgICAgIG1vZGU6IG9wdGlvbnMubW9kZSxcbiAgICAgIHJlY3Vyc2l2ZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBtYWtlID0gYXN5bmMgcHRoID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZnMubWtkaXIocHRoLCBvcHRpb25zLm1vZGUpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnRVBFUk0nKSB7XG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICBpZiAocGF0aC5kaXJuYW1lKHB0aCkgPT09IHB0aCkge1xuICAgICAgICAgIHRocm93IHBlcm1pc3Npb25FcnJvcihwdGgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnbnVsbCBieXRlcycpKSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IG1ha2UocGF0aC5kaXJuYW1lKHB0aCkpXG4gICAgICAgIHJldHVybiBtYWtlKHB0aClcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc3RhdHMgPSBhd2FpdCBmcy5zdGF0KHB0aClcbiAgICAgICAgaWYgKCFzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgLy8gVGhpcyBlcnJvciBpcyBuZXZlciBleHBvc2VkIHRvIHRoZSB1c2VyXG4gICAgICAgICAgLy8gaXQgaXMgY2F1Z2h0IGJlbG93LCBhbmQgdGhlIG9yaWdpbmFsIGVycm9yIGlzIHRocm93blxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhdGggaXMgbm90IGEgZGlyZWN0b3J5JylcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1ha2UocGF0aC5yZXNvbHZlKGlucHV0KSlcbn1cblxubW9kdWxlLmV4cG9ydHMubWFrZURpclN5bmMgPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcbiAgY2hlY2tQYXRoKGlucHV0KVxuICBvcHRpb25zID0gcHJvY2Vzc09wdGlvbnMob3B0aW9ucylcblxuICBpZiAodXNlTmF0aXZlUmVjdXJzaXZlT3B0aW9uKSB7XG4gICAgY29uc3QgcHRoID0gcGF0aC5yZXNvbHZlKGlucHV0KVxuXG4gICAgcmV0dXJuIGZzLm1rZGlyU3luYyhwdGgsIHtcbiAgICAgIG1vZGU6IG9wdGlvbnMubW9kZSxcbiAgICAgIHJlY3Vyc2l2ZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBtYWtlID0gcHRoID0+IHtcbiAgICB0cnkge1xuICAgICAgZnMubWtkaXJTeW5jKHB0aCwgb3B0aW9ucy5tb2RlKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgaWYgKHBhdGguZGlybmFtZShwdGgpID09PSBwdGgpIHtcbiAgICAgICAgICB0aHJvdyBwZXJtaXNzaW9uRXJyb3IocHRoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ251bGwgYnl0ZXMnKSkge1xuICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgIH1cblxuICAgICAgICBtYWtlKHBhdGguZGlybmFtZShwdGgpKVxuICAgICAgICByZXR1cm4gbWFrZShwdGgpXG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghZnMuc3RhdFN5bmMocHRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgLy8gVGhpcyBlcnJvciBpcyBuZXZlciBleHBvc2VkIHRvIHRoZSB1c2VyXG4gICAgICAgICAgLy8gaXQgaXMgY2F1Z2h0IGJlbG93LCBhbmQgdGhlIG9yaWdpbmFsIGVycm9yIGlzIHRocm93blxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhdGggaXMgbm90IGEgZGlyZWN0b3J5JylcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1ha2UocGF0aC5yZXNvbHZlKGlucHV0KSlcbn1cbiIsICIndXNlIHN0cmljdCdcbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tUHJvbWlzZVxuY29uc3QgeyBtYWtlRGlyOiBfbWFrZURpciwgbWFrZURpclN5bmMgfSA9IHJlcXVpcmUoJy4vbWFrZS1kaXInKVxuY29uc3QgbWFrZURpciA9IHUoX21ha2VEaXIpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBta2RpcnM6IG1ha2VEaXIsXG4gIG1rZGlyc1N5bmM6IG1ha2VEaXJTeW5jLFxuICAvLyBhbGlhc1xuICBta2RpcnA6IG1ha2VEaXIsXG4gIG1rZGlycFN5bmM6IG1ha2VEaXJTeW5jLFxuICBlbnN1cmVEaXI6IG1ha2VEaXIsXG4gIGVuc3VyZURpclN5bmM6IG1ha2VEaXJTeW5jXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuXG5mdW5jdGlvbiB1dGltZXNNaWxsaXMgKHBhdGgsIGF0aW1lLCBtdGltZSwgY2FsbGJhY2spIHtcbiAgLy8gaWYgKCFIQVNfTUlMTElTX1JFUykgcmV0dXJuIGZzLnV0aW1lcyhwYXRoLCBhdGltZSwgbXRpbWUsIGNhbGxiYWNrKVxuICBmcy5vcGVuKHBhdGgsICdyKycsIChlcnIsIGZkKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICBmcy5mdXRpbWVzKGZkLCBhdGltZSwgbXRpbWUsIGZ1dGltZXNFcnIgPT4ge1xuICAgICAgZnMuY2xvc2UoZmQsIGNsb3NlRXJyID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhmdXRpbWVzRXJyIHx8IGNsb3NlRXJyKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiB1dGltZXNNaWxsaXNTeW5jIChwYXRoLCBhdGltZSwgbXRpbWUpIHtcbiAgY29uc3QgZmQgPSBmcy5vcGVuU3luYyhwYXRoLCAncisnKVxuICBmcy5mdXRpbWVzU3luYyhmZCwgYXRpbWUsIG10aW1lKVxuICByZXR1cm4gZnMuY2xvc2VTeW5jKGZkKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdXRpbWVzTWlsbGlzLFxuICB1dGltZXNNaWxsaXNTeW5jXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnLi4vZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuY29uc3QgYXRMZWFzdE5vZGUgPSByZXF1aXJlKCdhdC1sZWFzdC1ub2RlJylcblxuY29uc3Qgbm9kZVN1cHBvcnRzQmlnSW50ID0gYXRMZWFzdE5vZGUoJzEwLjUuMCcpXG5jb25zdCBzdGF0ID0gKGZpbGUpID0+IG5vZGVTdXBwb3J0c0JpZ0ludCA/IGZzLnN0YXQoZmlsZSwgeyBiaWdpbnQ6IHRydWUgfSkgOiBmcy5zdGF0KGZpbGUpXG5jb25zdCBzdGF0U3luYyA9IChmaWxlKSA9PiBub2RlU3VwcG9ydHNCaWdJbnQgPyBmcy5zdGF0U3luYyhmaWxlLCB7IGJpZ2ludDogdHJ1ZSB9KSA6IGZzLnN0YXRTeW5jKGZpbGUpXG5cbmZ1bmN0aW9uIGdldFN0YXRzIChzcmMsIGRlc3QpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICBzdGF0KHNyYyksXG4gICAgc3RhdChkZXN0KS5jYXRjaChlcnIgPT4ge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuIG51bGxcbiAgICAgIHRocm93IGVyclxuICAgIH0pXG4gIF0pLnRoZW4oKFtzcmNTdGF0LCBkZXN0U3RhdF0pID0+ICh7IHNyY1N0YXQsIGRlc3RTdGF0IH0pKVxufVxuXG5mdW5jdGlvbiBnZXRTdGF0c1N5bmMgKHNyYywgZGVzdCkge1xuICBsZXQgZGVzdFN0YXRcbiAgY29uc3Qgc3JjU3RhdCA9IHN0YXRTeW5jKHNyYylcbiAgdHJ5IHtcbiAgICBkZXN0U3RhdCA9IHN0YXRTeW5jKGRlc3QpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHJldHVybiB7IHNyY1N0YXQsIGRlc3RTdGF0OiBudWxsIH1cbiAgICB0aHJvdyBlcnJcbiAgfVxuICByZXR1cm4geyBzcmNTdGF0LCBkZXN0U3RhdCB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUGF0aHMgKHNyYywgZGVzdCwgZnVuY05hbWUsIGNiKSB7XG4gIHV0aWwuY2FsbGJhY2tpZnkoZ2V0U3RhdHMpKHNyYywgZGVzdCwgKGVyciwgc3RhdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvbnN0IHsgc3JjU3RhdCwgZGVzdFN0YXQgfSA9IHN0YXRzXG4gICAgaWYgKGRlc3RTdGF0ICYmIGFyZUlkZW50aWNhbChzcmNTdGF0LCBkZXN0U3RhdCkpIHtcbiAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ1NvdXJjZSBhbmQgZGVzdGluYXRpb24gbXVzdCBub3QgYmUgdGhlIHNhbWUuJykpXG4gICAgfVxuICAgIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5KCkgJiYgaXNTcmNTdWJkaXIoc3JjLCBkZXN0KSkge1xuICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihlcnJNc2coc3JjLCBkZXN0LCBmdW5jTmFtZSkpKVxuICAgIH1cbiAgICByZXR1cm4gY2IobnVsbCwgeyBzcmNTdGF0LCBkZXN0U3RhdCB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjaGVja1BhdGhzU3luYyAoc3JjLCBkZXN0LCBmdW5jTmFtZSkge1xuICBjb25zdCB7IHNyY1N0YXQsIGRlc3RTdGF0IH0gPSBnZXRTdGF0c1N5bmMoc3JjLCBkZXN0KVxuICBpZiAoZGVzdFN0YXQgJiYgYXJlSWRlbnRpY2FsKHNyY1N0YXQsIGRlc3RTdGF0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBtdXN0IG5vdCBiZSB0aGUgc2FtZS4nKVxuICB9XG4gIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5KCkgJiYgaXNTcmNTdWJkaXIoc3JjLCBkZXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2coc3JjLCBkZXN0LCBmdW5jTmFtZSkpXG4gIH1cbiAgcmV0dXJuIHsgc3JjU3RhdCwgZGVzdFN0YXQgfVxufVxuXG4vLyByZWN1cnNpdmVseSBjaGVjayBpZiBkZXN0IHBhcmVudCBpcyBhIHN1YmRpcmVjdG9yeSBvZiBzcmMuXG4vLyBJdCB3b3JrcyBmb3IgYWxsIGZpbGUgdHlwZXMgaW5jbHVkaW5nIHN5bWxpbmtzIHNpbmNlIGl0XG4vLyBjaGVja3MgdGhlIHNyYyBhbmQgZGVzdCBpbm9kZXMuIEl0IHN0YXJ0cyBmcm9tIHRoZSBkZWVwZXN0XG4vLyBwYXJlbnQgYW5kIHN0b3BzIG9uY2UgaXQgcmVhY2hlcyB0aGUgc3JjIHBhcmVudCBvciB0aGUgcm9vdCBwYXRoLlxuZnVuY3Rpb24gY2hlY2tQYXJlbnRQYXRocyAoc3JjLCBzcmNTdGF0LCBkZXN0LCBmdW5jTmFtZSwgY2IpIHtcbiAgY29uc3Qgc3JjUGFyZW50ID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShzcmMpKVxuICBjb25zdCBkZXN0UGFyZW50ID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShkZXN0KSlcbiAgaWYgKGRlc3RQYXJlbnQgPT09IHNyY1BhcmVudCB8fCBkZXN0UGFyZW50ID09PSBwYXRoLnBhcnNlKGRlc3RQYXJlbnQpLnJvb3QpIHJldHVybiBjYigpXG4gIGNvbnN0IGNhbGxiYWNrID0gKGVyciwgZGVzdFN0YXQpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSByZXR1cm4gY2IoKVxuICAgICAgcmV0dXJuIGNiKGVycilcbiAgICB9XG4gICAgaWYgKGFyZUlkZW50aWNhbChzcmNTdGF0LCBkZXN0U3RhdCkpIHtcbiAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoZXJyTXNnKHNyYywgZGVzdCwgZnVuY05hbWUpKSlcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrUGFyZW50UGF0aHMoc3JjLCBzcmNTdGF0LCBkZXN0UGFyZW50LCBmdW5jTmFtZSwgY2IpXG4gIH1cbiAgaWYgKG5vZGVTdXBwb3J0c0JpZ0ludCkgZnMuc3RhdChkZXN0UGFyZW50LCB7IGJpZ2ludDogdHJ1ZSB9LCBjYWxsYmFjaylcbiAgZWxzZSBmcy5zdGF0KGRlc3RQYXJlbnQsIGNhbGxiYWNrKVxufVxuXG5mdW5jdGlvbiBjaGVja1BhcmVudFBhdGhzU3luYyAoc3JjLCBzcmNTdGF0LCBkZXN0LCBmdW5jTmFtZSkge1xuICBjb25zdCBzcmNQYXJlbnQgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHNyYykpXG4gIGNvbnN0IGRlc3RQYXJlbnQgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGRlc3QpKVxuICBpZiAoZGVzdFBhcmVudCA9PT0gc3JjUGFyZW50IHx8IGRlc3RQYXJlbnQgPT09IHBhdGgucGFyc2UoZGVzdFBhcmVudCkucm9vdCkgcmV0dXJuXG4gIGxldCBkZXN0U3RhdFxuICB0cnkge1xuICAgIGRlc3RTdGF0ID0gc3RhdFN5bmMoZGVzdFBhcmVudClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuXG4gICAgdGhyb3cgZXJyXG4gIH1cbiAgaWYgKGFyZUlkZW50aWNhbChzcmNTdGF0LCBkZXN0U3RhdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKHNyYywgZGVzdCwgZnVuY05hbWUpKVxuICB9XG4gIHJldHVybiBjaGVja1BhcmVudFBhdGhzU3luYyhzcmMsIHNyY1N0YXQsIGRlc3RQYXJlbnQsIGZ1bmNOYW1lKVxufVxuXG5mdW5jdGlvbiBhcmVJZGVudGljYWwgKHNyY1N0YXQsIGRlc3RTdGF0KSB7XG4gIGlmIChkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldikge1xuICAgIGlmIChub2RlU3VwcG9ydHNCaWdJbnQgfHwgZGVzdFN0YXQuaW5vIDwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgIC8vIGRlZmluaXRpdmUgYW5zd2VyXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICAvLyBVc2UgYWRkaXRpb25hbCBoZXVyaXN0aWNzIGlmIHdlIGNhbid0IHVzZSAnYmlnaW50Jy5cbiAgICAvLyBEaWZmZXJlbnQgJ2lubycgY291bGQgYmUgcmVwcmVzZW50ZWQgdGhlIHNhbWUgaWYgdGhleSBhcmUgPj0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAvLyBTZWUgaXNzdWUgNjU3XG4gICAgaWYgKGRlc3RTdGF0LnNpemUgPT09IHNyY1N0YXQuc2l6ZSAmJlxuICAgICAgICBkZXN0U3RhdC5tb2RlID09PSBzcmNTdGF0Lm1vZGUgJiZcbiAgICAgICAgZGVzdFN0YXQubmxpbmsgPT09IHNyY1N0YXQubmxpbmsgJiZcbiAgICAgICAgZGVzdFN0YXQuYXRpbWVNcyA9PT0gc3JjU3RhdC5hdGltZU1zICYmXG4gICAgICAgIGRlc3RTdGF0Lm10aW1lTXMgPT09IHNyY1N0YXQubXRpbWVNcyAmJlxuICAgICAgICBkZXN0U3RhdC5jdGltZU1zID09PSBzcmNTdGF0LmN0aW1lTXMgJiZcbiAgICAgICAgZGVzdFN0YXQuYmlydGh0aW1lTXMgPT09IHNyY1N0YXQuYmlydGh0aW1lTXMpIHtcbiAgICAgIC8vIGhldXJpc3RpYyBhbnN3ZXJcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vLyByZXR1cm4gdHJ1ZSBpZiBkZXN0IGlzIGEgc3ViZGlyIG9mIHNyYywgb3RoZXJ3aXNlIGZhbHNlLlxuLy8gSXQgb25seSBjaGVja3MgdGhlIHBhdGggc3RyaW5ncy5cbmZ1bmN0aW9uIGlzU3JjU3ViZGlyIChzcmMsIGRlc3QpIHtcbiAgY29uc3Qgc3JjQXJyID0gcGF0aC5yZXNvbHZlKHNyYykuc3BsaXQocGF0aC5zZXApLmZpbHRlcihpID0+IGkpXG4gIGNvbnN0IGRlc3RBcnIgPSBwYXRoLnJlc29sdmUoZGVzdCkuc3BsaXQocGF0aC5zZXApLmZpbHRlcihpID0+IGkpXG4gIHJldHVybiBzcmNBcnIucmVkdWNlKChhY2MsIGN1ciwgaSkgPT4gYWNjICYmIGRlc3RBcnJbaV0gPT09IGN1ciwgdHJ1ZSlcbn1cblxuZnVuY3Rpb24gZXJyTXNnIChzcmMsIGRlc3QsIGZ1bmNOYW1lKSB7XG4gIHJldHVybiBgQ2Fubm90ICR7ZnVuY05hbWV9ICcke3NyY30nIHRvIGEgc3ViZGlyZWN0b3J5IG9mIGl0c2VsZiwgJyR7ZGVzdH0nLmBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrUGF0aHMsXG4gIGNoZWNrUGF0aHNTeW5jLFxuICBjaGVja1BhcmVudFBhdGhzLFxuICBjaGVja1BhcmVudFBhdGhzU3luYyxcbiAgaXNTcmNTdWJkaXJcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBta2RpcnNTeW5jID0gcmVxdWlyZSgnLi4vbWtkaXJzJykubWtkaXJzU3luY1xuY29uc3QgdXRpbWVzTWlsbGlzU3luYyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbWVzJykudXRpbWVzTWlsbGlzU3luY1xuY29uc3Qgc3RhdCA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmZ1bmN0aW9uIGNvcHlTeW5jIChzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IHsgZmlsdGVyOiBvcHRzIH1cbiAgfVxuXG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIG9wdHMuY2xvYmJlciA9ICdjbG9iYmVyJyBpbiBvcHRzID8gISFvcHRzLmNsb2JiZXIgOiB0cnVlIC8vIGRlZmF1bHQgdG8gdHJ1ZSBmb3Igbm93XG4gIG9wdHMub3ZlcndyaXRlID0gJ292ZXJ3cml0ZScgaW4gb3B0cyA/ICEhb3B0cy5vdmVyd3JpdGUgOiBvcHRzLmNsb2JiZXIgLy8gb3ZlcndyaXRlIGZhbGxzIGJhY2sgdG8gY2xvYmJlclxuXG4gIC8vIFdhcm4gYWJvdXQgdXNpbmcgcHJlc2VydmVUaW1lc3RhbXBzIG9uIDMyLWJpdCBub2RlXG4gIGlmIChvcHRzLnByZXNlcnZlVGltZXN0YW1wcyAmJiBwcm9jZXNzLmFyY2ggPT09ICdpYTMyJykge1xuICAgIGNvbnNvbGUud2FybihgZnMtZXh0cmE6IFVzaW5nIHRoZSBwcmVzZXJ2ZVRpbWVzdGFtcHMgb3B0aW9uIGluIDMyLWJpdCBub2RlIGlzIG5vdCByZWNvbW1lbmRlZDtcXG5cbiAgICBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2pwcmljaGFyZHNvbi9ub2RlLWZzLWV4dHJhL2lzc3Vlcy8yNjlgKVxuICB9XG5cbiAgY29uc3QgeyBzcmNTdGF0LCBkZXN0U3RhdCB9ID0gc3RhdC5jaGVja1BhdGhzU3luYyhzcmMsIGRlc3QsICdjb3B5JylcbiAgc3RhdC5jaGVja1BhcmVudFBhdGhzU3luYyhzcmMsIHNyY1N0YXQsIGRlc3QsICdjb3B5JylcbiAgcmV0dXJuIGhhbmRsZUZpbHRlckFuZENvcHkoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbn1cblxuZnVuY3Rpb24gaGFuZGxlRmlsdGVyQW5kQ29weSAoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBpZiAob3B0cy5maWx0ZXIgJiYgIW9wdHMuZmlsdGVyKHNyYywgZGVzdCkpIHJldHVyblxuICBjb25zdCBkZXN0UGFyZW50ID0gcGF0aC5kaXJuYW1lKGRlc3QpXG4gIGlmICghZnMuZXhpc3RzU3luYyhkZXN0UGFyZW50KSkgbWtkaXJzU3luYyhkZXN0UGFyZW50KVxuICByZXR1cm4gc3RhcnRDb3B5KGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIHN0YXJ0Q29weSAoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBpZiAob3B0cy5maWx0ZXIgJiYgIW9wdHMuZmlsdGVyKHNyYywgZGVzdCkpIHJldHVyblxuICByZXR1cm4gZ2V0U3RhdHMoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdHMgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgY29uc3Qgc3RhdFN5bmMgPSBvcHRzLmRlcmVmZXJlbmNlID8gZnMuc3RhdFN5bmMgOiBmcy5sc3RhdFN5bmNcbiAgY29uc3Qgc3JjU3RhdCA9IHN0YXRTeW5jKHNyYylcblxuICBpZiAoc3JjU3RhdC5pc0RpcmVjdG9yeSgpKSByZXR1cm4gb25EaXIoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgZWxzZSBpZiAoc3JjU3RhdC5pc0ZpbGUoKSB8fFxuICAgICAgICAgICBzcmNTdGF0LmlzQ2hhcmFjdGVyRGV2aWNlKCkgfHxcbiAgICAgICAgICAgc3JjU3RhdC5pc0Jsb2NrRGV2aWNlKCkpIHJldHVybiBvbkZpbGUoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgZWxzZSBpZiAoc3JjU3RhdC5pc1N5bWJvbGljTGluaygpKSByZXR1cm4gb25MaW5rKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIG9uRmlsZSAoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBpZiAoIWRlc3RTdGF0KSByZXR1cm4gY29weUZpbGUoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxuICByZXR1cm4gbWF5Q29weUZpbGUoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxufVxuXG5mdW5jdGlvbiBtYXlDb3B5RmlsZSAoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmIChvcHRzLm92ZXJ3cml0ZSkge1xuICAgIGZzLnVubGlua1N5bmMoZGVzdClcbiAgICByZXR1cm4gY29weUZpbGUoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxuICB9IGVsc2UgaWYgKG9wdHMuZXJyb3JPbkV4aXN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAnJHtkZXN0fScgYWxyZWFkeSBleGlzdHNgKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvcHlGaWxlIChzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgZnMuY29weUZpbGVTeW5jKHNyYywgZGVzdClcbiAgaWYgKG9wdHMucHJlc2VydmVUaW1lc3RhbXBzKSBoYW5kbGVUaW1lc3RhbXBzKHNyY1N0YXQubW9kZSwgc3JjLCBkZXN0KVxuICByZXR1cm4gc2V0RGVzdE1vZGUoZGVzdCwgc3JjU3RhdC5tb2RlKVxufVxuXG5mdW5jdGlvbiBoYW5kbGVUaW1lc3RhbXBzIChzcmNNb2RlLCBzcmMsIGRlc3QpIHtcbiAgLy8gTWFrZSBzdXJlIHRoZSBmaWxlIGlzIHdyaXRhYmxlIGJlZm9yZSBzZXR0aW5nIHRoZSB0aW1lc3RhbXBcbiAgLy8gb3RoZXJ3aXNlIG9wZW4gZmFpbHMgd2l0aCBFUEVSTSB3aGVuIGludm9rZWQgd2l0aCAncisnXG4gIC8vICh0aHJvdWdoIHV0aW1lcyBjYWxsKVxuICBpZiAoZmlsZUlzTm90V3JpdGFibGUoc3JjTW9kZSkpIG1ha2VGaWxlV3JpdGFibGUoZGVzdCwgc3JjTW9kZSlcbiAgcmV0dXJuIHNldERlc3RUaW1lc3RhbXBzKHNyYywgZGVzdClcbn1cblxuZnVuY3Rpb24gZmlsZUlzTm90V3JpdGFibGUgKHNyY01vZGUpIHtcbiAgcmV0dXJuIChzcmNNb2RlICYgMG8yMDApID09PSAwXG59XG5cbmZ1bmN0aW9uIG1ha2VGaWxlV3JpdGFibGUgKGRlc3QsIHNyY01vZGUpIHtcbiAgcmV0dXJuIHNldERlc3RNb2RlKGRlc3QsIHNyY01vZGUgfCAwbzIwMClcbn1cblxuZnVuY3Rpb24gc2V0RGVzdE1vZGUgKGRlc3QsIHNyY01vZGUpIHtcbiAgcmV0dXJuIGZzLmNobW9kU3luYyhkZXN0LCBzcmNNb2RlKVxufVxuXG5mdW5jdGlvbiBzZXREZXN0VGltZXN0YW1wcyAoc3JjLCBkZXN0KSB7XG4gIC8vIFRoZSBpbml0aWFsIHNyY1N0YXQuYXRpbWUgY2Fubm90IGJlIHRydXN0ZWRcbiAgLy8gYmVjYXVzZSBpdCBpcyBtb2RpZmllZCBieSB0aGUgcmVhZCgyKSBzeXN0ZW0gY2FsbFxuICAvLyAoU2VlIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvZnMuaHRtbCNmc19zdGF0X3RpbWVfdmFsdWVzKVxuICBjb25zdCB1cGRhdGVkU3JjU3RhdCA9IGZzLnN0YXRTeW5jKHNyYylcbiAgcmV0dXJuIHV0aW1lc01pbGxpc1N5bmMoZGVzdCwgdXBkYXRlZFNyY1N0YXQuYXRpbWUsIHVwZGF0ZWRTcmNTdGF0Lm10aW1lKVxufVxuXG5mdW5jdGlvbiBvbkRpciAoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBpZiAoIWRlc3RTdGF0KSByZXR1cm4gbWtEaXJBbmRDb3B5KHNyY1N0YXQubW9kZSwgc3JjLCBkZXN0LCBvcHRzKVxuICBpZiAoZGVzdFN0YXQgJiYgIWRlc3RTdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYClcbiAgfVxuICByZXR1cm4gY29weURpcihzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIG1rRGlyQW5kQ29weSAoc3JjTW9kZSwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGZzLm1rZGlyU3luYyhkZXN0KVxuICBjb3B5RGlyKHNyYywgZGVzdCwgb3B0cylcbiAgcmV0dXJuIHNldERlc3RNb2RlKGRlc3QsIHNyY01vZGUpXG59XG5cbmZ1bmN0aW9uIGNvcHlEaXIgKHNyYywgZGVzdCwgb3B0cykge1xuICBmcy5yZWFkZGlyU3luYyhzcmMpLmZvckVhY2goaXRlbSA9PiBjb3B5RGlySXRlbShpdGVtLCBzcmMsIGRlc3QsIG9wdHMpKVxufVxuXG5mdW5jdGlvbiBjb3B5RGlySXRlbSAoaXRlbSwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGNvbnN0IHNyY0l0ZW0gPSBwYXRoLmpvaW4oc3JjLCBpdGVtKVxuICBjb25zdCBkZXN0SXRlbSA9IHBhdGguam9pbihkZXN0LCBpdGVtKVxuICBjb25zdCB7IGRlc3RTdGF0IH0gPSBzdGF0LmNoZWNrUGF0aHNTeW5jKHNyY0l0ZW0sIGRlc3RJdGVtLCAnY29weScpXG4gIHJldHVybiBzdGFydENvcHkoZGVzdFN0YXQsIHNyY0l0ZW0sIGRlc3RJdGVtLCBvcHRzKVxufVxuXG5mdW5jdGlvbiBvbkxpbmsgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgbGV0IHJlc29sdmVkU3JjID0gZnMucmVhZGxpbmtTeW5jKHNyYylcbiAgaWYgKG9wdHMuZGVyZWZlcmVuY2UpIHtcbiAgICByZXNvbHZlZFNyYyA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCByZXNvbHZlZFNyYylcbiAgfVxuXG4gIGlmICghZGVzdFN0YXQpIHtcbiAgICByZXR1cm4gZnMuc3ltbGlua1N5bmMocmVzb2x2ZWRTcmMsIGRlc3QpXG4gIH0gZWxzZSB7XG4gICAgbGV0IHJlc29sdmVkRGVzdFxuICAgIHRyeSB7XG4gICAgICByZXNvbHZlZERlc3QgPSBmcy5yZWFkbGlua1N5bmMoZGVzdClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIGRlc3QgZXhpc3RzIGFuZCBpcyBhIHJlZ3VsYXIgZmlsZSBvciBkaXJlY3RvcnksXG4gICAgICAvLyBXaW5kb3dzIG1heSB0aHJvdyBVTktOT1dOIGVycm9yLiBJZiBkZXN0IGFscmVhZHkgZXhpc3RzLFxuICAgICAgLy8gZnMgdGhyb3dzIGVycm9yIGFueXdheSwgc28gbm8gbmVlZCB0byBndWFyZCBhZ2FpbnN0IGl0IGhlcmUuXG4gICAgICBpZiAoZXJyLmNvZGUgPT09ICdFSU5WQUwnIHx8IGVyci5jb2RlID09PSAnVU5LTk9XTicpIHJldHVybiBmcy5zeW1saW5rU3luYyhyZXNvbHZlZFNyYywgZGVzdClcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgICBpZiAob3B0cy5kZXJlZmVyZW5jZSkge1xuICAgICAgcmVzb2x2ZWREZXN0ID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHJlc29sdmVkRGVzdClcbiAgICB9XG4gICAgaWYgKHN0YXQuaXNTcmNTdWJkaXIocmVzb2x2ZWRTcmMsIHJlc29sdmVkRGVzdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNvcHkgJyR7cmVzb2x2ZWRTcmN9JyB0byBhIHN1YmRpcmVjdG9yeSBvZiBpdHNlbGYsICcke3Jlc29sdmVkRGVzdH0nLmApXG4gICAgfVxuXG4gICAgLy8gcHJldmVudCBjb3B5IGlmIHNyYyBpcyBhIHN1YmRpciBvZiBkZXN0IHNpbmNlIHVubGlua2luZ1xuICAgIC8vIGRlc3QgaW4gdGhpcyBjYXNlIHdvdWxkIHJlc3VsdCBpbiByZW1vdmluZyBzcmMgY29udGVudHNcbiAgICAvLyBhbmQgdGhlcmVmb3JlIGEgYnJva2VuIHN5bWxpbmsgd291bGQgYmUgY3JlYXRlZC5cbiAgICBpZiAoZnMuc3RhdFN5bmMoZGVzdCkuaXNEaXJlY3RvcnkoKSAmJiBzdGF0LmlzU3JjU3ViZGlyKHJlc29sdmVkRGVzdCwgcmVzb2x2ZWRTcmMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgJyR7cmVzb2x2ZWREZXN0fScgd2l0aCAnJHtyZXNvbHZlZFNyY30nLmApXG4gICAgfVxuICAgIHJldHVybiBjb3B5TGluayhyZXNvbHZlZFNyYywgZGVzdClcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5TGluayAocmVzb2x2ZWRTcmMsIGRlc3QpIHtcbiAgZnMudW5saW5rU3luYyhkZXN0KVxuICByZXR1cm4gZnMuc3ltbGlua1N5bmMocmVzb2x2ZWRTcmMsIGRlc3QpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bmNcbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvcHlTeW5jOiByZXF1aXJlKCcuL2NvcHktc3luYycpXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbVByb21pc2VcbmNvbnN0IGZzID0gcmVxdWlyZSgnLi4vZnMnKVxuXG5mdW5jdGlvbiBwYXRoRXhpc3RzIChwYXRoKSB7XG4gIHJldHVybiBmcy5hY2Nlc3MocGF0aCkudGhlbigoKSA9PiB0cnVlKS5jYXRjaCgoKSA9PiBmYWxzZSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBhdGhFeGlzdHM6IHUocGF0aEV4aXN0cyksXG4gIHBhdGhFeGlzdHNTeW5jOiBmcy5leGlzdHNTeW5jXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgbWtkaXJzID0gcmVxdWlyZSgnLi4vbWtkaXJzJykubWtkaXJzXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5jb25zdCB1dGltZXNNaWxsaXMgPSByZXF1aXJlKCcuLi91dGlsL3V0aW1lcycpLnV0aW1lc01pbGxpc1xuY29uc3Qgc3RhdCA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmZ1bmN0aW9uIGNvcHkgKHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nICYmICFjYikge1xuICAgIGNiID0gb3B0c1xuICAgIG9wdHMgPSB7fVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IHsgZmlsdGVyOiBvcHRzIH1cbiAgfVxuXG4gIGNiID0gY2IgfHwgZnVuY3Rpb24gKCkge31cbiAgb3B0cyA9IG9wdHMgfHwge31cblxuICBvcHRzLmNsb2JiZXIgPSAnY2xvYmJlcicgaW4gb3B0cyA/ICEhb3B0cy5jbG9iYmVyIDogdHJ1ZSAvLyBkZWZhdWx0IHRvIHRydWUgZm9yIG5vd1xuICBvcHRzLm92ZXJ3cml0ZSA9ICdvdmVyd3JpdGUnIGluIG9wdHMgPyAhIW9wdHMub3ZlcndyaXRlIDogb3B0cy5jbG9iYmVyIC8vIG92ZXJ3cml0ZSBmYWxscyBiYWNrIHRvIGNsb2JiZXJcblxuICAvLyBXYXJuIGFib3V0IHVzaW5nIHByZXNlcnZlVGltZXN0YW1wcyBvbiAzMi1iaXQgbm9kZVxuICBpZiAob3B0cy5wcmVzZXJ2ZVRpbWVzdGFtcHMgJiYgcHJvY2Vzcy5hcmNoID09PSAnaWEzMicpIHtcbiAgICBjb25zb2xlLndhcm4oYGZzLWV4dHJhOiBVc2luZyB0aGUgcHJlc2VydmVUaW1lc3RhbXBzIG9wdGlvbiBpbiAzMi1iaXQgbm9kZSBpcyBub3QgcmVjb21tZW5kZWQ7XFxuXG4gICAgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcHJpY2hhcmRzb24vbm9kZS1mcy1leHRyYS9pc3N1ZXMvMjY5YClcbiAgfVxuXG4gIHN0YXQuY2hlY2tQYXRocyhzcmMsIGRlc3QsICdjb3B5JywgKGVyciwgc3RhdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvbnN0IHsgc3JjU3RhdCwgZGVzdFN0YXQgfSA9IHN0YXRzXG4gICAgc3RhdC5jaGVja1BhcmVudFBhdGhzKHNyYywgc3JjU3RhdCwgZGVzdCwgJ2NvcHknLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICAgIGlmIChvcHRzLmZpbHRlcikgcmV0dXJuIGhhbmRsZUZpbHRlcihjaGVja1BhcmVudERpciwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgICByZXR1cm4gY2hlY2tQYXJlbnREaXIoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gY2hlY2tQYXJlbnREaXIgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IGRlc3RQYXJlbnQgPSBwYXRoLmRpcm5hbWUoZGVzdClcbiAgcGF0aEV4aXN0cyhkZXN0UGFyZW50LCAoZXJyLCBkaXJFeGlzdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGlmIChkaXJFeGlzdHMpIHJldHVybiBzdGFydENvcHkoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgbWtkaXJzKGRlc3RQYXJlbnQsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIHN0YXJ0Q29weShkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGaWx0ZXIgKG9uSW5jbHVkZSwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgUHJvbWlzZS5yZXNvbHZlKG9wdHMuZmlsdGVyKHNyYywgZGVzdCkpLnRoZW4oaW5jbHVkZSA9PiB7XG4gICAgaWYgKGluY2x1ZGUpIHJldHVybiBvbkluY2x1ZGUoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgcmV0dXJuIGNiKClcbiAgfSwgZXJyb3IgPT4gY2IoZXJyb3IpKVxufVxuXG5mdW5jdGlvbiBzdGFydENvcHkgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmIChvcHRzLmZpbHRlcikgcmV0dXJuIGhhbmRsZUZpbHRlcihnZXRTdGF0cywgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gIHJldHVybiBnZXRTdGF0cyhkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdHMgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IHN0YXQgPSBvcHRzLmRlcmVmZXJlbmNlID8gZnMuc3RhdCA6IGZzLmxzdGF0XG4gIHN0YXQoc3JjLCAoZXJyLCBzcmNTdGF0KSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5KCkpIHJldHVybiBvbkRpcihzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbiAgICBlbHNlIGlmIChzcmNTdGF0LmlzRmlsZSgpIHx8XG4gICAgICAgICAgICAgc3JjU3RhdC5pc0NoYXJhY3RlckRldmljZSgpIHx8XG4gICAgICAgICAgICAgc3JjU3RhdC5pc0Jsb2NrRGV2aWNlKCkpIHJldHVybiBvbkZpbGUoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgZWxzZSBpZiAoc3JjU3RhdC5pc1N5bWJvbGljTGluaygpKSByZXR1cm4gb25MaW5rKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiBvbkZpbGUgKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBjb3B5RmlsZShzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICByZXR1cm4gbWF5Q29weUZpbGUoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbn1cblxuZnVuY3Rpb24gbWF5Q29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgaWYgKG9wdHMub3ZlcndyaXRlKSB7XG4gICAgZnMudW5saW5rKGRlc3QsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIGNvcHlGaWxlKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgfSlcbiAgfSBlbHNlIGlmIChvcHRzLmVycm9yT25FeGlzdCkge1xuICAgIHJldHVybiBjYihuZXcgRXJyb3IoYCcke2Rlc3R9JyBhbHJlYWR5IGV4aXN0c2ApKVxuICB9IGVsc2UgcmV0dXJuIGNiKClcbn1cblxuZnVuY3Rpb24gY29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgZnMuY29weUZpbGUoc3JjLCBkZXN0LCBlcnIgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgaWYgKG9wdHMucHJlc2VydmVUaW1lc3RhbXBzKSByZXR1cm4gaGFuZGxlVGltZXN0YW1wc0FuZE1vZGUoc3JjU3RhdC5tb2RlLCBzcmMsIGRlc3QsIGNiKVxuICAgIHJldHVybiBzZXREZXN0TW9kZShkZXN0LCBzcmNTdGF0Lm1vZGUsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVUaW1lc3RhbXBzQW5kTW9kZSAoc3JjTW9kZSwgc3JjLCBkZXN0LCBjYikge1xuICAvLyBNYWtlIHN1cmUgdGhlIGZpbGUgaXMgd3JpdGFibGUgYmVmb3JlIHNldHRpbmcgdGhlIHRpbWVzdGFtcFxuICAvLyBvdGhlcndpc2Ugb3BlbiBmYWlscyB3aXRoIEVQRVJNIHdoZW4gaW52b2tlZCB3aXRoICdyKydcbiAgLy8gKHRocm91Z2ggdXRpbWVzIGNhbGwpXG4gIGlmIChmaWxlSXNOb3RXcml0YWJsZShzcmNNb2RlKSkge1xuICAgIHJldHVybiBtYWtlRmlsZVdyaXRhYmxlKGRlc3QsIHNyY01vZGUsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIHNldERlc3RUaW1lc3RhbXBzQW5kTW9kZShzcmNNb2RlLCBzcmMsIGRlc3QsIGNiKVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIHNldERlc3RUaW1lc3RhbXBzQW5kTW9kZShzcmNNb2RlLCBzcmMsIGRlc3QsIGNiKVxufVxuXG5mdW5jdGlvbiBmaWxlSXNOb3RXcml0YWJsZSAoc3JjTW9kZSkge1xuICByZXR1cm4gKHNyY01vZGUgJiAwbzIwMCkgPT09IDBcbn1cblxuZnVuY3Rpb24gbWFrZUZpbGVXcml0YWJsZSAoZGVzdCwgc3JjTW9kZSwgY2IpIHtcbiAgcmV0dXJuIHNldERlc3RNb2RlKGRlc3QsIHNyY01vZGUgfCAwbzIwMCwgY2IpXG59XG5cbmZ1bmN0aW9uIHNldERlc3RUaW1lc3RhbXBzQW5kTW9kZSAoc3JjTW9kZSwgc3JjLCBkZXN0LCBjYikge1xuICBzZXREZXN0VGltZXN0YW1wcyhzcmMsIGRlc3QsIGVyciA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICByZXR1cm4gc2V0RGVzdE1vZGUoZGVzdCwgc3JjTW9kZSwgY2IpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHNldERlc3RNb2RlIChkZXN0LCBzcmNNb2RlLCBjYikge1xuICByZXR1cm4gZnMuY2htb2QoZGVzdCwgc3JjTW9kZSwgY2IpXG59XG5cbmZ1bmN0aW9uIHNldERlc3RUaW1lc3RhbXBzIChzcmMsIGRlc3QsIGNiKSB7XG4gIC8vIFRoZSBpbml0aWFsIHNyY1N0YXQuYXRpbWUgY2Fubm90IGJlIHRydXN0ZWRcbiAgLy8gYmVjYXVzZSBpdCBpcyBtb2RpZmllZCBieSB0aGUgcmVhZCgyKSBzeXN0ZW0gY2FsbFxuICAvLyAoU2VlIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvZnMuaHRtbCNmc19zdGF0X3RpbWVfdmFsdWVzKVxuICBmcy5zdGF0KHNyYywgKGVyciwgdXBkYXRlZFNyY1N0YXQpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIHJldHVybiB1dGltZXNNaWxsaXMoZGVzdCwgdXBkYXRlZFNyY1N0YXQuYXRpbWUsIHVwZGF0ZWRTcmNTdGF0Lm10aW1lLCBjYilcbiAgfSlcbn1cblxuZnVuY3Rpb24gb25EaXIgKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBta0RpckFuZENvcHkoc3JjU3RhdC5tb2RlLCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICBpZiAoZGVzdFN0YXQgJiYgIWRlc3RTdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICByZXR1cm4gY2IobmV3IEVycm9yKGBDYW5ub3Qgb3ZlcndyaXRlIG5vbi1kaXJlY3RvcnkgJyR7ZGVzdH0nIHdpdGggZGlyZWN0b3J5ICcke3NyY30nLmApKVxuICB9XG4gIHJldHVybiBjb3B5RGlyKHNyYywgZGVzdCwgb3B0cywgY2IpXG59XG5cbmZ1bmN0aW9uIG1rRGlyQW5kQ29weSAoc3JjTW9kZSwgc3JjLCBkZXN0LCBvcHRzLCBjYikge1xuICBmcy5ta2RpcihkZXN0LCBlcnIgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgY29weURpcihzcmMsIGRlc3QsIG9wdHMsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIHNldERlc3RNb2RlKGRlc3QsIHNyY01vZGUsIGNiKVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNvcHlEaXIgKHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgZnMucmVhZGRpcihzcmMsIChlcnIsIGl0ZW1zKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICByZXR1cm4gY29weURpckl0ZW1zKGl0ZW1zLCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiBjb3B5RGlySXRlbXMgKGl0ZW1zLCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IGl0ZW0gPSBpdGVtcy5wb3AoKVxuICBpZiAoIWl0ZW0pIHJldHVybiBjYigpXG4gIHJldHVybiBjb3B5RGlySXRlbShpdGVtcywgaXRlbSwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbn1cblxuZnVuY3Rpb24gY29weURpckl0ZW0gKGl0ZW1zLCBpdGVtLCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IHNyY0l0ZW0gPSBwYXRoLmpvaW4oc3JjLCBpdGVtKVxuICBjb25zdCBkZXN0SXRlbSA9IHBhdGguam9pbihkZXN0LCBpdGVtKVxuICBzdGF0LmNoZWNrUGF0aHMoc3JjSXRlbSwgZGVzdEl0ZW0sICdjb3B5JywgKGVyciwgc3RhdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvbnN0IHsgZGVzdFN0YXQgfSA9IHN0YXRzXG4gICAgc3RhcnRDb3B5KGRlc3RTdGF0LCBzcmNJdGVtLCBkZXN0SXRlbSwgb3B0cywgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgICByZXR1cm4gY29weURpckl0ZW1zKGl0ZW1zLCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG9uTGluayAoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgZnMucmVhZGxpbmsoc3JjLCAoZXJyLCByZXNvbHZlZFNyYykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgaWYgKG9wdHMuZGVyZWZlcmVuY2UpIHtcbiAgICAgIHJlc29sdmVkU3JjID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHJlc29sdmVkU3JjKVxuICAgIH1cblxuICAgIGlmICghZGVzdFN0YXQpIHtcbiAgICAgIHJldHVybiBmcy5zeW1saW5rKHJlc29sdmVkU3JjLCBkZXN0LCBjYilcbiAgICB9IGVsc2Uge1xuICAgICAgZnMucmVhZGxpbmsoZGVzdCwgKGVyciwgcmVzb2x2ZWREZXN0KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBkZXN0IGV4aXN0cyBhbmQgaXMgYSByZWd1bGFyIGZpbGUgb3IgZGlyZWN0b3J5LFxuICAgICAgICAgIC8vIFdpbmRvd3MgbWF5IHRocm93IFVOS05PV04gZXJyb3IuIElmIGRlc3QgYWxyZWFkeSBleGlzdHMsXG4gICAgICAgICAgLy8gZnMgdGhyb3dzIGVycm9yIGFueXdheSwgc28gbm8gbmVlZCB0byBndWFyZCBhZ2FpbnN0IGl0IGhlcmUuXG4gICAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRUlOVkFMJyB8fCBlcnIuY29kZSA9PT0gJ1VOS05PV04nKSByZXR1cm4gZnMuc3ltbGluayhyZXNvbHZlZFNyYywgZGVzdCwgY2IpXG4gICAgICAgICAgcmV0dXJuIGNiKGVycilcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5kZXJlZmVyZW5jZSkge1xuICAgICAgICAgIHJlc29sdmVkRGVzdCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCByZXNvbHZlZERlc3QpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXQuaXNTcmNTdWJkaXIocmVzb2x2ZWRTcmMsIHJlc29sdmVkRGVzdCkpIHtcbiAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGBDYW5ub3QgY29weSAnJHtyZXNvbHZlZFNyY30nIHRvIGEgc3ViZGlyZWN0b3J5IG9mIGl0c2VsZiwgJyR7cmVzb2x2ZWREZXN0fScuYCkpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBkbyBub3QgY29weSBpZiBzcmMgaXMgYSBzdWJkaXIgb2YgZGVzdCBzaW5jZSB1bmxpbmtpbmdcbiAgICAgICAgLy8gZGVzdCBpbiB0aGlzIGNhc2Ugd291bGQgcmVzdWx0IGluIHJlbW92aW5nIHNyYyBjb250ZW50c1xuICAgICAgICAvLyBhbmQgdGhlcmVmb3JlIGEgYnJva2VuIHN5bWxpbmsgd291bGQgYmUgY3JlYXRlZC5cbiAgICAgICAgaWYgKGRlc3RTdGF0LmlzRGlyZWN0b3J5KCkgJiYgc3RhdC5pc1NyY1N1YmRpcihyZXNvbHZlZERlc3QsIHJlc29sdmVkU3JjKSkge1xuICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgJyR7cmVzb2x2ZWREZXN0fScgd2l0aCAnJHtyZXNvbHZlZFNyY30nLmApKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5TGluayhyZXNvbHZlZFNyYywgZGVzdCwgY2IpXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gY29weUxpbmsgKHJlc29sdmVkU3JjLCBkZXN0LCBjYikge1xuICBmcy51bmxpbmsoZGVzdCwgZXJyID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIHJldHVybiBmcy5zeW1saW5rKHJlc29sdmVkU3JjLCBkZXN0LCBjYilcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb3B5OiB1KHJlcXVpcmUoJy4vY29weScpKVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG5cbmNvbnN0IGlzV2luZG93cyA9IChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKVxuXG5mdW5jdGlvbiBkZWZhdWx0cyAob3B0aW9ucykge1xuICBjb25zdCBtZXRob2RzID0gW1xuICAgICd1bmxpbmsnLFxuICAgICdjaG1vZCcsXG4gICAgJ3N0YXQnLFxuICAgICdsc3RhdCcsXG4gICAgJ3JtZGlyJyxcbiAgICAncmVhZGRpcidcbiAgXVxuICBtZXRob2RzLmZvckVhY2gobSA9PiB7XG4gICAgb3B0aW9uc1ttXSA9IG9wdGlvbnNbbV0gfHwgZnNbbV1cbiAgICBtID0gbSArICdTeW5jJ1xuICAgIG9wdGlvbnNbbV0gPSBvcHRpb25zW21dIHx8IGZzW21dXG4gIH0pXG5cbiAgb3B0aW9ucy5tYXhCdXN5VHJpZXMgPSBvcHRpb25zLm1heEJ1c3lUcmllcyB8fCAzXG59XG5cbmZ1bmN0aW9uIHJpbXJhZiAocCwgb3B0aW9ucywgY2IpIHtcbiAgbGV0IGJ1c3lUcmllcyA9IDBcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIGFzc2VydChwLCAncmltcmFmOiBtaXNzaW5nIHBhdGgnKVxuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIHAsICdzdHJpbmcnLCAncmltcmFmOiBwYXRoIHNob3VsZCBiZSBhIHN0cmluZycpXG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2YgY2IsICdmdW5jdGlvbicsICdyaW1yYWY6IGNhbGxiYWNrIGZ1bmN0aW9uIHJlcXVpcmVkJylcbiAgYXNzZXJ0KG9wdGlvbnMsICdyaW1yYWY6IGludmFsaWQgb3B0aW9ucyBhcmd1bWVudCBwcm92aWRlZCcpXG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Ygb3B0aW9ucywgJ29iamVjdCcsICdyaW1yYWY6IG9wdGlvbnMgc2hvdWxkIGJlIG9iamVjdCcpXG5cbiAgZGVmYXVsdHMob3B0aW9ucylcblxuICByaW1yYWZfKHAsIG9wdGlvbnMsIGZ1bmN0aW9uIENCIChlcikge1xuICAgIGlmIChlcikge1xuICAgICAgaWYgKChlci5jb2RlID09PSAnRUJVU1knIHx8IGVyLmNvZGUgPT09ICdFTk9URU1QVFknIHx8IGVyLmNvZGUgPT09ICdFUEVSTScpICYmXG4gICAgICAgICAgYnVzeVRyaWVzIDwgb3B0aW9ucy5tYXhCdXN5VHJpZXMpIHtcbiAgICAgICAgYnVzeVRyaWVzKytcbiAgICAgICAgY29uc3QgdGltZSA9IGJ1c3lUcmllcyAqIDEwMFxuICAgICAgICAvLyB0cnkgYWdhaW4sIHdpdGggdGhlIHNhbWUgZXhhY3QgY2FsbGJhY2sgYXMgdGhpcyBvbmUuXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHJpbXJhZl8ocCwgb3B0aW9ucywgQ0IpLCB0aW1lKVxuICAgICAgfVxuXG4gICAgICAvLyBhbHJlYWR5IGdvbmVcbiAgICAgIGlmIChlci5jb2RlID09PSAnRU5PRU5UJykgZXIgPSBudWxsXG4gICAgfVxuXG4gICAgY2IoZXIpXG4gIH0pXG59XG5cbi8vIFR3byBwb3NzaWJsZSBzdHJhdGVnaWVzLlxuLy8gMS4gQXNzdW1lIGl0J3MgYSBmaWxlLiAgdW5saW5rIGl0LCB0aGVuIGRvIHRoZSBkaXIgc3R1ZmYgb24gRVBFUk0gb3IgRUlTRElSXG4vLyAyLiBBc3N1bWUgaXQncyBhIGRpcmVjdG9yeS4gIHJlYWRkaXIsIHRoZW4gZG8gdGhlIGZpbGUgc3R1ZmYgb24gRU5PVERJUlxuLy9cbi8vIEJvdGggcmVzdWx0IGluIGFuIGV4dHJhIHN5c2NhbGwgd2hlbiB5b3UgZ3Vlc3Mgd3JvbmcuICBIb3dldmVyLCB0aGVyZVxuLy8gYXJlIGxpa2VseSBmYXIgbW9yZSBub3JtYWwgZmlsZXMgaW4gdGhlIHdvcmxkIHRoYW4gZGlyZWN0b3JpZXMuICBUaGlzXG4vLyBpcyBiYXNlZCBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IGEgdGhlIGF2ZXJhZ2UgbnVtYmVyIG9mIGZpbGVzIHBlclxuLy8gZGlyZWN0b3J5IGlzID49IDEuXG4vL1xuLy8gSWYgYW55b25lIGV2ZXIgY29tcGxhaW5zIGFib3V0IHRoaXMsIHRoZW4gSSBndWVzcyB0aGUgc3RyYXRlZ3kgY291bGRcbi8vIGJlIG1hZGUgY29uZmlndXJhYmxlIHNvbWVob3cuICBCdXQgdW50aWwgdGhlbiwgWUFHTkkuXG5mdW5jdGlvbiByaW1yYWZfIChwLCBvcHRpb25zLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgLy8gc3Vub3MgbGV0cyB0aGUgcm9vdCB1c2VyIHVubGluayBkaXJlY3Rvcmllcywgd2hpY2ggaXMuLi4gd2VpcmQuXG4gIC8vIHNvIHdlIGhhdmUgdG8gbHN0YXQgaGVyZSBhbmQgbWFrZSBzdXJlIGl0J3Mgbm90IGEgZGlyLlxuICBvcHRpb25zLmxzdGF0KHAsIChlciwgc3QpID0+IHtcbiAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVybiBjYihudWxsKVxuICAgIH1cblxuICAgIC8vIFdpbmRvd3MgY2FuIEVQRVJNIG9uIHN0YXQuICBMaWZlIGlzIHN1ZmZlcmluZy5cbiAgICBpZiAoZXIgJiYgZXIuY29kZSA9PT0gJ0VQRVJNJyAmJiBpc1dpbmRvd3MpIHtcbiAgICAgIHJldHVybiBmaXhXaW5FUEVSTShwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgfVxuXG4gICAgaWYgKHN0ICYmIHN0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHJldHVybiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgfVxuXG4gICAgb3B0aW9ucy51bmxpbmsocCwgZXIgPT4ge1xuICAgICAgaWYgKGVyKSB7XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgIHJldHVybiBjYihudWxsKVxuICAgICAgICB9XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRVBFUk0nKSB7XG4gICAgICAgICAgcmV0dXJuIChpc1dpbmRvd3MpXG4gICAgICAgICAgICA/IGZpeFdpbkVQRVJNKHAsIG9wdGlvbnMsIGVyLCBjYilcbiAgICAgICAgICAgIDogcm1kaXIocCwgb3B0aW9ucywgZXIsIGNiKVxuICAgICAgICB9XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRUlTRElSJykge1xuICAgICAgICAgIHJldHVybiBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjYihlcilcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBmaXhXaW5FUEVSTSAocCwgb3B0aW9ucywgZXIsIGNiKSB7XG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgYXNzZXJ0KHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcblxuICBvcHRpb25zLmNobW9kKHAsIDBvNjY2LCBlcjIgPT4ge1xuICAgIGlmIChlcjIpIHtcbiAgICAgIGNiKGVyMi5jb2RlID09PSAnRU5PRU5UJyA/IG51bGwgOiBlcilcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5zdGF0KHAsIChlcjMsIHN0YXRzKSA9PiB7XG4gICAgICAgIGlmIChlcjMpIHtcbiAgICAgICAgICBjYihlcjMuY29kZSA9PT0gJ0VOT0VOVCcgPyBudWxsIDogZXIpXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIHJtZGlyKHAsIG9wdGlvbnMsIGVyLCBjYilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcHRpb25zLnVubGluayhwLCBjYilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIGZpeFdpbkVQRVJNU3luYyAocCwgb3B0aW9ucywgZXIpIHtcbiAgbGV0IHN0YXRzXG5cbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuXG4gIHRyeSB7XG4gICAgb3B0aW9ucy5jaG1vZFN5bmMocCwgMG82NjYpXG4gIH0gY2F0Y2ggKGVyMikge1xuICAgIGlmIChlcjIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlclxuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgc3RhdHMgPSBvcHRpb25zLnN0YXRTeW5jKHApXG4gIH0gY2F0Y2ggKGVyMykge1xuICAgIGlmIChlcjMuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlclxuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgcm1kaXJTeW5jKHAsIG9wdGlvbnMsIGVyKVxuICB9IGVsc2Uge1xuICAgIG9wdGlvbnMudW5saW5rU3luYyhwKVxuICB9XG59XG5cbmZ1bmN0aW9uIHJtZGlyIChwLCBvcHRpb25zLCBvcmlnaW5hbEVyLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgLy8gdHJ5IHRvIHJtZGlyIGZpcnN0LCBhbmQgb25seSByZWFkZGlyIG9uIEVOT1RFTVBUWSBvciBFRVhJU1QgKFN1bk9TKVxuICAvLyBpZiB3ZSBndWVzc2VkIHdyb25nLCBhbmQgaXQncyBub3QgYSBkaXJlY3RvcnksIHRoZW5cbiAgLy8gcmFpc2UgdGhlIG9yaWdpbmFsIGVycm9yLlxuICBvcHRpb25zLnJtZGlyKHAsIGVyID0+IHtcbiAgICBpZiAoZXIgJiYgKGVyLmNvZGUgPT09ICdFTk9URU1QVFknIHx8IGVyLmNvZGUgPT09ICdFRVhJU1QnIHx8IGVyLmNvZGUgPT09ICdFUEVSTScpKSB7XG4gICAgICBybWtpZHMocCwgb3B0aW9ucywgY2IpXG4gICAgfSBlbHNlIGlmIChlciAmJiBlci5jb2RlID09PSAnRU5PVERJUicpIHtcbiAgICAgIGNiKG9yaWdpbmFsRXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNiKGVyKVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gcm1raWRzIChwLCBvcHRpb25zLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG5cbiAgb3B0aW9ucy5yZWFkZGlyKHAsIChlciwgZmlsZXMpID0+IHtcbiAgICBpZiAoZXIpIHJldHVybiBjYihlcilcblxuICAgIGxldCBuID0gZmlsZXMubGVuZ3RoXG4gICAgbGV0IGVyclN0YXRlXG5cbiAgICBpZiAobiA9PT0gMCkgcmV0dXJuIG9wdGlvbnMucm1kaXIocCwgY2IpXG5cbiAgICBmaWxlcy5mb3JFYWNoKGYgPT4ge1xuICAgICAgcmltcmFmKHBhdGguam9pbihwLCBmKSwgb3B0aW9ucywgZXIgPT4ge1xuICAgICAgICBpZiAoZXJyU3RhdGUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXIpIHJldHVybiBjYihlcnJTdGF0ZSA9IGVyKVxuICAgICAgICBpZiAoLS1uID09PSAwKSB7XG4gICAgICAgICAgb3B0aW9ucy5ybWRpcihwLCBjYilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG4vLyB0aGlzIGxvb2tzIHNpbXBsZXIsIGFuZCBpcyBzdHJpY3RseSAqZmFzdGVyKiwgYnV0IHdpbGxcbi8vIHRpZSB1cCB0aGUgSmF2YVNjcmlwdCB0aHJlYWQgYW5kIGZhaWwgb24gZXhjZXNzaXZlbHlcbi8vIGRlZXAgZGlyZWN0b3J5IHRyZWVzLlxuZnVuY3Rpb24gcmltcmFmU3luYyAocCwgb3B0aW9ucykge1xuICBsZXQgc3RcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICBkZWZhdWx0cyhvcHRpb25zKVxuXG4gIGFzc2VydChwLCAncmltcmFmOiBtaXNzaW5nIHBhdGgnKVxuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIHAsICdzdHJpbmcnLCAncmltcmFmOiBwYXRoIHNob3VsZCBiZSBhIHN0cmluZycpXG4gIGFzc2VydChvcHRpb25zLCAncmltcmFmOiBtaXNzaW5nIG9wdGlvbnMnKVxuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIG9wdGlvbnMsICdvYmplY3QnLCAncmltcmFmOiBvcHRpb25zIHNob3VsZCBiZSBvYmplY3QnKVxuXG4gIHRyeSB7XG4gICAgc3QgPSBvcHRpb25zLmxzdGF0U3luYyhwKVxuICB9IGNhdGNoIChlcikge1xuICAgIGlmIChlci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gV2luZG93cyBjYW4gRVBFUk0gb24gc3RhdC4gIExpZmUgaXMgc3VmZmVyaW5nLlxuICAgIGlmIChlci5jb2RlID09PSAnRVBFUk0nICYmIGlzV2luZG93cykge1xuICAgICAgZml4V2luRVBFUk1TeW5jKHAsIG9wdGlvbnMsIGVyKVxuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gc3Vub3MgbGV0cyB0aGUgcm9vdCB1c2VyIHVubGluayBkaXJlY3Rvcmllcywgd2hpY2ggaXMuLi4gd2VpcmQuXG4gICAgaWYgKHN0ICYmIHN0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHJtZGlyU3luYyhwLCBvcHRpb25zLCBudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnVubGlua1N5bmMocClcbiAgICB9XG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgaWYgKGVyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYgKGVyLmNvZGUgPT09ICdFUEVSTScpIHtcbiAgICAgIHJldHVybiBpc1dpbmRvd3MgPyBmaXhXaW5FUEVSTVN5bmMocCwgb3B0aW9ucywgZXIpIDogcm1kaXJTeW5jKHAsIG9wdGlvbnMsIGVyKVxuICAgIH0gZWxzZSBpZiAoZXIuY29kZSAhPT0gJ0VJU0RJUicpIHtcbiAgICAgIHRocm93IGVyXG4gICAgfVxuICAgIHJtZGlyU3luYyhwLCBvcHRpb25zLCBlcilcbiAgfVxufVxuXG5mdW5jdGlvbiBybWRpclN5bmMgKHAsIG9wdGlvbnMsIG9yaWdpbmFsRXIpIHtcbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuXG4gIHRyeSB7XG4gICAgb3B0aW9ucy5ybWRpclN5bmMocClcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICBpZiAoZXIuY29kZSA9PT0gJ0VOT1RESVInKSB7XG4gICAgICB0aHJvdyBvcmlnaW5hbEVyXG4gICAgfSBlbHNlIGlmIChlci5jb2RlID09PSAnRU5PVEVNUFRZJyB8fCBlci5jb2RlID09PSAnRUVYSVNUJyB8fCBlci5jb2RlID09PSAnRVBFUk0nKSB7XG4gICAgICBybWtpZHNTeW5jKHAsIG9wdGlvbnMpXG4gICAgfSBlbHNlIGlmIChlci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgdGhyb3cgZXJcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcm1raWRzU3luYyAocCwgb3B0aW9ucykge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIG9wdGlvbnMucmVhZGRpclN5bmMocCkuZm9yRWFjaChmID0+IHJpbXJhZlN5bmMocGF0aC5qb2luKHAsIGYpLCBvcHRpb25zKSlcblxuICBpZiAoaXNXaW5kb3dzKSB7XG4gICAgLy8gV2Ugb25seSBlbmQgdXAgaGVyZSBvbmNlIHdlIGdvdCBFTk9URU1QVFkgYXQgbGVhc3Qgb25jZSwgYW5kXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgd2UgYXJlIGd1YXJhbnRlZWQgdG8gaGF2ZSByZW1vdmVkIGFsbCB0aGUga2lkcy5cbiAgICAvLyBTbywgd2Uga25vdyB0aGF0IGl0IHdvbid0IGJlIEVOT0VOVCBvciBFTk9URElSIG9yIGFueXRoaW5nIGVsc2UuXG4gICAgLy8gdHJ5IHJlYWxseSBoYXJkIHRvIGRlbGV0ZSBzdHVmZiBvbiB3aW5kb3dzLCBiZWNhdXNlIGl0IGhhcyBhXG4gICAgLy8gUFJPRk9VTkRMWSBhbm5veWluZyBoYWJpdCBvZiBub3QgY2xvc2luZyBoYW5kbGVzIHByb21wdGx5IHdoZW5cbiAgICAvLyBmaWxlcyBhcmUgZGVsZXRlZCwgcmVzdWx0aW5nIGluIHNwdXJpb3VzIEVOT1RFTVBUWSBlcnJvcnMuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIGRvIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG9wdGlvbnMucm1kaXJTeW5jKHAsIG9wdGlvbnMpXG4gICAgICAgIHJldHVybiByZXRcbiAgICAgIH0gY2F0Y2gge31cbiAgICB9IHdoaWxlIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lIDwgNTAwKSAvLyBnaXZlIHVwIGFmdGVyIDUwMG1zXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmV0ID0gb3B0aW9ucy5ybWRpclN5bmMocCwgb3B0aW9ucylcbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByaW1yYWZcbnJpbXJhZi5zeW5jID0gcmltcmFmU3luY1xuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbUNhbGxiYWNrXG5jb25zdCByaW1yYWYgPSByZXF1aXJlKCcuL3JpbXJhZicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZW1vdmU6IHUocmltcmFmKSxcbiAgcmVtb3ZlU3luYzogcmltcmFmLnN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5jb25zdCByZW1vdmUgPSByZXF1aXJlKCcuLi9yZW1vdmUnKVxuXG5jb25zdCBlbXB0eURpciA9IHUoZnVuY3Rpb24gZW1wdHlEaXIgKGRpciwgY2FsbGJhY2spIHtcbiAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fVxuICBmcy5yZWFkZGlyKGRpciwgKGVyciwgaXRlbXMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gbWtkaXIubWtkaXJzKGRpciwgY2FsbGJhY2spXG5cbiAgICBpdGVtcyA9IGl0ZW1zLm1hcChpdGVtID0+IHBhdGguam9pbihkaXIsIGl0ZW0pKVxuXG4gICAgZGVsZXRlSXRlbSgpXG5cbiAgICBmdW5jdGlvbiBkZWxldGVJdGVtICgpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtcy5wb3AoKVxuICAgICAgaWYgKCFpdGVtKSByZXR1cm4gY2FsbGJhY2soKVxuICAgICAgcmVtb3ZlLnJlbW92ZShpdGVtLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICBkZWxldGVJdGVtKClcbiAgICAgIH0pXG4gICAgfVxuICB9KVxufSlcblxuZnVuY3Rpb24gZW1wdHlEaXJTeW5jIChkaXIpIHtcbiAgbGV0IGl0ZW1zXG4gIHRyeSB7XG4gICAgaXRlbXMgPSBmcy5yZWFkZGlyU3luYyhkaXIpXG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBta2Rpci5ta2RpcnNTeW5jKGRpcilcbiAgfVxuXG4gIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbSA9IHBhdGguam9pbihkaXIsIGl0ZW0pXG4gICAgcmVtb3ZlLnJlbW92ZVN5bmMoaXRlbSlcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVtcHR5RGlyU3luYyxcbiAgZW1wdHlkaXJTeW5jOiBlbXB0eURpclN5bmMsXG4gIGVtcHR5RGlyLFxuICBlbXB0eWRpcjogZW1wdHlEaXJcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbGUgKGZpbGUsIGNhbGxiYWNrKSB7XG4gIGZ1bmN0aW9uIG1ha2VGaWxlICgpIHtcbiAgICBmcy53cml0ZUZpbGUoZmlsZSwgJycsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH0pXG4gIH1cblxuICBmcy5zdGF0KGZpbGUsIChlcnIsIHN0YXRzKSA9PiB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaGFuZGxlLWNhbGxiYWNrLWVyclxuICAgIGlmICghZXJyICYmIHN0YXRzLmlzRmlsZSgpKSByZXR1cm4gY2FsbGJhY2soKVxuICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlKVxuICAgIGZzLnN0YXQoZGlyLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBpZiB0aGUgZGlyZWN0b3J5IGRvZXNuJ3QgZXhpc3QsIG1ha2UgaXRcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgIHJldHVybiBta2Rpci5ta2RpcnMoZGlyLCBlcnIgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICAgIG1ha2VGaWxlKClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSBtYWtlRmlsZSgpXG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gcGFyZW50IGlzIG5vdCBhIGRpcmVjdG9yeVxuICAgICAgICAvLyBUaGlzIGlzIGp1c3QgdG8gY2F1c2UgYW4gaW50ZXJuYWwgRU5PVERJUiBlcnJvciB0byBiZSB0aHJvd25cbiAgICAgICAgZnMucmVhZGRpcihkaXIsIGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGaWxlU3luYyAoZmlsZSkge1xuICBsZXQgc3RhdHNcbiAgdHJ5IHtcbiAgICBzdGF0cyA9IGZzLnN0YXRTeW5jKGZpbGUpXG4gIH0gY2F0Y2gge31cbiAgaWYgKHN0YXRzICYmIHN0YXRzLmlzRmlsZSgpKSByZXR1cm5cblxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgdHJ5IHtcbiAgICBpZiAoIWZzLnN0YXRTeW5jKGRpcikuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgLy8gcGFyZW50IGlzIG5vdCBhIGRpcmVjdG9yeVxuICAgICAgLy8gVGhpcyBpcyBqdXN0IHRvIGNhdXNlIGFuIGludGVybmFsIEVOT1RESVIgZXJyb3IgdG8gYmUgdGhyb3duXG4gICAgICBmcy5yZWFkZGlyU3luYyhkaXIpXG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBJZiB0aGUgc3RhdCBjYWxsIGFib3ZlIGZhaWxlZCBiZWNhdXNlIHRoZSBkaXJlY3RvcnkgZG9lc24ndCBleGlzdCwgY3JlYXRlIGl0XG4gICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIG1rZGlyLm1rZGlyc1N5bmMoZGlyKVxuICAgIGVsc2UgdGhyb3cgZXJyXG4gIH1cblxuICBmcy53cml0ZUZpbGVTeW5jKGZpbGUsICcnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlRmlsZTogdShjcmVhdGVGaWxlKSxcbiAgY3JlYXRlRmlsZVN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmsgKHNyY3BhdGgsIGRzdHBhdGgsIGNhbGxiYWNrKSB7XG4gIGZ1bmN0aW9uIG1ha2VMaW5rIChzcmNwYXRoLCBkc3RwYXRoKSB7XG4gICAgZnMubGluayhzcmNwYXRoLCBkc3RwYXRoLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgIGNhbGxiYWNrKG51bGwpXG4gICAgfSlcbiAgfVxuXG4gIHBhdGhFeGlzdHMoZHN0cGF0aCwgKGVyciwgZGVzdGluYXRpb25FeGlzdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgIGlmIChkZXN0aW5hdGlvbkV4aXN0cykgcmV0dXJuIGNhbGxiYWNrKG51bGwpXG4gICAgZnMubHN0YXQoc3JjcGF0aCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoJ2xzdGF0JywgJ2Vuc3VyZUxpbmsnKVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgICAgIHBhdGhFeGlzdHMoZGlyLCAoZXJyLCBkaXJFeGlzdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgaWYgKGRpckV4aXN0cykgcmV0dXJuIG1ha2VMaW5rKHNyY3BhdGgsIGRzdHBhdGgpXG4gICAgICAgIG1rZGlyLm1rZGlycyhkaXIsIGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICBtYWtlTGluayhzcmNwYXRoLCBkc3RwYXRoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rU3luYyAoc3JjcGF0aCwgZHN0cGF0aCkge1xuICBjb25zdCBkZXN0aW5hdGlvbkV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZHN0cGF0aClcbiAgaWYgKGRlc3RpbmF0aW9uRXhpc3RzKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgdHJ5IHtcbiAgICBmcy5sc3RhdFN5bmMoc3JjcGF0aClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVMaW5rJylcbiAgICB0aHJvdyBlcnJcbiAgfVxuXG4gIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICBjb25zdCBkaXJFeGlzdHMgPSBmcy5leGlzdHNTeW5jKGRpcilcbiAgaWYgKGRpckV4aXN0cykgcmV0dXJuIGZzLmxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgpXG4gIG1rZGlyLm1rZGlyc1N5bmMoZGlyKVxuXG4gIHJldHVybiBmcy5saW5rU3luYyhzcmNwYXRoLCBkc3RwYXRoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlTGluazogdShjcmVhdGVMaW5rKSxcbiAgY3JlYXRlTGlua1N5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHR3byB0eXBlcyBvZiBwYXRocywgb25lIHJlbGF0aXZlIHRvIHN5bWxpbmssIGFuZCBvbmVcbiAqIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LiBDaGVja3MgaWYgcGF0aCBpcyBhYnNvbHV0ZSBvclxuICogcmVsYXRpdmUuIElmIHRoZSBwYXRoIGlzIHJlbGF0aXZlLCB0aGlzIGZ1bmN0aW9uIGNoZWNrcyBpZiB0aGUgcGF0aCBpc1xuICogcmVsYXRpdmUgdG8gc3ltbGluayBvciByZWxhdGl2ZSB0byBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LiBUaGlzIGlzIGFuXG4gKiBpbml0aWF0aXZlIHRvIGZpbmQgYSBzbWFydGVyIGBzcmNwYXRoYCB0byBzdXBwbHkgd2hlbiBidWlsZGluZyBzeW1saW5rcy5cbiAqIFRoaXMgYWxsb3dzIHlvdSB0byBkZXRlcm1pbmUgd2hpY2ggcGF0aCB0byB1c2Ugb3V0IG9mIG9uZSBvZiB0aHJlZSBwb3NzaWJsZVxuICogdHlwZXMgb2Ygc291cmNlIHBhdGhzLiBUaGUgZmlyc3QgaXMgYW4gYWJzb2x1dGUgcGF0aC4gVGhpcyBpcyBkZXRlY3RlZCBieVxuICogYHBhdGguaXNBYnNvbHV0ZSgpYC4gV2hlbiBhbiBhYnNvbHV0ZSBwYXRoIGlzIHByb3ZpZGVkLCBpdCBpcyBjaGVja2VkIHRvXG4gKiBzZWUgaWYgaXQgZXhpc3RzLiBJZiBpdCBkb2VzIGl0J3MgdXNlZCwgaWYgbm90IGFuIGVycm9yIGlzIHJldHVybmVkXG4gKiAoY2FsbGJhY2spLyB0aHJvd24gKHN5bmMpLiBUaGUgb3RoZXIgdHdvIG9wdGlvbnMgZm9yIGBzcmNwYXRoYCBhcmUgYVxuICogcmVsYXRpdmUgdXJsLiBCeSBkZWZhdWx0IE5vZGUncyBgZnMuc3ltbGlua2Agd29ya3MgYnkgY3JlYXRpbmcgYSBzeW1saW5rXG4gKiB1c2luZyBgZHN0cGF0aGAgYW5kIGV4cGVjdHMgdGhlIGBzcmNwYXRoYCB0byBiZSByZWxhdGl2ZSB0byB0aGUgbmV3bHlcbiAqIGNyZWF0ZWQgc3ltbGluay4gSWYgeW91IHByb3ZpZGUgYSBgc3JjcGF0aGAgdGhhdCBkb2VzIG5vdCBleGlzdCBvbiB0aGUgZmlsZVxuICogc3lzdGVtIGl0IHJlc3VsdHMgaW4gYSBicm9rZW4gc3ltbGluay4gVG8gbWluaW1pemUgdGhpcywgdGhlIGZ1bmN0aW9uXG4gKiBjaGVja3MgdG8gc2VlIGlmIHRoZSAncmVsYXRpdmUgdG8gc3ltbGluaycgc291cmNlIGZpbGUgZXhpc3RzLCBhbmQgaWYgaXRcbiAqIGRvZXMgaXQgd2lsbCB1c2UgaXQuIElmIGl0IGRvZXMgbm90LCBpdCBjaGVja3MgaWYgdGhlcmUncyBhIGZpbGUgdGhhdFxuICogZXhpc3RzIHRoYXQgaXMgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnksIGlmIGRvZXMgaXRzIHVzZWQuXG4gKiBUaGlzIHByZXNlcnZlcyB0aGUgZXhwZWN0YXRpb25zIG9mIHRoZSBvcmlnaW5hbCBmcy5zeW1saW5rIHNwZWMgYW5kIGFkZHNcbiAqIHRoZSBhYmlsaXR5IHRvIHBhc3MgaW4gYHJlbGF0aXZlIHRvIGN1cnJlbnQgd29ya2luZyBkaXJlY290cnlgIHBhdGhzLlxuICovXG5cbmZ1bmN0aW9uIHN5bWxpbmtQYXRocyAoc3JjcGF0aCwgZHN0cGF0aCwgY2FsbGJhY2spIHtcbiAgaWYgKHBhdGguaXNBYnNvbHV0ZShzcmNwYXRoKSkge1xuICAgIHJldHVybiBmcy5sc3RhdChzcmNwYXRoLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGVyci5tZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgnbHN0YXQnLCAnZW5zdXJlU3ltbGluaycpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICB9XG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwge1xuICAgICAgICB0b0N3ZDogc3JjcGF0aCxcbiAgICAgICAgdG9Ec3Q6IHNyY3BhdGhcbiAgICAgIH0pXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBkc3RkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgICBjb25zdCByZWxhdGl2ZVRvRHN0ID0gcGF0aC5qb2luKGRzdGRpciwgc3JjcGF0aClcbiAgICByZXR1cm4gcGF0aEV4aXN0cyhyZWxhdGl2ZVRvRHN0LCAoZXJyLCBleGlzdHMpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgdG9Dd2Q6IHJlbGF0aXZlVG9Ec3QsXG4gICAgICAgICAgdG9Ec3Q6IHNyY3BhdGhcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmcy5sc3RhdChzcmNwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVTeW1saW5rJylcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICB0b0N3ZDogc3JjcGF0aCxcbiAgICAgICAgICAgIHRvRHN0OiBwYXRoLnJlbGF0aXZlKGRzdGRpciwgc3JjcGF0aClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gc3ltbGlua1BhdGhzU3luYyAoc3JjcGF0aCwgZHN0cGF0aCkge1xuICBsZXQgZXhpc3RzXG4gIGlmIChwYXRoLmlzQWJzb2x1dGUoc3JjcGF0aCkpIHtcbiAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHNyY3BhdGgpXG4gICAgaWYgKCFleGlzdHMpIHRocm93IG5ldyBFcnJvcignYWJzb2x1dGUgc3JjcGF0aCBkb2VzIG5vdCBleGlzdCcpXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQ3dkOiBzcmNwYXRoLFxuICAgICAgdG9Ec3Q6IHNyY3BhdGhcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZHN0ZGlyID0gcGF0aC5kaXJuYW1lKGRzdHBhdGgpXG4gICAgY29uc3QgcmVsYXRpdmVUb0RzdCA9IHBhdGguam9pbihkc3RkaXIsIHNyY3BhdGgpXG4gICAgZXhpc3RzID0gZnMuZXhpc3RzU3luYyhyZWxhdGl2ZVRvRHN0KVxuICAgIGlmIChleGlzdHMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvQ3dkOiByZWxhdGl2ZVRvRHN0LFxuICAgICAgICB0b0RzdDogc3JjcGF0aFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHNyY3BhdGgpXG4gICAgICBpZiAoIWV4aXN0cykgdGhyb3cgbmV3IEVycm9yKCdyZWxhdGl2ZSBzcmNwYXRoIGRvZXMgbm90IGV4aXN0JylcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvQ3dkOiBzcmNwYXRoLFxuICAgICAgICB0b0RzdDogcGF0aC5yZWxhdGl2ZShkc3RkaXIsIHNyY3BhdGgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzeW1saW5rUGF0aHMsXG4gIHN5bWxpbmtQYXRoc1N5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5cbmZ1bmN0aW9uIHN5bWxpbmtUeXBlIChzcmNwYXRoLCB0eXBlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyB0eXBlIDogY2FsbGJhY2tcbiAgdHlwZSA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyBmYWxzZSA6IHR5cGVcbiAgaWYgKHR5cGUpIHJldHVybiBjYWxsYmFjayhudWxsLCB0eXBlKVxuICBmcy5sc3RhdChzcmNwYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhudWxsLCAnZmlsZScpXG4gICAgdHlwZSA9IChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG4gICAgY2FsbGJhY2sobnVsbCwgdHlwZSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gc3ltbGlua1R5cGVTeW5jIChzcmNwYXRoLCB0eXBlKSB7XG4gIGxldCBzdGF0c1xuXG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuICB0cnkge1xuICAgIHN0YXRzID0gZnMubHN0YXRTeW5jKHNyY3BhdGgpXG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiAnZmlsZSdcbiAgfVxuICByZXR1cm4gKHN0YXRzICYmIHN0YXRzLmlzRGlyZWN0b3J5KCkpID8gJ2RpcicgOiAnZmlsZSdcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN5bWxpbmtUeXBlLFxuICBzeW1saW5rVHlwZVN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBfbWtkaXJzID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IG1rZGlycyA9IF9ta2RpcnMubWtkaXJzXG5jb25zdCBta2RpcnNTeW5jID0gX21rZGlycy5ta2RpcnNTeW5jXG5cbmNvbnN0IF9zeW1saW5rUGF0aHMgPSByZXF1aXJlKCcuL3N5bWxpbmstcGF0aHMnKVxuY29uc3Qgc3ltbGlua1BhdGhzID0gX3N5bWxpbmtQYXRocy5zeW1saW5rUGF0aHNcbmNvbnN0IHN5bWxpbmtQYXRoc1N5bmMgPSBfc3ltbGlua1BhdGhzLnN5bWxpbmtQYXRoc1N5bmNcblxuY29uc3QgX3N5bWxpbmtUeXBlID0gcmVxdWlyZSgnLi9zeW1saW5rLXR5cGUnKVxuY29uc3Qgc3ltbGlua1R5cGUgPSBfc3ltbGlua1R5cGUuc3ltbGlua1R5cGVcbmNvbnN0IHN5bWxpbmtUeXBlU3luYyA9IF9zeW1saW5rVHlwZS5zeW1saW5rVHlwZVN5bmNcblxuY29uc3QgcGF0aEV4aXN0cyA9IHJlcXVpcmUoJy4uL3BhdGgtZXhpc3RzJykucGF0aEV4aXN0c1xuXG5mdW5jdGlvbiBjcmVhdGVTeW1saW5rIChzcmNwYXRoLCBkc3RwYXRoLCB0eXBlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyB0eXBlIDogY2FsbGJhY2tcbiAgdHlwZSA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyBmYWxzZSA6IHR5cGVcblxuICBwYXRoRXhpc3RzKGRzdHBhdGgsIChlcnIsIGRlc3RpbmF0aW9uRXhpc3RzKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICBpZiAoZGVzdGluYXRpb25FeGlzdHMpIHJldHVybiBjYWxsYmFjayhudWxsKVxuICAgIHN5bWxpbmtQYXRocyhzcmNwYXRoLCBkc3RwYXRoLCAoZXJyLCByZWxhdGl2ZSkgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgIHNyY3BhdGggPSByZWxhdGl2ZS50b0RzdFxuICAgICAgc3ltbGlua1R5cGUocmVsYXRpdmUudG9Dd2QsIHR5cGUsIChlcnIsIHR5cGUpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGRzdHBhdGgpXG4gICAgICAgIHBhdGhFeGlzdHMoZGlyLCAoZXJyLCBkaXJFeGlzdHMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHJldHVybiBmcy5zeW1saW5rKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUsIGNhbGxiYWNrKVxuICAgICAgICAgIG1rZGlycyhkaXIsIGVyciA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgICAgZnMuc3ltbGluayhzcmNwYXRoLCBkc3RwYXRoLCB0eXBlLCBjYWxsYmFjaylcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTeW1saW5rU3luYyAoc3JjcGF0aCwgZHN0cGF0aCwgdHlwZSkge1xuICBjb25zdCBkZXN0aW5hdGlvbkV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZHN0cGF0aClcbiAgaWYgKGRlc3RpbmF0aW9uRXhpc3RzKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgY29uc3QgcmVsYXRpdmUgPSBzeW1saW5rUGF0aHNTeW5jKHNyY3BhdGgsIGRzdHBhdGgpXG4gIHNyY3BhdGggPSByZWxhdGl2ZS50b0RzdFxuICB0eXBlID0gc3ltbGlua1R5cGVTeW5jKHJlbGF0aXZlLnRvQ3dkLCB0eXBlKVxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgY29uc3QgZXhpc3RzID0gZnMuZXhpc3RzU3luYyhkaXIpXG4gIGlmIChleGlzdHMpIHJldHVybiBmcy5zeW1saW5rU3luYyhzcmNwYXRoLCBkc3RwYXRoLCB0eXBlKVxuICBta2RpcnNTeW5jKGRpcilcbiAgcmV0dXJuIGZzLnN5bWxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVTeW1saW5rOiB1KGNyZWF0ZVN5bWxpbmspLFxuICBjcmVhdGVTeW1saW5rU3luY1xufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmaWxlID0gcmVxdWlyZSgnLi9maWxlJylcbmNvbnN0IGxpbmsgPSByZXF1aXJlKCcuL2xpbmsnKVxuY29uc3Qgc3ltbGluayA9IHJlcXVpcmUoJy4vc3ltbGluaycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBmaWxlXG4gIGNyZWF0ZUZpbGU6IGZpbGUuY3JlYXRlRmlsZSxcbiAgY3JlYXRlRmlsZVN5bmM6IGZpbGUuY3JlYXRlRmlsZVN5bmMsXG4gIGVuc3VyZUZpbGU6IGZpbGUuY3JlYXRlRmlsZSxcbiAgZW5zdXJlRmlsZVN5bmM6IGZpbGUuY3JlYXRlRmlsZVN5bmMsXG4gIC8vIGxpbmtcbiAgY3JlYXRlTGluazogbGluay5jcmVhdGVMaW5rLFxuICBjcmVhdGVMaW5rU3luYzogbGluay5jcmVhdGVMaW5rU3luYyxcbiAgZW5zdXJlTGluazogbGluay5jcmVhdGVMaW5rLFxuICBlbnN1cmVMaW5rU3luYzogbGluay5jcmVhdGVMaW5rU3luYyxcbiAgLy8gc3ltbGlua1xuICBjcmVhdGVTeW1saW5rOiBzeW1saW5rLmNyZWF0ZVN5bWxpbmssXG4gIGNyZWF0ZVN5bWxpbmtTeW5jOiBzeW1saW5rLmNyZWF0ZVN5bWxpbmtTeW5jLFxuICBlbnN1cmVTeW1saW5rOiBzeW1saW5rLmNyZWF0ZVN5bWxpbmssXG4gIGVuc3VyZVN5bWxpbmtTeW5jOiBzeW1saW5rLmNyZWF0ZVN5bWxpbmtTeW5jXG59XG4iLCAiZnVuY3Rpb24gc3RyaW5naWZ5IChvYmosIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBFT0wgPSBvcHRpb25zLkVPTCB8fCAnXFxuJ1xuXG4gIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KG9iaiwgb3B0aW9ucyA/IG9wdGlvbnMucmVwbGFjZXIgOiBudWxsLCBvcHRpb25zLnNwYWNlcylcblxuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcbi9nLCBFT0wpICsgRU9MXG59XG5cbmZ1bmN0aW9uIHN0cmlwQm9tIChjb250ZW50KSB7XG4gIC8vIHdlIGRvIHRoaXMgYmVjYXVzZSBKU09OLnBhcnNlIHdvdWxkIGNvbnZlcnQgaXQgdG8gYSB1dGY4IHN0cmluZyBpZiBlbmNvZGluZyB3YXNuJ3Qgc3BlY2lmaWVkXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoY29udGVudCkpIGNvbnRlbnQgPSBjb250ZW50LnRvU3RyaW5nKCd1dGY4JylcbiAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSgvXlxcdUZFRkYvLCAnJylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHN0cmluZ2lmeSwgc3RyaXBCb20gfVxuIiwgImxldCBfZnNcbnRyeSB7XG4gIF9mcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbn0gY2F0Y2ggKF8pIHtcbiAgX2ZzID0gcmVxdWlyZSgnZnMnKVxufVxuY29uc3QgdW5pdmVyc2FsaWZ5ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JylcbmNvbnN0IHsgc3RyaW5naWZ5LCBzdHJpcEJvbSB9ID0gcmVxdWlyZSgnLi91dGlscycpXG5cbmFzeW5jIGZ1bmN0aW9uIF9yZWFkRmlsZSAoZmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0geyBlbmNvZGluZzogb3B0aW9ucyB9XG4gIH1cblxuICBjb25zdCBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgY29uc3Qgc2hvdWxkVGhyb3cgPSAndGhyb3dzJyBpbiBvcHRpb25zID8gb3B0aW9ucy50aHJvd3MgOiB0cnVlXG5cbiAgbGV0IGRhdGEgPSBhd2FpdCB1bml2ZXJzYWxpZnkuZnJvbUNhbGxiYWNrKGZzLnJlYWRGaWxlKShmaWxlLCBvcHRpb25zKVxuXG4gIGRhdGEgPSBzdHJpcEJvbShkYXRhKVxuXG4gIGxldCBvYmpcbiAgdHJ5IHtcbiAgICBvYmogPSBKU09OLnBhcnNlKGRhdGEsIG9wdGlvbnMgPyBvcHRpb25zLnJldml2ZXIgOiBudWxsKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgIGVyci5tZXNzYWdlID0gYCR7ZmlsZX06ICR7ZXJyLm1lc3NhZ2V9YFxuICAgICAgdGhyb3cgZXJyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuXG5jb25zdCByZWFkRmlsZSA9IHVuaXZlcnNhbGlmeS5mcm9tUHJvbWlzZShfcmVhZEZpbGUpXG5cbmZ1bmN0aW9uIHJlYWRGaWxlU3luYyAoZmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0geyBlbmNvZGluZzogb3B0aW9ucyB9XG4gIH1cblxuICBjb25zdCBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgY29uc3Qgc2hvdWxkVGhyb3cgPSAndGhyb3dzJyBpbiBvcHRpb25zID8gb3B0aW9ucy50aHJvd3MgOiB0cnVlXG5cbiAgdHJ5IHtcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlLCBvcHRpb25zKVxuICAgIGNvbnRlbnQgPSBzdHJpcEJvbShjb250ZW50KVxuICAgIHJldHVybiBKU09OLnBhcnNlKGNvbnRlbnQsIG9wdGlvbnMucmV2aXZlcilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICBlcnIubWVzc2FnZSA9IGAke2ZpbGV9OiAke2Vyci5tZXNzYWdlfWBcbiAgICAgIHRocm93IGVyclxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBfd3JpdGVGaWxlIChmaWxlLCBvYmosIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgY29uc3Qgc3RyID0gc3RyaW5naWZ5KG9iaiwgb3B0aW9ucylcblxuICBhd2FpdCB1bml2ZXJzYWxpZnkuZnJvbUNhbGxiYWNrKGZzLndyaXRlRmlsZSkoZmlsZSwgc3RyLCBvcHRpb25zKVxufVxuXG5jb25zdCB3cml0ZUZpbGUgPSB1bml2ZXJzYWxpZnkuZnJvbVByb21pc2UoX3dyaXRlRmlsZSlcblxuZnVuY3Rpb24gd3JpdGVGaWxlU3luYyAoZmlsZSwgb2JqLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIGNvbnN0IHN0ciA9IHN0cmluZ2lmeShvYmosIG9wdGlvbnMpXG4gIC8vIG5vdCBzdXJlIGlmIGZzLndyaXRlRmlsZVN5bmMgcmV0dXJucyBhbnl0aGluZywgYnV0IGp1c3QgaW4gY2FzZVxuICByZXR1cm4gZnMud3JpdGVGaWxlU3luYyhmaWxlLCBzdHIsIG9wdGlvbnMpXG59XG5cbmNvbnN0IGpzb25maWxlID0ge1xuICByZWFkRmlsZSxcbiAgcmVhZEZpbGVTeW5jLFxuICB3cml0ZUZpbGUsXG4gIHdyaXRlRmlsZVN5bmNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqc29uZmlsZVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBqc29uRmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGpzb25maWxlIGV4cG9ydHNcbiAgcmVhZEpzb246IGpzb25GaWxlLnJlYWRGaWxlLFxuICByZWFkSnNvblN5bmM6IGpzb25GaWxlLnJlYWRGaWxlU3luYyxcbiAgd3JpdGVKc29uOiBqc29uRmlsZS53cml0ZUZpbGUsXG4gIHdyaXRlSnNvblN5bmM6IGpzb25GaWxlLndyaXRlRmlsZVN5bmNcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5cbmZ1bmN0aW9uIG91dHB1dEZpbGUgKGZpbGUsIGRhdGEsIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgcGF0aEV4aXN0cyhkaXIsIChlcnIsIGl0RG9lcykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgaWYgKGl0RG9lcykgcmV0dXJuIGZzLndyaXRlRmlsZShmaWxlLCBkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spXG5cbiAgICBta2Rpci5ta2RpcnMoZGlyLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICAgICAgZnMud3JpdGVGaWxlKGZpbGUsIGRhdGEsIGVuY29kaW5nLCBjYWxsYmFjaylcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBvdXRwdXRGaWxlU3luYyAoZmlsZSwgLi4uYXJncykge1xuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgaWYgKGZzLmV4aXN0c1N5bmMoZGlyKSkge1xuICAgIHJldHVybiBmcy53cml0ZUZpbGVTeW5jKGZpbGUsIC4uLmFyZ3MpXG4gIH1cbiAgbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgLi4uYXJncylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG91dHB1dEZpbGU6IHUob3V0cHV0RmlsZSksXG4gIG91dHB1dEZpbGVTeW5jXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHsgc3RyaW5naWZ5IH0gPSByZXF1aXJlKCdqc29uZmlsZS91dGlscycpXG5jb25zdCB7IG91dHB1dEZpbGUgfSA9IHJlcXVpcmUoJy4uL291dHB1dCcpXG5cbmFzeW5jIGZ1bmN0aW9uIG91dHB1dEpzb24gKGZpbGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBzdHIgPSBzdHJpbmdpZnkoZGF0YSwgb3B0aW9ucylcblxuICBhd2FpdCBvdXRwdXRGaWxlKGZpbGUsIHN0ciwgb3B0aW9ucylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdXRwdXRKc29uXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHsgc3RyaW5naWZ5IH0gPSByZXF1aXJlKCdqc29uZmlsZS91dGlscycpXG5jb25zdCB7IG91dHB1dEZpbGVTeW5jIH0gPSByZXF1aXJlKCcuLi9vdXRwdXQnKVxuXG5mdW5jdGlvbiBvdXRwdXRKc29uU3luYyAoZmlsZSwgZGF0YSwgb3B0aW9ucykge1xuICBjb25zdCBzdHIgPSBzdHJpbmdpZnkoZGF0YSwgb3B0aW9ucylcblxuICBvdXRwdXRGaWxlU3luYyhmaWxlLCBzdHIsIG9wdGlvbnMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3V0cHV0SnNvblN5bmNcbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5jb25zdCBqc29uRmlsZSA9IHJlcXVpcmUoJy4vanNvbmZpbGUnKVxuXG5qc29uRmlsZS5vdXRwdXRKc29uID0gdShyZXF1aXJlKCcuL291dHB1dC1qc29uJykpXG5qc29uRmlsZS5vdXRwdXRKc29uU3luYyA9IHJlcXVpcmUoJy4vb3V0cHV0LWpzb24tc3luYycpXG4vLyBhbGlhc2VzXG5qc29uRmlsZS5vdXRwdXRKU09OID0ganNvbkZpbGUub3V0cHV0SnNvblxuanNvbkZpbGUub3V0cHV0SlNPTlN5bmMgPSBqc29uRmlsZS5vdXRwdXRKc29uU3luY1xuanNvbkZpbGUud3JpdGVKU09OID0ganNvbkZpbGUud3JpdGVKc29uXG5qc29uRmlsZS53cml0ZUpTT05TeW5jID0ganNvbkZpbGUud3JpdGVKc29uU3luY1xuanNvbkZpbGUucmVhZEpTT04gPSBqc29uRmlsZS5yZWFkSnNvblxuanNvbkZpbGUucmVhZEpTT05TeW5jID0ganNvbkZpbGUucmVhZEpzb25TeW5jXG5cbm1vZHVsZS5leHBvcnRzID0ganNvbkZpbGVcbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBjb3B5U3luYyA9IHJlcXVpcmUoJy4uL2NvcHktc3luYycpLmNvcHlTeW5jXG5jb25zdCByZW1vdmVTeW5jID0gcmVxdWlyZSgnLi4vcmVtb3ZlJykucmVtb3ZlU3luY1xuY29uc3QgbWtkaXJwU3luYyA9IHJlcXVpcmUoJy4uL21rZGlycycpLm1rZGlycFN5bmNcbmNvbnN0IHN0YXQgPSByZXF1aXJlKCcuLi91dGlsL3N0YXQnKVxuXG5mdW5jdGlvbiBtb3ZlU3luYyAoc3JjLCBkZXN0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIGNvbnN0IG92ZXJ3cml0ZSA9IG9wdHMub3ZlcndyaXRlIHx8IG9wdHMuY2xvYmJlciB8fCBmYWxzZVxuXG4gIGNvbnN0IHsgc3JjU3RhdCB9ID0gc3RhdC5jaGVja1BhdGhzU3luYyhzcmMsIGRlc3QsICdtb3ZlJylcbiAgc3RhdC5jaGVja1BhcmVudFBhdGhzU3luYyhzcmMsIHNyY1N0YXQsIGRlc3QsICdtb3ZlJylcbiAgbWtkaXJwU3luYyhwYXRoLmRpcm5hbWUoZGVzdCkpXG4gIHJldHVybiBkb1JlbmFtZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSlcbn1cblxuZnVuY3Rpb24gZG9SZW5hbWUgKHNyYywgZGVzdCwgb3ZlcndyaXRlKSB7XG4gIGlmIChvdmVyd3JpdGUpIHtcbiAgICByZW1vdmVTeW5jKGRlc3QpXG4gICAgcmV0dXJuIHJlbmFtZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSlcbiAgfVxuICBpZiAoZnMuZXhpc3RzU3luYyhkZXN0KSkgdGhyb3cgbmV3IEVycm9yKCdkZXN0IGFscmVhZHkgZXhpc3RzLicpXG4gIHJldHVybiByZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG59XG5cbmZ1bmN0aW9uIHJlbmFtZSAoc3JjLCBkZXN0LCBvdmVyd3JpdGUpIHtcbiAgdHJ5IHtcbiAgICBmcy5yZW5hbWVTeW5jKHNyYywgZGVzdClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlICE9PSAnRVhERVYnKSB0aHJvdyBlcnJcbiAgICByZXR1cm4gbW92ZUFjcm9zc0RldmljZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlQWNyb3NzRGV2aWNlIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSkge1xuICBjb25zdCBvcHRzID0ge1xuICAgIG92ZXJ3cml0ZSxcbiAgICBlcnJvck9uRXhpc3Q6IHRydWVcbiAgfVxuICBjb3B5U3luYyhzcmMsIGRlc3QsIG9wdHMpXG4gIHJldHVybiByZW1vdmVTeW5jKHNyYylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb3ZlU3luY1xuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbW92ZVN5bmM6IHJlcXVpcmUoJy4vbW92ZS1zeW5jJylcbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBjb3B5ID0gcmVxdWlyZSgnLi4vY29weScpLmNvcHlcbmNvbnN0IHJlbW92ZSA9IHJlcXVpcmUoJy4uL3JlbW92ZScpLnJlbW92ZVxuY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnLi4vbWtkaXJzJykubWtkaXJwXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5jb25zdCBzdGF0ID0gcmVxdWlyZSgnLi4vdXRpbC9zdGF0JylcblxuZnVuY3Rpb24gbW92ZSAoc3JjLCBkZXN0LCBvcHRzLCBjYikge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IG9wdHNcbiAgICBvcHRzID0ge31cbiAgfVxuXG4gIGNvbnN0IG92ZXJ3cml0ZSA9IG9wdHMub3ZlcndyaXRlIHx8IG9wdHMuY2xvYmJlciB8fCBmYWxzZVxuXG4gIHN0YXQuY2hlY2tQYXRocyhzcmMsIGRlc3QsICdtb3ZlJywgKGVyciwgc3RhdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvbnN0IHsgc3JjU3RhdCB9ID0gc3RhdHNcbiAgICBzdGF0LmNoZWNrUGFyZW50UGF0aHMoc3JjLCBzcmNTdGF0LCBkZXN0LCAnbW92ZScsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgbWtkaXJwKHBhdGguZGlybmFtZShkZXN0KSwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICAgICAgcmV0dXJuIGRvUmVuYW1lKHNyYywgZGVzdCwgb3ZlcndyaXRlLCBjYilcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gZG9SZW5hbWUgKHNyYywgZGVzdCwgb3ZlcndyaXRlLCBjYikge1xuICBpZiAob3ZlcndyaXRlKSB7XG4gICAgcmV0dXJuIHJlbW92ZShkZXN0LCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICAgIHJldHVybiByZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUsIGNiKVxuICAgIH0pXG4gIH1cbiAgcGF0aEV4aXN0cyhkZXN0LCAoZXJyLCBkZXN0RXhpc3RzKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICBpZiAoZGVzdEV4aXN0cykgcmV0dXJuIGNiKG5ldyBFcnJvcignZGVzdCBhbHJlYWR5IGV4aXN0cy4nKSlcbiAgICByZXR1cm4gcmVuYW1lKHNyYywgZGVzdCwgb3ZlcndyaXRlLCBjYilcbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVuYW1lIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgY2IpIHtcbiAgZnMucmVuYW1lKHNyYywgZGVzdCwgZXJyID0+IHtcbiAgICBpZiAoIWVycikgcmV0dXJuIGNiKClcbiAgICBpZiAoZXJyLmNvZGUgIT09ICdFWERFVicpIHJldHVybiBjYihlcnIpXG4gICAgcmV0dXJuIG1vdmVBY3Jvc3NEZXZpY2Uoc3JjLCBkZXN0LCBvdmVyd3JpdGUsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiBtb3ZlQWNyb3NzRGV2aWNlIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgY2IpIHtcbiAgY29uc3Qgb3B0cyA9IHtcbiAgICBvdmVyd3JpdGUsXG4gICAgZXJyb3JPbkV4aXN0OiB0cnVlXG4gIH1cbiAgY29weShzcmMsIGRlc3QsIG9wdHMsIGVyciA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICByZXR1cm4gcmVtb3ZlKHNyYywgY2IpXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW92ZVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbUNhbGxiYWNrXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbW92ZTogdShyZXF1aXJlKCcuL21vdmUnKSlcbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIEV4cG9ydCBwcm9taXNlaWZpZWQgZ3JhY2VmdWwtZnM6XG4gIC4uLnJlcXVpcmUoJy4vZnMnKSxcbiAgLy8gRXhwb3J0IGV4dHJhIG1ldGhvZHM6XG4gIC4uLnJlcXVpcmUoJy4vY29weS1zeW5jJyksXG4gIC4uLnJlcXVpcmUoJy4vY29weScpLFxuICAuLi5yZXF1aXJlKCcuL2VtcHR5JyksXG4gIC4uLnJlcXVpcmUoJy4vZW5zdXJlJyksXG4gIC4uLnJlcXVpcmUoJy4vanNvbicpLFxuICAuLi5yZXF1aXJlKCcuL21rZGlycycpLFxuICAuLi5yZXF1aXJlKCcuL21vdmUtc3luYycpLFxuICAuLi5yZXF1aXJlKCcuL21vdmUnKSxcbiAgLi4ucmVxdWlyZSgnLi9vdXRwdXQnKSxcbiAgLi4ucmVxdWlyZSgnLi9wYXRoLWV4aXN0cycpLFxuICAuLi5yZXF1aXJlKCcuL3JlbW92ZScpXG59XG5cbi8vIEV4cG9ydCBmcy5wcm9taXNlcyBhcyBhIGdldHRlciBwcm9wZXJ0eSBzbyB0aGF0IHdlIGRvbid0IHRyaWdnZXJcbi8vIEV4cGVyaW1lbnRhbFdhcm5pbmcgYmVmb3JlIGZzLnByb21pc2VzIGlzIGFjdHVhbGx5IGFjY2Vzc2VkLlxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5pZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmcywgJ3Byb21pc2VzJykpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAncHJvbWlzZXMnLCB7XG4gICAgZ2V0ICgpIHsgcmV0dXJuIGZzLnByb21pc2VzIH1cbiAgfSlcbn1cbiIsICJjb25zdCBDT05GSUdfREVGQVVMVCA9ICdwcmVzdGEuY29uZmlnLmpzJ1xuY29uc3QgT1VUUFVUX1NUQVRJQ19ESVIgPSAnc3RhdGljJ1xuY29uc3QgT1VUUFVUX0RZTkFNSUNfUEFHRVNfRU5UUlkgPSAnZnVuY3Rpb25zL3ByZXN0YS5qcydcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENPTkZJR19ERUZBVUxULFxuICBPVVRQVVRfU1RBVElDX0RJUixcbiAgT1VUUFVUX0RZTkFNSUNfUEFHRVNfRU5UUllcbn1cbiIsICIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlzSHlwZXIgPSBwcm9jZXNzLmVudi5URVJNX1BST0dSQU0gPT09ICdIeXBlcic7XG5jb25zdCBpc1dpbmRvd3MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInO1xuY29uc3QgaXNMaW51eCA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICdsaW51eCc7XG5cbmNvbnN0IGNvbW1vbiA9IHtcbiAgYmFsbG90RGlzYWJsZWQ6ICdcdTI2MTInLFxuICBiYWxsb3RPZmY6ICdcdTI2MTAnLFxuICBiYWxsb3RPbjogJ1x1MjYxMScsXG4gIGJ1bGxldDogJ1x1MjAyMicsXG4gIGJ1bGxldFdoaXRlOiAnXHUyNUU2JyxcbiAgZnVsbEJsb2NrOiAnXHUyNTg4JyxcbiAgaGVhcnQ6ICdcdTI3NjQnLFxuICBpZGVudGljYWxUbzogJ1x1MjI2MScsXG4gIGxpbmU6ICdcdTI1MDAnLFxuICBtYXJrOiAnXHUyMDNCJyxcbiAgbWlkZG90OiAnXHUwMEI3JyxcbiAgbWludXM6ICdcdUZGMEQnLFxuICBtdWx0aXBsaWNhdGlvbjogJ1x1MDBENycsXG4gIG9iZWx1czogJ1x1MDBGNycsXG4gIHBlbmNpbERvd25SaWdodDogJ1x1MjcwRScsXG4gIHBlbmNpbFJpZ2h0OiAnXHUyNzBGJyxcbiAgcGVuY2lsVXBSaWdodDogJ1x1MjcxMCcsXG4gIHBlcmNlbnQ6ICclJyxcbiAgcGlsY3JvdzI6ICdcdTI3NjEnLFxuICBwaWxjcm93OiAnXHUwMEI2JyxcbiAgcGx1c01pbnVzOiAnXHUwMEIxJyxcbiAgc2VjdGlvbjogJ1x1MDBBNycsXG4gIHN0YXJzT2ZmOiAnXHUyNjA2JyxcbiAgc3RhcnNPbjogJ1x1MjYwNScsXG4gIHVwRG93bkFycm93OiAnXHUyMTk1J1xufTtcblxuY29uc3Qgd2luZG93cyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbW1vbiwge1xuICBjaGVjazogJ1x1MjIxQScsXG4gIGNyb3NzOiAnXHUwMEQ3JyxcbiAgZWxsaXBzaXNMYXJnZTogJy4uLicsXG4gIGVsbGlwc2lzOiAnLi4uJyxcbiAgaW5mbzogJ2knLFxuICBxdWVzdGlvbjogJz8nLFxuICBxdWVzdGlvblNtYWxsOiAnPycsXG4gIHBvaW50ZXI6ICc+JyxcbiAgcG9pbnRlclNtYWxsOiAnXHUwMEJCJyxcbiAgcmFkaW9PZmY6ICcoICknLFxuICByYWRpb09uOiAnKCopJyxcbiAgd2FybmluZzogJ1x1MjAzQydcbn0pO1xuXG5jb25zdCBvdGhlciA9IE9iamVjdC5hc3NpZ24oe30sIGNvbW1vbiwge1xuICBiYWxsb3RDcm9zczogJ1x1MjcxOCcsXG4gIGNoZWNrOiAnXHUyNzE0JyxcbiAgY3Jvc3M6ICdcdTI3MTYnLFxuICBlbGxpcHNpc0xhcmdlOiAnXHUyMkVGJyxcbiAgZWxsaXBzaXM6ICdcdTIwMjYnLFxuICBpbmZvOiAnXHUyMTM5JyxcbiAgcXVlc3Rpb246ICc/JyxcbiAgcXVlc3Rpb25GdWxsOiAnXHVGRjFGJyxcbiAgcXVlc3Rpb25TbWFsbDogJ1x1RkU1NicsXG4gIHBvaW50ZXI6IGlzTGludXggPyAnXHUyNUI4JyA6ICdcdTI3NkYnLFxuICBwb2ludGVyU21hbGw6IGlzTGludXggPyAnXHUyMDIzJyA6ICdcdTIwM0EnLFxuICByYWRpb09mZjogJ1x1MjVFRicsXG4gIHJhZGlvT246ICdcdTI1QzknLFxuICB3YXJuaW5nOiAnXHUyNkEwJ1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGlzV2luZG93cyAmJiAhaXNIeXBlcikgPyB3aW5kb3dzIDogb3RoZXI7XG5SZWZsZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnY29tbW9uJywgeyBlbnVtZXJhYmxlOiBmYWxzZSwgdmFsdWU6IGNvbW1vbiB9KTtcblJlZmxlY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLmV4cG9ydHMsICd3aW5kb3dzJywgeyBlbnVtZXJhYmxlOiBmYWxzZSwgdmFsdWU6IHdpbmRvd3MgfSk7XG5SZWZsZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnb3RoZXInLCB7IGVudW1lcmFibGU6IGZhbHNlLCB2YWx1ZTogb3RoZXIgfSk7XG4iLCAiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBpc09iamVjdCA9IHZhbCA9PiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsKTtcbmNvbnN0IGlkZW50aXR5ID0gdmFsID0+IHZhbDtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29udHJvbC1yZWdleCAqL1xuLy8gdGhpcyBpcyBhIG1vZGlmaWVkIHZlcnNpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL2Fuc2ktcmVnZXggKE1JVCBMaWNlbnNlKVxuY29uc3QgQU5TSV9SRUdFWCA9IC9bXFx1MDAxYlxcdTAwOWJdW1tcXF0jOz8oKV0qKD86KD86KD86W15cXFdfXSo7P1teXFxXX10qKVxcdTAwMDcpfCg/Oig/OlswLTldezEsNH0oO1swLTldezAsNH0pKik/W34wLTk9PD5jZi1ucXJ0eUEtUFJaXSkpL2c7XG5cbmNvbnN0IGNyZWF0ZSA9ICgpID0+IHtcbiAgY29uc3QgY29sb3JzID0geyBlbmFibGVkOiB0cnVlLCB2aXNpYmxlOiB0cnVlLCBzdHlsZXM6IHt9LCBrZXlzOiB7fSB9O1xuXG4gIGlmICgnRk9SQ0VfQ09MT1InIGluIHByb2Nlc3MuZW52KSB7XG4gICAgY29sb3JzLmVuYWJsZWQgPSBwcm9jZXNzLmVudi5GT1JDRV9DT0xPUiAhPT0gJzAnO1xuICB9XG5cbiAgY29uc3QgYW5zaSA9IHN0eWxlID0+IHtcbiAgICBsZXQgb3BlbiA9IHN0eWxlLm9wZW4gPSBgXFx1MDAxYlske3N0eWxlLmNvZGVzWzBdfW1gO1xuICAgIGxldCBjbG9zZSA9IHN0eWxlLmNsb3NlID0gYFxcdTAwMWJbJHtzdHlsZS5jb2Rlc1sxXX1tYDtcbiAgICBsZXQgcmVnZXggPSBzdHlsZS5yZWdleCA9IG5ldyBSZWdFeHAoYFxcXFx1MDAxYlxcXFxbJHtzdHlsZS5jb2Rlc1sxXX1tYCwgJ2cnKTtcbiAgICBzdHlsZS53cmFwID0gKGlucHV0LCBuZXdsaW5lKSA9PiB7XG4gICAgICBpZiAoaW5wdXQuaW5jbHVkZXMoY2xvc2UpKSBpbnB1dCA9IGlucHV0LnJlcGxhY2UocmVnZXgsIGNsb3NlICsgb3Blbik7XG4gICAgICBsZXQgb3V0cHV0ID0gb3BlbiArIGlucHV0ICsgY2xvc2U7XG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL2NoYWxrL3B1bGwvOTIsIHRoYW5rcyB0byB0aGVcbiAgICAgIC8vIGNoYWxrIGNvbnRyaWJ1dG9ycyBmb3IgdGhpcyBmaXguIEhvd2V2ZXIsIHdlJ3ZlIGNvbmZpcm1lZCB0aGF0XG4gICAgICAvLyB0aGlzIGlzc3VlIGlzIGFsc28gcHJlc2VudCBpbiBXaW5kb3dzIHRlcm1pbmFsc1xuICAgICAgcmV0dXJuIG5ld2xpbmUgPyBvdXRwdXQucmVwbGFjZSgvXFxyKlxcbi9nLCBgJHtjbG9zZX0kJiR7b3Blbn1gKSA6IG91dHB1dDtcbiAgICB9O1xuICAgIHJldHVybiBzdHlsZTtcbiAgfTtcblxuICBjb25zdCB3cmFwID0gKHN0eWxlLCBpbnB1dCwgbmV3bGluZSkgPT4ge1xuICAgIHJldHVybiB0eXBlb2Ygc3R5bGUgPT09ICdmdW5jdGlvbicgPyBzdHlsZShpbnB1dCkgOiBzdHlsZS53cmFwKGlucHV0LCBuZXdsaW5lKTtcbiAgfTtcblxuICBjb25zdCBzdHlsZSA9IChpbnB1dCwgc3RhY2spID0+IHtcbiAgICBpZiAoaW5wdXQgPT09ICcnIHx8IGlucHV0ID09IG51bGwpIHJldHVybiAnJztcbiAgICBpZiAoY29sb3JzLmVuYWJsZWQgPT09IGZhbHNlKSByZXR1cm4gaW5wdXQ7XG4gICAgaWYgKGNvbG9ycy52aXNpYmxlID09PSBmYWxzZSkgcmV0dXJuICcnO1xuICAgIGxldCBzdHIgPSAnJyArIGlucHV0O1xuICAgIGxldCBubCA9IHN0ci5pbmNsdWRlcygnXFxuJyk7XG4gICAgbGV0IG4gPSBzdGFjay5sZW5ndGg7XG4gICAgaWYgKG4gPiAwICYmIHN0YWNrLmluY2x1ZGVzKCd1bnN0eWxlJykpIHtcbiAgICAgIHN0YWNrID0gWy4uLm5ldyBTZXQoWyd1bnN0eWxlJywgLi4uc3RhY2tdKV0ucmV2ZXJzZSgpO1xuICAgIH1cbiAgICB3aGlsZSAobi0tID4gMCkgc3RyID0gd3JhcChjb2xvcnMuc3R5bGVzW3N0YWNrW25dXSwgc3RyLCBubCk7XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICBjb25zdCBkZWZpbmUgPSAobmFtZSwgY29kZXMsIHR5cGUpID0+IHtcbiAgICBjb2xvcnMuc3R5bGVzW25hbWVdID0gYW5zaSh7IG5hbWUsIGNvZGVzIH0pO1xuICAgIGxldCBrZXlzID0gY29sb3JzLmtleXNbdHlwZV0gfHwgKGNvbG9ycy5rZXlzW3R5cGVdID0gW10pO1xuICAgIGtleXMucHVzaChuYW1lKTtcblxuICAgIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoY29sb3JzLCBuYW1lLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgIGNvbG9ycy5hbGlhcyhuYW1lLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgICAgZ2V0KCkge1xuICAgICAgICBsZXQgY29sb3IgPSBpbnB1dCA9PiBzdHlsZShpbnB1dCwgY29sb3Iuc3RhY2spO1xuICAgICAgICBSZWZsZWN0LnNldFByb3RvdHlwZU9mKGNvbG9yLCBjb2xvcnMpO1xuICAgICAgICBjb2xvci5zdGFjayA9IHRoaXMuc3RhY2sgPyB0aGlzLnN0YWNrLmNvbmNhdChuYW1lKSA6IFtuYW1lXTtcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGRlZmluZSgncmVzZXQnLCBbMCwgMF0sICdtb2RpZmllcicpO1xuICBkZWZpbmUoJ2JvbGQnLCBbMSwgMjJdLCAnbW9kaWZpZXInKTtcbiAgZGVmaW5lKCdkaW0nLCBbMiwgMjJdLCAnbW9kaWZpZXInKTtcbiAgZGVmaW5lKCdpdGFsaWMnLCBbMywgMjNdLCAnbW9kaWZpZXInKTtcbiAgZGVmaW5lKCd1bmRlcmxpbmUnLCBbNCwgMjRdLCAnbW9kaWZpZXInKTtcbiAgZGVmaW5lKCdpbnZlcnNlJywgWzcsIDI3XSwgJ21vZGlmaWVyJyk7XG4gIGRlZmluZSgnaGlkZGVuJywgWzgsIDI4XSwgJ21vZGlmaWVyJyk7XG4gIGRlZmluZSgnc3RyaWtldGhyb3VnaCcsIFs5LCAyOV0sICdtb2RpZmllcicpO1xuXG4gIGRlZmluZSgnYmxhY2snLCBbMzAsIDM5XSwgJ2NvbG9yJyk7XG4gIGRlZmluZSgncmVkJywgWzMxLCAzOV0sICdjb2xvcicpO1xuICBkZWZpbmUoJ2dyZWVuJywgWzMyLCAzOV0sICdjb2xvcicpO1xuICBkZWZpbmUoJ3llbGxvdycsIFszMywgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCdibHVlJywgWzM0LCAzOV0sICdjb2xvcicpO1xuICBkZWZpbmUoJ21hZ2VudGEnLCBbMzUsIDM5XSwgJ2NvbG9yJyk7XG4gIGRlZmluZSgnY3lhbicsIFszNiwgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCd3aGl0ZScsIFszNywgMzldLCAnY29sb3InKTtcbiAgZGVmaW5lKCdncmF5JywgWzkwLCAzOV0sICdjb2xvcicpO1xuICBkZWZpbmUoJ2dyZXknLCBbOTAsIDM5XSwgJ2NvbG9yJyk7XG5cbiAgZGVmaW5lKCdiZ0JsYWNrJywgWzQwLCA0OV0sICdiZycpO1xuICBkZWZpbmUoJ2JnUmVkJywgWzQxLCA0OV0sICdiZycpO1xuICBkZWZpbmUoJ2JnR3JlZW4nLCBbNDIsIDQ5XSwgJ2JnJyk7XG4gIGRlZmluZSgnYmdZZWxsb3cnLCBbNDMsIDQ5XSwgJ2JnJyk7XG4gIGRlZmluZSgnYmdCbHVlJywgWzQ0LCA0OV0sICdiZycpO1xuICBkZWZpbmUoJ2JnTWFnZW50YScsIFs0NSwgNDldLCAnYmcnKTtcbiAgZGVmaW5lKCdiZ0N5YW4nLCBbNDYsIDQ5XSwgJ2JnJyk7XG4gIGRlZmluZSgnYmdXaGl0ZScsIFs0NywgNDldLCAnYmcnKTtcblxuICBkZWZpbmUoJ2JsYWNrQnJpZ2h0JywgWzkwLCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCdyZWRCcmlnaHQnLCBbOTEsIDM5XSwgJ2JyaWdodCcpO1xuICBkZWZpbmUoJ2dyZWVuQnJpZ2h0JywgWzkyLCAzOV0sICdicmlnaHQnKTtcbiAgZGVmaW5lKCd5ZWxsb3dCcmlnaHQnLCBbOTMsIDM5XSwgJ2JyaWdodCcpO1xuICBkZWZpbmUoJ2JsdWVCcmlnaHQnLCBbOTQsIDM5XSwgJ2JyaWdodCcpO1xuICBkZWZpbmUoJ21hZ2VudGFCcmlnaHQnLCBbOTUsIDM5XSwgJ2JyaWdodCcpO1xuICBkZWZpbmUoJ2N5YW5CcmlnaHQnLCBbOTYsIDM5XSwgJ2JyaWdodCcpO1xuICBkZWZpbmUoJ3doaXRlQnJpZ2h0JywgWzk3LCAzOV0sICdicmlnaHQnKTtcblxuICBkZWZpbmUoJ2JnQmxhY2tCcmlnaHQnLCBbMTAwLCA0OV0sICdiZ0JyaWdodCcpO1xuICBkZWZpbmUoJ2JnUmVkQnJpZ2h0JywgWzEwMSwgNDldLCAnYmdCcmlnaHQnKTtcbiAgZGVmaW5lKCdiZ0dyZWVuQnJpZ2h0JywgWzEwMiwgNDldLCAnYmdCcmlnaHQnKTtcbiAgZGVmaW5lKCdiZ1llbGxvd0JyaWdodCcsIFsxMDMsIDQ5XSwgJ2JnQnJpZ2h0Jyk7XG4gIGRlZmluZSgnYmdCbHVlQnJpZ2h0JywgWzEwNCwgNDldLCAnYmdCcmlnaHQnKTtcbiAgZGVmaW5lKCdiZ01hZ2VudGFCcmlnaHQnLCBbMTA1LCA0OV0sICdiZ0JyaWdodCcpO1xuICBkZWZpbmUoJ2JnQ3lhbkJyaWdodCcsIFsxMDYsIDQ5XSwgJ2JnQnJpZ2h0Jyk7XG4gIGRlZmluZSgnYmdXaGl0ZUJyaWdodCcsIFsxMDcsIDQ5XSwgJ2JnQnJpZ2h0Jyk7XG5cbiAgY29sb3JzLmFuc2lSZWdleCA9IEFOU0lfUkVHRVg7XG4gIGNvbG9ycy5oYXNDb2xvciA9IGNvbG9ycy5oYXNBbnNpID0gc3RyID0+IHtcbiAgICBjb2xvcnMuYW5zaVJlZ2V4Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnICYmIHN0ciAhPT0gJycgJiYgY29sb3JzLmFuc2lSZWdleC50ZXN0KHN0cik7XG4gIH07XG5cbiAgY29sb3JzLmFsaWFzID0gKG5hbWUsIGNvbG9yKSA9PiB7XG4gICAgbGV0IGZuID0gdHlwZW9mIGNvbG9yID09PSAnc3RyaW5nJyA/IGNvbG9yc1tjb2xvcl0gOiBjb2xvcjtcblxuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGFsaWFzIHRvIGJlIHRoZSBuYW1lIG9mIGFuIGV4aXN0aW5nIGNvbG9yIChzdHJpbmcpIG9yIGEgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAoIWZuLnN0YWNrKSB7XG4gICAgICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnbmFtZScsIHsgdmFsdWU6IG5hbWUgfSk7XG4gICAgICBjb2xvcnMuc3R5bGVzW25hbWVdID0gZm47XG4gICAgICBmbi5zdGFjayA9IFtuYW1lXTtcbiAgICB9XG5cbiAgICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNvbG9ycywgbmFtZSwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICBjb2xvcnMuYWxpYXMobmFtZSwgdmFsdWUpO1xuICAgICAgfSxcbiAgICAgIGdldCgpIHtcbiAgICAgICAgbGV0IGNvbG9yID0gaW5wdXQgPT4gc3R5bGUoaW5wdXQsIGNvbG9yLnN0YWNrKTtcbiAgICAgICAgUmVmbGVjdC5zZXRQcm90b3R5cGVPZihjb2xvciwgY29sb3JzKTtcbiAgICAgICAgY29sb3Iuc3RhY2sgPSB0aGlzLnN0YWNrID8gdGhpcy5zdGFjay5jb25jYXQoZm4uc3RhY2spIDogZm4uc3RhY2s7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb2xvcnMudGhlbWUgPSBjdXN0b20gPT4ge1xuICAgIGlmICghaXNPYmplY3QoY3VzdG9tKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgdGhlbWUgdG8gYmUgYW4gb2JqZWN0Jyk7XG4gICAgZm9yIChsZXQgbmFtZSBvZiBPYmplY3Qua2V5cyhjdXN0b20pKSB7XG4gICAgICBjb2xvcnMuYWxpYXMobmFtZSwgY3VzdG9tW25hbWVdKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbG9ycztcbiAgfTtcblxuICBjb2xvcnMuYWxpYXMoJ3Vuc3R5bGUnLCBzdHIgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBzdHIgIT09ICcnKSB7XG4gICAgICBjb2xvcnMuYW5zaVJlZ2V4Lmxhc3RJbmRleCA9IDA7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoY29sb3JzLmFuc2lSZWdleCwgJycpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIGNvbG9ycy5hbGlhcygnbm9vcCcsIHN0ciA9PiBzdHIpO1xuICBjb2xvcnMubm9uZSA9IGNvbG9ycy5jbGVhciA9IGNvbG9ycy5ub29wO1xuXG4gIGNvbG9ycy5zdHJpcENvbG9yID0gY29sb3JzLnVuc3R5bGU7XG4gIGNvbG9ycy5zeW1ib2xzID0gcmVxdWlyZSgnLi9zeW1ib2xzJyk7XG4gIGNvbG9ycy5kZWZpbmUgPSBkZWZpbmU7XG4gIHJldHVybiBjb2xvcnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZSgpO1xubW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlO1xuIiwgIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigtPyg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwgIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwKGVudikge1xuXHRjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnO1xuXHRjcmVhdGVEZWJ1Zy5kZWZhdWx0ID0gY3JlYXRlRGVidWc7XG5cdGNyZWF0ZURlYnVnLmNvZXJjZSA9IGNvZXJjZTtcblx0Y3JlYXRlRGVidWcuZGlzYWJsZSA9IGRpc2FibGU7XG5cdGNyZWF0ZURlYnVnLmVuYWJsZSA9IGVuYWJsZTtcblx0Y3JlYXRlRGVidWcuZW5hYmxlZCA9IGVuYWJsZWQ7XG5cdGNyZWF0ZURlYnVnLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuXHRPYmplY3Qua2V5cyhlbnYpLmZvckVhY2goa2V5ID0+IHtcblx0XHRjcmVhdGVEZWJ1Z1trZXldID0gZW52W2tleV07XG5cdH0pO1xuXG5cdC8qKlxuXHQqIEFjdGl2ZSBgZGVidWdgIGluc3RhbmNlcy5cblx0Ki9cblx0Y3JlYXRlRGVidWcuaW5zdGFuY2VzID0gW107XG5cblx0LyoqXG5cdCogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG5cdCovXG5cblx0Y3JlYXRlRGVidWcubmFtZXMgPSBbXTtcblx0Y3JlYXRlRGVidWcuc2tpcHMgPSBbXTtcblxuXHQvKipcblx0KiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG5cdCpcblx0KiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG5cdCovXG5cdGNyZWF0ZURlYnVnLmZvcm1hdHRlcnMgPSB7fTtcblxuXHQvKipcblx0KiBTZWxlY3RzIGEgY29sb3IgZm9yIGEgZGVidWcgbmFtZXNwYWNlXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSBUaGUgbmFtZXNwYWNlIHN0cmluZyBmb3IgdGhlIGZvciB0aGUgZGVidWcgaW5zdGFuY2UgdG8gYmUgY29sb3JlZFxuXHQqIEByZXR1cm4ge051bWJlcnxTdHJpbmd9IEFuIEFOU0kgY29sb3IgY29kZSBmb3IgdGhlIGdpdmVuIG5hbWVzcGFjZVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcblx0XHRsZXQgaGFzaCA9IDA7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzcGFjZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuXHRcdH1cblxuXHRcdHJldHVybiBjcmVhdGVEZWJ1Zy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBjcmVhdGVEZWJ1Zy5jb2xvcnMubGVuZ3RoXTtcblx0fVxuXHRjcmVhdGVEZWJ1Zy5zZWxlY3RDb2xvciA9IHNlbGVjdENvbG9yO1xuXG5cdC8qKlxuXHQqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuXHQqIEByZXR1cm4ge0Z1bmN0aW9ufVxuXHQqIEBhcGkgcHVibGljXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXHRcdGxldCBwcmV2VGltZTtcblxuXHRcdGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3MpIHtcblx0XHRcdC8vIERpc2FibGVkP1xuXHRcdFx0aWYgKCFkZWJ1Zy5lbmFibGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VsZiA9IGRlYnVnO1xuXG5cdFx0XHQvLyBTZXQgYGRpZmZgIHRpbWVzdGFtcFxuXHRcdFx0Y29uc3QgY3VyciA9IE51bWJlcihuZXcgRGF0ZSgpKTtcblx0XHRcdGNvbnN0IG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcblx0XHRcdHNlbGYuZGlmZiA9IG1zO1xuXHRcdFx0c2VsZi5wcmV2ID0gcHJldlRpbWU7XG5cdFx0XHRzZWxmLmN1cnIgPSBjdXJyO1xuXHRcdFx0cHJldlRpbWUgPSBjdXJyO1xuXG5cdFx0XHRhcmdzWzBdID0gY3JlYXRlRGVidWcuY29lcmNlKGFyZ3NbMF0pO1xuXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdC8vIEFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVPXG5cdFx0XHRcdGFyZ3MudW5zaGlmdCgnJU8nKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcblx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgKG1hdGNoLCBmb3JtYXQpID0+IHtcblx0XHRcdFx0Ly8gSWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuXHRcdFx0XHRpZiAobWF0Y2ggPT09ICclJScpIHtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHRcdH1cblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0Y29uc3QgZm9ybWF0dGVyID0gY3JlYXRlRGVidWcuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXHRcdFx0XHRpZiAodHlwZW9mIGZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IGFyZ3NbaW5kZXhdO1xuXHRcdFx0XHRcdG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuXHRcdFx0XHRcdC8vIE5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcblx0XHRcdFx0XHRhcmdzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdFx0aW5kZXgtLTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblx0XHRcdGNyZWF0ZURlYnVnLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuXHRcdFx0Y29uc3QgbG9nRm4gPSBzZWxmLmxvZyB8fCBjcmVhdGVEZWJ1Zy5sb2c7XG5cdFx0XHRsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcblx0XHR9XG5cblx0XHRkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cdFx0ZGVidWcuZW5hYmxlZCA9IGNyZWF0ZURlYnVnLmVuYWJsZWQobmFtZXNwYWNlKTtcblx0XHRkZWJ1Zy51c2VDb2xvcnMgPSBjcmVhdGVEZWJ1Zy51c2VDb2xvcnMoKTtcblx0XHRkZWJ1Zy5jb2xvciA9IHNlbGVjdENvbG9yKG5hbWVzcGFjZSk7XG5cdFx0ZGVidWcuZGVzdHJveSA9IGRlc3Ryb3k7XG5cdFx0ZGVidWcuZXh0ZW5kID0gZXh0ZW5kO1xuXHRcdC8vIERlYnVnLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuXHRcdC8vIGRlYnVnLnJhd0xvZyA9IHJhd0xvZztcblxuXHRcdC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG5cdFx0aWYgKHR5cGVvZiBjcmVhdGVEZWJ1Zy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjcmVhdGVEZWJ1Zy5pbml0KGRlYnVnKTtcblx0XHR9XG5cblx0XHRjcmVhdGVEZWJ1Zy5pbnN0YW5jZXMucHVzaChkZWJ1Zyk7XG5cblx0XHRyZXR1cm4gZGVidWc7XG5cdH1cblxuXHRmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdGNvbnN0IGluZGV4ID0gY3JlYXRlRGVidWcuaW5zdGFuY2VzLmluZGV4T2YodGhpcyk7XG5cdFx0aWYgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0Y3JlYXRlRGVidWcuaW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKG5hbWVzcGFjZSwgZGVsaW1pdGVyKSB7XG5cdFx0Y29uc3QgbmV3RGVidWcgPSBjcmVhdGVEZWJ1Zyh0aGlzLm5hbWVzcGFjZSArICh0eXBlb2YgZGVsaW1pdGVyID09PSAndW5kZWZpbmVkJyA/ICc6JyA6IGRlbGltaXRlcikgKyBuYW1lc3BhY2UpO1xuXHRcdG5ld0RlYnVnLmxvZyA9IHRoaXMubG9nO1xuXHRcdHJldHVybiBuZXdEZWJ1Zztcblx0fVxuXG5cdC8qKlxuXHQqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcblx0KiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuXHRcdGNyZWF0ZURlYnVnLnNhdmUobmFtZXNwYWNlcyk7XG5cblx0XHRjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuXHRcdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0XHRsZXQgaTtcblx0XHRjb25zdCBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpLnNwbGl0KC9bXFxzLF0rLyk7XG5cdFx0Y29uc3QgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoIXNwbGl0W2ldKSB7XG5cdFx0XHRcdC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcblxuXHRcdFx0aWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuXHRcdFx0XHRjcmVhdGVEZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyZWF0ZURlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGNyZWF0ZURlYnVnLmluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgaW5zdGFuY2UgPSBjcmVhdGVEZWJ1Zy5pbnN0YW5jZXNbaV07XG5cdFx0XHRpbnN0YW5jZS5lbmFibGVkID0gY3JlYXRlRGVidWcuZW5hYmxlZChpbnN0YW5jZS5uYW1lc3BhY2UpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuXHQqXG5cdCogQHJldHVybiB7U3RyaW5nfSBuYW1lc3BhY2VzXG5cdCogQGFwaSBwdWJsaWNcblx0Ki9cblx0ZnVuY3Rpb24gZGlzYWJsZSgpIHtcblx0XHRjb25zdCBuYW1lc3BhY2VzID0gW1xuXHRcdFx0Li4uY3JlYXRlRGVidWcubmFtZXMubWFwKHRvTmFtZXNwYWNlKSxcblx0XHRcdC4uLmNyZWF0ZURlYnVnLnNraXBzLm1hcCh0b05hbWVzcGFjZSkubWFwKG5hbWVzcGFjZSA9PiAnLScgKyBuYW1lc3BhY2UpXG5cdFx0XS5qb2luKCcsJyk7XG5cdFx0Y3JlYXRlRGVidWcuZW5hYmxlKCcnKTtcblx0XHRyZXR1cm4gbmFtZXNwYWNlcztcblx0fVxuXG5cdC8qKlxuXHQqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG5cdCogQHJldHVybiB7Qm9vbGVhbn1cblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcblx0XHRpZiAobmFtZVtuYW1lLmxlbmd0aCAtIDFdID09PSAnKicpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGxldCBpO1xuXHRcdGxldCBsZW47XG5cblx0XHRmb3IgKGkgPSAwLCBsZW4gPSBjcmVhdGVEZWJ1Zy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGNyZWF0ZURlYnVnLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoY3JlYXRlRGVidWcubmFtZXNbaV0udGVzdChuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0KiBDb252ZXJ0IHJlZ2V4cCB0byBuYW1lc3BhY2Vcblx0KlxuXHQqIEBwYXJhbSB7UmVnRXhwfSByZWd4ZXBcblx0KiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiB0b05hbWVzcGFjZShyZWdleHApIHtcblx0XHRyZXR1cm4gcmVnZXhwLnRvU3RyaW5nKClcblx0XHRcdC5zdWJzdHJpbmcoMiwgcmVnZXhwLnRvU3RyaW5nKCkubGVuZ3RoIC0gMilcblx0XHRcdC5yZXBsYWNlKC9cXC5cXCpcXD8kLywgJyonKTtcblx0fVxuXG5cdC8qKlxuXHQqIENvZXJjZSBgdmFsYC5cblx0KlxuXHQqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuXHQqIEByZXR1cm4ge01peGVkfVxuXHQqIEBhcGkgcHJpdmF0ZVxuXHQqL1xuXHRmdW5jdGlvbiBjb2VyY2UodmFsKSB7XG5cdFx0aWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdFx0XHRyZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsO1xuXHR9XG5cblx0Y3JlYXRlRGVidWcuZW5hYmxlKGNyZWF0ZURlYnVnLmxvYWQoKSk7XG5cblx0cmV0dXJuIGNyZWF0ZURlYnVnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwO1xuIiwgIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqL1xuXG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuXHQnIzAwMDBDQycsXG5cdCcjMDAwMEZGJyxcblx0JyMwMDMzQ0MnLFxuXHQnIzAwMzNGRicsXG5cdCcjMDA2NkNDJyxcblx0JyMwMDY2RkYnLFxuXHQnIzAwOTlDQycsXG5cdCcjMDA5OUZGJyxcblx0JyMwMENDMDAnLFxuXHQnIzAwQ0MzMycsXG5cdCcjMDBDQzY2Jyxcblx0JyMwMENDOTknLFxuXHQnIzAwQ0NDQycsXG5cdCcjMDBDQ0ZGJyxcblx0JyMzMzAwQ0MnLFxuXHQnIzMzMDBGRicsXG5cdCcjMzMzM0NDJyxcblx0JyMzMzMzRkYnLFxuXHQnIzMzNjZDQycsXG5cdCcjMzM2NkZGJyxcblx0JyMzMzk5Q0MnLFxuXHQnIzMzOTlGRicsXG5cdCcjMzNDQzAwJyxcblx0JyMzM0NDMzMnLFxuXHQnIzMzQ0M2NicsXG5cdCcjMzNDQzk5Jyxcblx0JyMzM0NDQ0MnLFxuXHQnIzMzQ0NGRicsXG5cdCcjNjYwMENDJyxcblx0JyM2NjAwRkYnLFxuXHQnIzY2MzNDQycsXG5cdCcjNjYzM0ZGJyxcblx0JyM2NkNDMDAnLFxuXHQnIzY2Q0MzMycsXG5cdCcjOTkwMENDJyxcblx0JyM5OTAwRkYnLFxuXHQnIzk5MzNDQycsXG5cdCcjOTkzM0ZGJyxcblx0JyM5OUNDMDAnLFxuXHQnIzk5Q0MzMycsXG5cdCcjQ0MwMDAwJyxcblx0JyNDQzAwMzMnLFxuXHQnI0NDMDA2NicsXG5cdCcjQ0MwMDk5Jyxcblx0JyNDQzAwQ0MnLFxuXHQnI0NDMDBGRicsXG5cdCcjQ0MzMzAwJyxcblx0JyNDQzMzMzMnLFxuXHQnI0NDMzM2NicsXG5cdCcjQ0MzMzk5Jyxcblx0JyNDQzMzQ0MnLFxuXHQnI0NDMzNGRicsXG5cdCcjQ0M2NjAwJyxcblx0JyNDQzY2MzMnLFxuXHQnI0NDOTkwMCcsXG5cdCcjQ0M5OTMzJyxcblx0JyNDQ0NDMDAnLFxuXHQnI0NDQ0MzMycsXG5cdCcjRkYwMDAwJyxcblx0JyNGRjAwMzMnLFxuXHQnI0ZGMDA2NicsXG5cdCcjRkYwMDk5Jyxcblx0JyNGRjAwQ0MnLFxuXHQnI0ZGMDBGRicsXG5cdCcjRkYzMzAwJyxcblx0JyNGRjMzMzMnLFxuXHQnI0ZGMzM2NicsXG5cdCcjRkYzMzk5Jyxcblx0JyNGRjMzQ0MnLFxuXHQnI0ZGMzNGRicsXG5cdCcjRkY2NjAwJyxcblx0JyNGRjY2MzMnLFxuXHQnI0ZGOTkwMCcsXG5cdCcjRkY5OTMzJyxcblx0JyNGRkNDMDAnLFxuXHQnI0ZGQ0MzMydcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcblx0Ly8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuXHQvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuXHQvLyBleHBsaWNpdGx5XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiAod2luZG93LnByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCB3aW5kb3cucHJvY2Vzcy5fX253anMpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBJbnRlcm5ldCBFeHBsb3JlciBhbmQgRWRnZSBkbyBub3Qgc3VwcG9ydCBjb2xvcnMuXG5cdGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvKGVkZ2V8dHJpZGVudClcXC8oXFxkKykvKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIElzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG5cdC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG5cdHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlKSB8fFxuXHRcdC8vIElzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcblx0XHQodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgKHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkpKSB8fFxuXHRcdC8vIElzIGZpcmVmb3ggPj0gdjMxP1xuXHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuXHRcdCh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuXHRcdC8vIERvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcblx0XHQodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuXHRhcmdzWzBdID0gKHRoaXMudXNlQ29sb3JzID8gJyVjJyA6ICcnKSArXG5cdFx0dGhpcy5uYW1lc3BhY2UgK1xuXHRcdCh0aGlzLnVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKSArXG5cdFx0YXJnc1swXSArXG5cdFx0KHRoaXMudXNlQ29sb3JzID8gJyVjICcgOiAnICcpICtcblx0XHQnKycgKyBtb2R1bGUuZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG5cdGlmICghdGhpcy51c2VDb2xvcnMpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcblx0YXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0Jyk7XG5cblx0Ly8gVGhlIGZpbmFsIFwiJWNcIiBpcyBzb21ld2hhdCB0cmlja3ksIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb3RoZXJcblx0Ly8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuXHQvLyBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGluZGV4IHRvIGluc2VydCB0aGUgQ1NTIGludG9cblx0bGV0IGluZGV4ID0gMDtcblx0bGV0IGxhc3RDID0gMDtcblx0YXJnc1swXS5yZXBsYWNlKC8lW2EtekEtWiVdL2csIG1hdGNoID0+IHtcblx0XHRpZiAobWF0Y2ggPT09ICclJScpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aW5kZXgrKztcblx0XHRpZiAobWF0Y2ggPT09ICclYycpIHtcblx0XHRcdC8vIFdlIG9ubHkgYXJlIGludGVyZXN0ZWQgaW4gdGhlICpsYXN0KiAlY1xuXHRcdFx0Ly8gKHRoZSB1c2VyIG1heSBoYXZlIHByb3ZpZGVkIHRoZWlyIG93bilcblx0XHRcdGxhc3RDID0gaW5kZXg7XG5cdFx0fVxuXHR9KTtcblxuXHRhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG59XG5cbi8qKlxuICogSW52b2tlcyBgY29uc29sZS5sb2coKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmxvZ2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIGxvZyguLi5hcmdzKSB7XG5cdC8vIFRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG5cdC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG5cdHJldHVybiB0eXBlb2YgY29uc29sZSA9PT0gJ29iamVjdCcgJiZcblx0XHRjb25zb2xlLmxvZyAmJlxuXHRcdGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG5cdHRyeSB7XG5cdFx0aWYgKG5hbWVzcGFjZXMpIHtcblx0XHRcdGV4cG9ydHMuc3RvcmFnZS5zZXRJdGVtKCdkZWJ1ZycsIG5hbWVzcGFjZXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGxvYWQoKSB7XG5cdGxldCByO1xuXHR0cnkge1xuXHRcdHIgPSBleHBvcnRzLnN0b3JhZ2UuZ2V0SXRlbSgnZGVidWcnKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cblxuXHQvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG5cdGlmICghciAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuXHRcdHIgPSBwcm9jZXNzLmVudi5ERUJVRztcblx0fVxuXG5cdHJldHVybiByO1xufVxuXG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvY2Fsc3RvcmFnZSgpIHtcblx0dHJ5IHtcblx0XHQvLyBUVk1MS2l0IChBcHBsZSBUViBKUyBSdW50aW1lKSBkb2VzIG5vdCBoYXZlIGEgd2luZG93IG9iamVjdCwganVzdCBsb2NhbFN0b3JhZ2UgaW4gdGhlIGdsb2JhbCBjb250ZXh0XG5cdFx0Ly8gVGhlIEJyb3dzZXIgYWxzbyBoYXMgbG9jYWxTdG9yYWdlIGluIHRoZSBnbG9iYWwgY29udGV4dC5cblx0XHRyZXR1cm4gbG9jYWxTdG9yYWdlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFN3YWxsb3dcblx0XHQvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tbW9uJykoZXhwb3J0cyk7XG5cbmNvbnN0IHtmb3JtYXR0ZXJzfSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbiAodikge1xuXHR0cnkge1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh2KTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyb3IubWVzc2FnZTtcblx0fVxufTtcbiIsICIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IChmbGFnLCBhcmd2KSA9PiB7XG5cdGFyZ3YgPSBhcmd2IHx8IHByb2Nlc3MuYXJndjtcblx0Y29uc3QgcHJlZml4ID0gZmxhZy5zdGFydHNXaXRoKCctJykgPyAnJyA6IChmbGFnLmxlbmd0aCA9PT0gMSA/ICctJyA6ICctLScpO1xuXHRjb25zdCBwb3MgPSBhcmd2LmluZGV4T2YocHJlZml4ICsgZmxhZyk7XG5cdGNvbnN0IHRlcm1pbmF0b3JQb3MgPSBhcmd2LmluZGV4T2YoJy0tJyk7XG5cdHJldHVybiBwb3MgIT09IC0xICYmICh0ZXJtaW5hdG9yUG9zID09PSAtMSA/IHRydWUgOiBwb3MgPCB0ZXJtaW5hdG9yUG9zKTtcbn07XG4iLCAiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3QgaGFzRmxhZyA9IHJlcXVpcmUoJ2hhcy1mbGFnJyk7XG5cbmNvbnN0IGVudiA9IHByb2Nlc3MuZW52O1xuXG5sZXQgZm9yY2VDb2xvcjtcbmlmIChoYXNGbGFnKCduby1jb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ25vLWNvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPWZhbHNlJykpIHtcblx0Zm9yY2VDb2xvciA9IGZhbHNlO1xufSBlbHNlIGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPXRydWUnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRmb3JjZUNvbG9yID0gdHJ1ZTtcbn1cbmlmICgnRk9SQ0VfQ09MT1InIGluIGVudikge1xuXHRmb3JjZUNvbG9yID0gZW52LkZPUkNFX0NPTE9SLmxlbmd0aCA9PT0gMCB8fCBwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcblx0aWYgKGxldmVsID09PSAwKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZXZlbCxcblx0XHRoYXNCYXNpYzogdHJ1ZSxcblx0XHRoYXMyNTY6IGxldmVsID49IDIsXG5cdFx0aGFzMTZtOiBsZXZlbCA+PSAzXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29sb3Ioc3RyZWFtKSB7XG5cdGlmIChmb3JjZUNvbG9yID09PSBmYWxzZSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZnVsbCcpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZWNvbG9yJykpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0yNTYnKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKHN0cmVhbSAmJiAhc3RyZWFtLmlzVFRZICYmIGZvcmNlQ29sb3IgIT09IHRydWUpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGNvbnN0IG1pbiA9IGZvcmNlQ29sb3IgPyAxIDogMDtcblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdC8vIE5vZGUuanMgNy41LjAgaXMgdGhlIGZpcnN0IHZlcnNpb24gb2YgTm9kZS5qcyB0byBpbmNsdWRlIGEgcGF0Y2ggdG9cblx0XHQvLyBsaWJ1diB0aGF0IGVuYWJsZXMgMjU2IGNvbG9yIG91dHB1dCBvbiBXaW5kb3dzLiBBbnl0aGluZyBlYXJsaWVyIGFuZCBpdFxuXHRcdC8vIHdvbid0IHdvcmsuIEhvd2V2ZXIsIGhlcmUgd2UgdGFyZ2V0IE5vZGUuanMgOCBhdCBtaW5pbXVtIGFzIGl0IGlzIGFuIExUU1xuXHRcdC8vIHJlbGVhc2UsIGFuZCBOb2RlLmpzIDcgaXMgbm90LiBXaW5kb3dzIDEwIGJ1aWxkIDEwNTg2IGlzIHRoZSBmaXJzdCBXaW5kb3dzXG5cdFx0Ly8gcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDI1NiBjb2xvcnMuIFdpbmRvd3MgMTAgYnVpbGQgMTQ5MzEgaXMgdGhlIGZpcnN0IHJlbGVhc2Vcblx0XHQvLyB0aGF0IHN1cHBvcnRzIDE2bS9UcnVlQ29sb3IuXG5cdFx0Y29uc3Qgb3NSZWxlYXNlID0gb3MucmVsZWFzZSgpLnNwbGl0KCcuJyk7XG5cdFx0aWYgKFxuXHRcdFx0TnVtYmVyKHByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpWzBdKSA+PSA4ICYmXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzBdKSA+PSAxMCAmJlxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODZcblx0XHQpIHtcblx0XHRcdHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDSScgaW4gZW52KSB7XG5cdFx0aWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSSddLnNvbWUoc2lnbiA9PiBzaWduIGluIGVudikgfHwgZW52LkNJX05BTUUgPT09ICdjb2Rlc2hpcCcpIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRpZiAoJ1RFQU1DSVRZX1ZFUlNJT04nIGluIGVudikge1xuXHRcdHJldHVybiAvXig5XFwuKDAqWzEtOV1cXGQqKVxcLnxcXGR7Mix9XFwuKS8udGVzdChlbnYuVEVBTUNJVFlfVkVSU0lPTikgPyAxIDogMDtcblx0fVxuXG5cdGlmIChlbnYuQ09MT1JURVJNID09PSAndHJ1ZWNvbG9yJykge1xuXHRcdHJldHVybiAzO1xuXHR9XG5cblx0aWYgKCdURVJNX1BST0dSQU0nIGluIGVudikge1xuXHRcdGNvbnN0IHZlcnNpb24gPSBwYXJzZUludCgoZW52LlRFUk1fUFJPR1JBTV9WRVJTSU9OIHx8ICcnKS5zcGxpdCgnLicpWzBdLCAxMCk7XG5cblx0XHRzd2l0Y2ggKGVudi5URVJNX1BST0dSQU0pIHtcblx0XHRcdGNhc2UgJ2lUZXJtLmFwcCc6XG5cdFx0XHRcdHJldHVybiB2ZXJzaW9uID49IDMgPyAzIDogMjtcblx0XHRcdGNhc2UgJ0FwcGxlX1Rlcm1pbmFsJzpcblx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHQvLyBObyBkZWZhdWx0XG5cdFx0fVxuXHR9XG5cblx0aWYgKC8tMjU2KGNvbG9yKT8kL2kudGVzdChlbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXG5cdGlmICgvXnNjcmVlbnxeeHRlcm18XnZ0MTAwfF52dDIyMHxecnh2dHxjb2xvcnxhbnNpfGN5Z3dpbnxsaW51eC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoJ0NPTE9SVEVSTScgaW4gZW52KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoZW52LlRFUk0gPT09ICdkdW1iJykge1xuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRyZXR1cm4gbWluO1xufVxuXG5mdW5jdGlvbiBnZXRTdXBwb3J0TGV2ZWwoc3RyZWFtKSB7XG5cdGNvbnN0IGxldmVsID0gc3VwcG9ydHNDb2xvcihzdHJlYW0pO1xuXHRyZXR1cm4gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3VwcG9ydHNDb2xvcjogZ2V0U3VwcG9ydExldmVsLFxuXHRzdGRvdXQ6IGdldFN1cHBvcnRMZXZlbChwcm9jZXNzLnN0ZG91dCksXG5cdHN0ZGVycjogZ2V0U3VwcG9ydExldmVsKHByb2Nlc3Muc3RkZXJyKVxufTtcbiIsICIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxuY29uc3QgdHR5ID0gcmVxdWlyZSgndHR5Jyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICovXG5cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFs2LCAyLCAzLCA0LCA1LCAxXTtcblxudHJ5IHtcblx0Ly8gT3B0aW9uYWwgZGVwZW5kZW5jeSAoYXMgaW4sIGRvZXNuJ3QgbmVlZCB0byBiZSBpbnN0YWxsZWQsIE5PVCBsaWtlIG9wdGlvbmFsRGVwZW5kZW5jaWVzIGluIHBhY2thZ2UuanNvbilcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXHRjb25zdCBzdXBwb3J0c0NvbG9yID0gcmVxdWlyZSgnc3VwcG9ydHMtY29sb3InKTtcblxuXHRpZiAoc3VwcG9ydHNDb2xvciAmJiAoc3VwcG9ydHNDb2xvci5zdGRlcnIgfHwgc3VwcG9ydHNDb2xvcikubGV2ZWwgPj0gMikge1xuXHRcdGV4cG9ydHMuY29sb3JzID0gW1xuXHRcdFx0MjAsXG5cdFx0XHQyMSxcblx0XHRcdDI2LFxuXHRcdFx0MjcsXG5cdFx0XHQzMixcblx0XHRcdDMzLFxuXHRcdFx0MzgsXG5cdFx0XHQzOSxcblx0XHRcdDQwLFxuXHRcdFx0NDEsXG5cdFx0XHQ0Mixcblx0XHRcdDQzLFxuXHRcdFx0NDQsXG5cdFx0XHQ0NSxcblx0XHRcdDU2LFxuXHRcdFx0NTcsXG5cdFx0XHQ2Mixcblx0XHRcdDYzLFxuXHRcdFx0NjgsXG5cdFx0XHQ2OSxcblx0XHRcdDc0LFxuXHRcdFx0NzUsXG5cdFx0XHQ3Nixcblx0XHRcdDc3LFxuXHRcdFx0NzgsXG5cdFx0XHQ3OSxcblx0XHRcdDgwLFxuXHRcdFx0ODEsXG5cdFx0XHQ5Mixcblx0XHRcdDkzLFxuXHRcdFx0OTgsXG5cdFx0XHQ5OSxcblx0XHRcdDExMixcblx0XHRcdDExMyxcblx0XHRcdDEyOCxcblx0XHRcdDEyOSxcblx0XHRcdDEzNCxcblx0XHRcdDEzNSxcblx0XHRcdDE0OCxcblx0XHRcdDE0OSxcblx0XHRcdDE2MCxcblx0XHRcdDE2MSxcblx0XHRcdDE2Mixcblx0XHRcdDE2Myxcblx0XHRcdDE2NCxcblx0XHRcdDE2NSxcblx0XHRcdDE2Nixcblx0XHRcdDE2Nyxcblx0XHRcdDE2OCxcblx0XHRcdDE2OSxcblx0XHRcdDE3MCxcblx0XHRcdDE3MSxcblx0XHRcdDE3Mixcblx0XHRcdDE3Myxcblx0XHRcdDE3OCxcblx0XHRcdDE3OSxcblx0XHRcdDE4NCxcblx0XHRcdDE4NSxcblx0XHRcdDE5Nixcblx0XHRcdDE5Nyxcblx0XHRcdDE5OCxcblx0XHRcdDE5OSxcblx0XHRcdDIwMCxcblx0XHRcdDIwMSxcblx0XHRcdDIwMixcblx0XHRcdDIwMyxcblx0XHRcdDIwNCxcblx0XHRcdDIwNSxcblx0XHRcdDIwNixcblx0XHRcdDIwNyxcblx0XHRcdDIwOCxcblx0XHRcdDIwOSxcblx0XHRcdDIxNCxcblx0XHRcdDIxNSxcblx0XHRcdDIyMCxcblx0XHRcdDIyMVxuXHRcdF07XG5cdH1cbn0gY2F0Y2ggKGVycm9yKSB7XG5cdC8vIFN3YWxsb3cgLSB3ZSBvbmx5IGNhcmUgaWYgYHN1cHBvcnRzLWNvbG9yYCBpcyBhdmFpbGFibGU7IGl0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbn1cblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgZGVmYXVsdCBgaW5zcGVjdE9wdHNgIG9iamVjdCBmcm9tIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gKlxuICogICAkIERFQlVHX0NPTE9SUz1ubyBERUJVR19ERVBUSD0xMCBERUJVR19TSE9XX0hJRERFTj1lbmFibGVkIG5vZGUgc2NyaXB0LmpzXG4gKi9cblxuZXhwb3J0cy5pbnNwZWN0T3B0cyA9IE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5maWx0ZXIoa2V5ID0+IHtcblx0cmV0dXJuIC9eZGVidWdfL2kudGVzdChrZXkpO1xufSkucmVkdWNlKChvYmosIGtleSkgPT4ge1xuXHQvLyBDYW1lbC1jYXNlXG5cdGNvbnN0IHByb3AgPSBrZXlcblx0XHQuc3Vic3RyaW5nKDYpXG5cdFx0LnRvTG93ZXJDYXNlKClcblx0XHQucmVwbGFjZSgvXyhbYS16XSkvZywgKF8sIGspID0+IHtcblx0XHRcdHJldHVybiBrLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSk7XG5cblx0Ly8gQ29lcmNlIHN0cmluZyB2YWx1ZSBpbnRvIEpTIHZhbHVlXG5cdGxldCB2YWwgPSBwcm9jZXNzLmVudltrZXldO1xuXHRpZiAoL14oeWVzfG9ufHRydWV8ZW5hYmxlZCkkL2kudGVzdCh2YWwpKSB7XG5cdFx0dmFsID0gdHJ1ZTtcblx0fSBlbHNlIGlmICgvXihub3xvZmZ8ZmFsc2V8ZGlzYWJsZWQpJC9pLnRlc3QodmFsKSkge1xuXHRcdHZhbCA9IGZhbHNlO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB7XG5cdFx0dmFsID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHR2YWwgPSBOdW1iZXIodmFsKTtcblx0fVxuXG5cdG9ialtwcm9wXSA9IHZhbDtcblx0cmV0dXJuIG9iajtcbn0sIHt9KTtcblxuLyoqXG4gKiBJcyBzdGRvdXQgYSBUVFk/IENvbG9yZWQgb3V0cHV0IGlzIGVuYWJsZWQgd2hlbiBgdHJ1ZWAuXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuXHRyZXR1cm4gJ2NvbG9ycycgaW4gZXhwb3J0cy5pbnNwZWN0T3B0cyA/XG5cdFx0Qm9vbGVhbihleHBvcnRzLmluc3BlY3RPcHRzLmNvbG9ycykgOlxuXHRcdHR0eS5pc2F0dHkocHJvY2Vzcy5zdGRlcnIuZmQpO1xufVxuXG4vKipcbiAqIEFkZHMgQU5TSSBjb2xvciBlc2NhcGUgY29kZXMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuXHRjb25zdCB7bmFtZXNwYWNlOiBuYW1lLCB1c2VDb2xvcnN9ID0gdGhpcztcblxuXHRpZiAodXNlQ29sb3JzKSB7XG5cdFx0Y29uc3QgYyA9IHRoaXMuY29sb3I7XG5cdFx0Y29uc3QgY29sb3JDb2RlID0gJ1xcdTAwMUJbMycgKyAoYyA8IDggPyBjIDogJzg7NTsnICsgYyk7XG5cdFx0Y29uc3QgcHJlZml4ID0gYCAgJHtjb2xvckNvZGV9OzFtJHtuYW1lfSBcXHUwMDFCWzBtYDtcblxuXHRcdGFyZ3NbMF0gPSBwcmVmaXggKyBhcmdzWzBdLnNwbGl0KCdcXG4nKS5qb2luKCdcXG4nICsgcHJlZml4KTtcblx0XHRhcmdzLnB1c2goY29sb3JDb2RlICsgJ20rJyArIG1vZHVsZS5leHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZikgKyAnXFx1MDAxQlswbScpO1xuXHR9IGVsc2Uge1xuXHRcdGFyZ3NbMF0gPSBnZXREYXRlKCkgKyBuYW1lICsgJyAnICsgYXJnc1swXTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXREYXRlKCkge1xuXHRpZiAoZXhwb3J0cy5pbnNwZWN0T3B0cy5oaWRlRGF0ZSkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXHRyZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpICsgJyAnO1xufVxuXG4vKipcbiAqIEludm9rZXMgYHV0aWwuZm9ybWF0KClgIHdpdGggdGhlIHNwZWNpZmllZCBhcmd1bWVudHMgYW5kIHdyaXRlcyB0byBzdGRlcnIuXG4gKi9cblxuZnVuY3Rpb24gbG9nKC4uLmFyZ3MpIHtcblx0cmV0dXJuIHByb2Nlc3Muc3RkZXJyLndyaXRlKHV0aWwuZm9ybWF0KC4uLmFyZ3MpICsgJ1xcbicpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG5cdGlmIChuYW1lc3BhY2VzKSB7XG5cdFx0cHJvY2Vzcy5lbnYuREVCVUcgPSBuYW1lc3BhY2VzO1xuXHR9IGVsc2Uge1xuXHRcdC8vIElmIHlvdSBzZXQgYSBwcm9jZXNzLmVudiBmaWVsZCB0byBudWxsIG9yIHVuZGVmaW5lZCwgaXQgZ2V0cyBjYXN0IHRvIHRoZVxuXHRcdC8vIHN0cmluZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcuIEp1c3QgZGVsZXRlIGluc3RlYWQuXG5cdFx0ZGVsZXRlIHByb2Nlc3MuZW52LkRFQlVHO1xuXHR9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcblx0cmV0dXJuIHByb2Nlc3MuZW52LkRFQlVHO1xufVxuXG4vKipcbiAqIEluaXQgbG9naWMgZm9yIGBkZWJ1Z2AgaW5zdGFuY2VzLlxuICpcbiAqIENyZWF0ZSBhIG5ldyBgaW5zcGVjdE9wdHNgIG9iamVjdCBpbiBjYXNlIGB1c2VDb2xvcnNgIGlzIHNldFxuICogZGlmZmVyZW50bHkgZm9yIGEgcGFydGljdWxhciBgZGVidWdgIGluc3RhbmNlLlxuICovXG5cbmZ1bmN0aW9uIGluaXQoZGVidWcpIHtcblx0ZGVidWcuaW5zcGVjdE9wdHMgPSB7fTtcblxuXHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZXhwb3J0cy5pbnNwZWN0T3B0cyk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdGRlYnVnLmluc3BlY3RPcHRzW2tleXNbaV1dID0gZXhwb3J0cy5pbnNwZWN0T3B0c1trZXlzW2ldXTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tbW9uJykoZXhwb3J0cyk7XG5cbmNvbnN0IHtmb3JtYXR0ZXJzfSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIE1hcCAlbyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGwgb24gYSBzaW5nbGUgbGluZS5cbiAqL1xuXG5mb3JtYXR0ZXJzLm8gPSBmdW5jdGlvbiAodikge1xuXHR0aGlzLmluc3BlY3RPcHRzLmNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXHRyZXR1cm4gdXRpbC5pbnNwZWN0KHYsIHRoaXMuaW5zcGVjdE9wdHMpXG5cdFx0LnJlcGxhY2UoL1xccypcXG5cXHMqL2csICcgJyk7XG59O1xuXG4vKipcbiAqIE1hcCAlTyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGxvd2luZyBtdWx0aXBsZSBsaW5lcyBpZiBuZWVkZWQuXG4gKi9cblxuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24gKHYpIHtcblx0dGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblx0cmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKTtcbn07XG4iLCAiLyoqXG4gKiBEZXRlY3QgRWxlY3Ryb24gcmVuZGVyZXIgLyBud2pzIHByb2Nlc3MsIHdoaWNoIGlzIG5vZGUsIGJ1dCB3ZSBzaG91bGRcbiAqIHRyZWF0IGFzIGEgYnJvd3Nlci5cbiAqL1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8IHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCBwcm9jZXNzLmJyb3dzZXIgPT09IHRydWUgfHwgcHJvY2Vzcy5fX253anMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKTtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9ub2RlLmpzJyk7XG59XG4iLCAiY29uc3QgY3JlYXRlID0gcmVxdWlyZSgnZGVidWcnKVxuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZSgncHJlc3RhJylcblxubW9kdWxlLmV4cG9ydHMgPSB7IGRlYnVnIH1cbiIsICJjb25zdCBjID0gcmVxdWlyZSgnYW5zaS1jb2xvcnMnKVxuXG5jb25zdCB7IE5PREVfRU5WIH0gPSBwcm9jZXNzLmVudlxuXG5sZXQgbG9ncyA9ICcnXG5cbmZ1bmN0aW9uIGdldExvZ3MgKCkge1xuICBpZiAoIU5PREVfRU5WID09PSAndGVzdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIG1ldGhvZCB3YXMgY2FsbGVkIG91dHNpZGUgdGVzdCBtb2RlJylcbiAgfVxuICByZXR1cm4gbG9nc1xufVxuXG5mdW5jdGlvbiBsb2cgKHN0cikge1xuICBpZiAoTk9ERV9FTlYgPT09ICd0ZXN0Jykge1xuICAgIGxvZ3MgKz0gc3RyXG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coc3RyKVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdExvZyAoeyBhY3Rpb24sIG1ldGEsIGRlc2NyaXB0aW9uLCBjb2xvciA9ICdibHVlJyB9KSB7XG4gIGlmIChOT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGAgICR7Y1tjb2xvcl0oYWN0aW9uKX0gJHtjLmdyYXkobWV0YSl9YFxuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UucGFkRW5kKDQwKSArIGRlc2NyaXB0aW9uKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRMb2dzLFxuICBsb2csXG4gIGZvcm1hdExvZ1xufVxuIiwgImZ1bmN0aW9uIGNyZWF0ZUVtaXR0ZXIgKCkge1xuICBsZXQgZXZlbnRzID0ge31cblxuICBmdW5jdGlvbiBlbWl0IChldiwgLi4uYXJncykge1xuICAgIHJldHVybiBldmVudHNbZXZdID8gZXZlbnRzW2V2XS5tYXAoZm4gPT4gZm4oLi4uYXJncykpIDogW11cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uIChldiwgZm4pIHtcbiAgICBldmVudHNbZXZdID0gZXZlbnRzW2V2XSA/IGV2ZW50c1tldl0uY29uY2F0KGZuKSA6IFtmbl1cbiAgICByZXR1cm4gKCkgPT4gZXZlbnRzW2V2XS5zcGxpY2UoZXZlbnRzW2V2XS5pbmRleE9mKGZuKSwgMSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICBldmVudHMgPSB7fVxuICB9XG5cbiAgZnVuY3Rpb24gbGlzdGVuZXJzIChldikge1xuICAgIHJldHVybiBldmVudHNbZXZdIHx8IFtdXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVtaXQsXG4gICAgb24sXG4gICAgY2xlYXIsXG4gICAgbGlzdGVuZXJzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGNyZWF0ZUVtaXR0ZXIgfVxuIiwgImNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGMgPSByZXF1aXJlKCdhbnNpLWNvbG9ycycpXG5cbmNvbnN0IHsgQ09ORklHX0RFRkFVTFQsIE9VVFBVVF9EWU5BTUlDX1BBR0VTX0VOVFJZIH0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG5jb25zdCB7IGRlYnVnIH0gPSByZXF1aXJlKCcuL2RlYnVnJylcbmNvbnN0IHsgbG9nIH0gPSByZXF1aXJlKCcuL2xvZycpXG5jb25zdCB7IGNyZWF0ZUVtaXR0ZXIgfSA9IHJlcXVpcmUoJy4vY3JlYXRlRW1pdHRlcicpXG5cbmNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKClcblxuZ2xvYmFsLl9fcHJlc3RhX18gPSBnbG9iYWwuX19wcmVzdGFfXyB8fCB7XG4gIGNsaUFyZ3M6IHt9LFxuICBjb25maWdGaWxlOiB7fSxcbiAgcGlkOiBwcm9jZXNzLnBpZFxufVxuXG5mdW5jdGlvbiByZXNvbHZlUGF0aHMgKG9iaikge1xuICBpZiAob2JqLmZpbGVzKSBvYmouZmlsZXMgPSBbXS5jb25jYXQob2JqLmZpbGVzKS5tYXAocCA9PiBwYXRoLnJlc29sdmUoY3dkLCBwKSlcbiAgaWYgKG9iai5vdXRwdXQpIG9iai5vdXRwdXQgPSBwYXRoLnJlc29sdmUoY3dkLCBvYmoub3V0cHV0KVxuICBpZiAob2JqLmFzc2V0cykgb2JqLmFzc2V0cyA9IHBhdGgucmVzb2x2ZShjd2QsIG9iai5hc3NldHMpXG4gIHJldHVybiBvYmpcbn1cblxuLyoqXG4gKiBGZXRjaCBhIGNvbmZpZyBmaWxlLiBJZiBvbmUgd2FzIHNwZWNpZmllZCBieSB0aGUgdXNlciwgbGV0IHRoZW0ga25vdyBpZlxuICogYW55dGhpbmcgZ29lcyB3cm9uZy4gT3V0c2lkZSB3YXRjaCBtb2RlLCB0aGlzIHNob3VsZCBleGl0KDEpIGlmIHRoZSB1c2VyXG4gKiBwcm92aWRlZCBhIGNvbmZpZyBhbmQgdGhlcmUgd2FzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGdldENvbmZpZ0ZpbGUgKGZpbGVwYXRoLCBzaG91bGRFeGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUocGF0aC5yZXNvbHZlKGZpbGVwYXRoIHx8IENPTkZJR19ERUZBVUxUKSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGlmIHVzZXIgc3BlY2lmaWVkIGEgZmlsZSwgbXVzdCBiZSBhIHN5bnRheCBlcnJvclxuICAgIGlmICghIWZpbGVwYXRoKSB7XG4gICAgICBsb2coYCR7Yy5yZWQoJ34gZXJyb3InKX0gJHtmaWxlcGF0aH1cXG5cXG4gID4gJHtlLnN0YWNrIHx8IGV9XFxuYClcblxuICAgICAgLy8gd2UncmUgbm90IGluIHdhdGNoIG1vZGUsIGV4aXRcbiAgICAgIGlmIChzaG91bGRFeGl0KSBwcm9jZXNzLmV4aXQoMSlcbiAgICB9XG5cbiAgICByZXR1cm4ge31cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb25maWcgKHtcbiAgZW52ID0gZ2xvYmFsLl9fcHJlc3RhX18uZW52LFxuICBjb25maWdGaWxlID0gZ2xvYmFsLl9fcHJlc3RhX18uY29uZmlnRmlsZSxcbiAgY2xpQXJncyA9IGdsb2JhbC5fX3ByZXN0YV9fLmNsaUFyZ3Ncbn0pIHtcbiAgY29uZmlnRmlsZSA9IHJlc29sdmVQYXRocyh7IC4uLmNvbmZpZ0ZpbGUgfSkgLy8gY2xvbmUgcmVhZC1vbmx5IG9ialxuICBjbGlBcmdzID0gcmVzb2x2ZVBhdGhzKGNsaUFyZ3MpXG5cbiAgY29uc3QgbWVyZ2VkID0ge1xuICAgIG91dHB1dDogY2xpQXJncy5vdXRwdXQgfHwgY29uZmlnRmlsZS5vdXRwdXQgfHwgcGF0aC5yZXNvbHZlKCdidWlsZCcpLFxuICAgIGFzc2V0czogY2xpQXJncy5hc3NldHMgfHwgY29uZmlnRmlsZS5hc3NldHMgfHwgcGF0aC5yZXNvbHZlKCdwdWJsaWMnKSxcbiAgICBmaWxlczpcbiAgICAgIGNsaUFyZ3MuZmlsZXMgJiYgY2xpQXJncy5maWxlcy5sZW5ndGhcbiAgICAgICAgPyBjbGlBcmdzLmZpbGVzXG4gICAgICAgIDogY29uZmlnRmlsZS5maWxlc1xuICAgICAgICA/IFtdLmNvbmNhdChjb25maWdGaWxlLmZpbGVzKVxuICAgICAgICA6IFtdXG4gIH1cblxuICBnbG9iYWwuX19wcmVzdGFfXyA9IHtcbiAgICAuLi5nbG9iYWwuX19wcmVzdGFfXyxcbiAgICBlbnYsXG4gICAgY3dkLFxuICAgIGNvbmZpZ0ZpbGUsXG4gICAgY2xpQXJncyxcbiAgICBtZXJnZWQsXG4gICAgY29uZmlnRmlsZXBhdGg6IHBhdGgucmVzb2x2ZShjbGlBcmdzLmNvbmZpZyB8fCBDT05GSUdfREVGQVVMVCksXG4gICAgZHluYW1pY0VudHJ5RmlsZXBhdGg6IHBhdGguam9pbihtZXJnZWQub3V0cHV0LCBPVVRQVVRfRFlOQU1JQ19QQUdFU19FTlRSWSksXG4gICAgZW1pdHRlcjogY3JlYXRlRW1pdHRlcigpXG4gIH1cblxuICBkZWJ1ZygnY29uZmlnIGNyZWF0ZWQnLCBnbG9iYWwuX19wcmVzdGFfXylcblxuICByZXR1cm4gZ2xvYmFsLl9fcHJlc3RhX19cbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29uZmlnVmFsdWVzICgpIHtcbiAgZ2xvYmFsLl9fcHJlc3RhX18gPSBjcmVhdGVDb25maWcoe1xuICAgIC4uLmdsb2JhbC5fX3ByZXN0YV9fLFxuICAgIGNvbmZpZ0ZpbGU6IHt9XG4gIH0pXG5cbiAgcmV0dXJuIGdsb2JhbC5fX3ByZXN0YV9fXG59XG5cbi8qXG4gKiBFeHRyYWN0IHNlcmlhbGl6ZS1hYmxlIHByb3BzIHRvIG1lcmdlIHdpdGggdXNlciBjb25maWcgd2l0aGluIGdlbmVyYXRlZFxuICogZmlsZXNcbiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplIChjb25maWcpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHtcbiAgICBjd2Q6IGNvbmZpZy5jd2QsXG4gICAgZmlsZXM6IGNvbmZpZy5tZXJnZWQuZmlsZXMsXG4gICAgb3V0cHV0OiBjb25maWcubWVyZ2VkLm91dHB1dCxcbiAgICBhc3NldHM6IGNvbmZpZy5tZXJnZWQuYXNzZXRzXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDb25maWcgKCkge1xuICByZXR1cm4gZ2xvYmFsLl9fcHJlc3RhX19cbn1cblxuZnVuY3Rpb24gY2xlYXJDdXJyZW50Q29uZmlnICgpIHtcbiAgZ2xvYmFsLl9fcHJlc3RhX18gPSB7IGNsaUFyZ3M6IHt9LCBjb25maWdGaWxlOiB7fSB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDdXJyZW50Q29uZmlnLFxuICBjbGVhckN1cnJlbnRDb25maWcsXG4gIHJlc29sdmVQYXRocyxcbiAgZ2V0Q29uZmlnRmlsZSxcbiAgY3JlYXRlQ29uZmlnLFxuICByZW1vdmVDb25maWdWYWx1ZXMsXG4gIHNlcmlhbGl6ZVxufVxuIiwgImNvbnN0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0JylcblxuY29uc3QgeyBPVVRQVVRfU1RBVElDX0RJUiB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuY29uc3QgeyBnZXRDdXJyZW50Q29uZmlnIH0gPSByZXF1aXJlKCcuL2NvbmZpZycpXG5cbmNvbnN0IGtleXMgPSBbXVxuXG5mdW5jdGlvbiBoYXNoIChzdHIpIHtcbiAgdmFyIGggPSA1MzgxLFxuICAgIGkgPSBzdHIubGVuZ3RoXG5cbiAgd2hpbGUgKGkpIGggPSAoaCAqIDMzKSBeIHN0ci5jaGFyQ29kZUF0KC0taSlcblxuICByZXR1cm4gKGggPj4+IDApLnRvU3RyaW5nKDM2KVxufVxuXG5mdW5jdGlvbiBleHRyYWN0IChyYXcsIGV4dCwga2V5KSB7XG4gIGFzc2VydCghIXJhdywgJ05vdGhpbmcgdG8gZXh0cmFjdCcpXG4gIGFzc2VydCghIWV4dCwgJ1BsZWFzZSBzcGVjaWZ5IGFuIGV4dGVuc2lvbicpXG4gIGFzc2VydCghIWtleSwgJ1BsZWFzZSBzcGVjaWZ5IGEga2V5JylcblxuICBjb25zdCB7IGVudiwgY3dkLCBtZXJnZWQ6IGNvbmZpZyB9ID0gZ2V0Q3VycmVudENvbmZpZygpXG4gIGNvbnN0IFBST0QgPSBlbnYgPT09ICdwcm9kdWN0aW9uJ1xuXG4gIGNvbnN0IGZpbGVuYW1lID0gUFJPRCA/IGtleSArICctJyArIGhhc2gocmF3KSA6IGtleVxuICBjb25zdCBwdWJsaWNQYXRoID0gJy8nICsgZmlsZW5hbWUgKyAnLicgKyBleHRcblxuICBmcy5vdXRwdXRGaWxlU3luYyhcbiAgICBwYXRoLmpvaW4oY29uZmlnLm91dHB1dCwgT1VUUFVUX1NUQVRJQ19ESVIsIHB1YmxpY1BhdGgpLFxuICAgIHJhd1xuICApXG5cbiAgcmV0dXJuIHB1YmxpY1BhdGhcbn1cblxuZnVuY3Rpb24gY3NzIChyYXcsIGtleSkge1xuICByZXR1cm4gZXh0cmFjdChyYXcsICdjc3MnLCBrZXkpXG59XG5cbmZ1bmN0aW9uIGpzIChyYXcsIGtleSkge1xuICByZXR1cm4gZXh0cmFjdChyYXcsICdqcycsIGtleSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGV4dHJhY3QsXG4gIGNzcyxcbiAganNcbn1cbiJdLAogICJtYXBwaW5ncyI6ICJtYUFBQSwwQkFFQSxHQUFRLGFBQWUsU0FBVSxFQUFJLENBQ25DLE1BQU8sUUFBTyxlQUFlLFlBQWEsRUFBTSxDQUM5QyxHQUFJLE1BQU8sR0FBSyxFQUFLLE9BQVMsSUFBTyxXQUFZLEVBQUcsTUFBTSxLQUFNLE9BRTlELE9BQU8sSUFBSSxTQUFRLENBQUMsRUFBUyxJQUFXLENBQ3RDLEVBQUcsTUFDRCxLQUNBLEVBQUssT0FBTyxDQUFDLENBQUMsRUFBSyxJQUFRLEVBQU0sRUFBTyxHQUFPLEVBQVEsU0FJNUQsT0FBUSxDQUFFLE1BQU8sRUFBRyxRQUd6QixHQUFRLFlBQWMsU0FBVSxFQUFJLENBQ2xDLE1BQU8sUUFBTyxlQUFlLFlBQWEsRUFBTSxDQUM5QyxHQUFNLEdBQUssRUFBSyxFQUFLLE9BQVMsR0FDOUIsR0FBSSxNQUFPLElBQU8sV0FBWSxNQUFPLEdBQUcsTUFBTSxLQUFNLEdBQy9DLEVBQUcsTUFBTSxLQUFNLEVBQUssTUFBTSxFQUFHLEtBQUssS0FBSyxHQUFLLEVBQUcsS0FBTSxHQUFJLElBQzdELE9BQVEsQ0FBRSxNQUFPLEVBQUcsVUNyQnpCLHNCQUFJLEdBQVksUUFBUSxhQUVwQixHQUFVLFFBQVEsSUFDbEIsR0FBTSxLQUVOLEdBQVcsUUFBUSxJQUFJLHNCQUF3QixRQUFRLFNBRTNELFFBQVEsSUFBTSxV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
