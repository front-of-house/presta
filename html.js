var K = Object.defineProperty
var O = Object.prototype.hasOwnProperty
var m = Object.getOwnPropertySymbols,
  h = Object.prototype.propertyIsEnumerable
var T = (t, e, r) =>
    e in t
      ? K(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  u = (t, e) => {
    for (var r in e || (e = {})) O.call(e, r) && T(t, r, e[r])
    if (m) for (var r of m(e)) h.call(e, r) && T(t, r, e[r])
    return t
  }
var j = (t, e) => {
  var r = {}
  for (var n in t) O.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n])
  if (t != null && m)
    for (var n of m(t)) e.indexOf(n) < 0 && h.call(t, n) && (r[n] = t[n])
  return r
}
var E = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports)
var S = E((re, v) => {
  'use strict'
  var R = function (e) {
    return z(e) && !B(e)
  }
  function z (t) {
    return !!t && typeof t == 'object'
  }
  function B (t) {
    var e = Object.prototype.toString.call(t)
    return e === '[object RegExp]' || e === '[object Date]' || P(t)
  }
  var L = typeof Symbol == 'function' && Symbol.for,
    N = L ? Symbol.for('react.element') : 60103
  function P (t) {
    return t.$$typeof === N
  }
  function Q (t) {
    return Array.isArray(t) ? [] : {}
  }
  function A (t, e) {
    return e.clone !== !1 && e.isMergeableObject(t) ? f(Q(t), t, e) : t
  }
  function Z (t, e, r) {
    return t.concat(e).map(function (n) {
      return A(n, r)
    })
  }
  function J (t, e) {
    if (!e.customMerge) return f
    var r = e.customMerge(t)
    return typeof r == 'function' ? r : f
  }
  function x (t) {
    return Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(t).filter(function (e) {
          return t.propertyIsEnumerable(e)
        })
      : []
  }
  function I (t) {
    return Object.keys(t).concat(x(t))
  }
  function q (t, e) {
    try {
      return e in t
    } catch (r) {
      return !1
    }
  }
  function H (t, e) {
    return (
      q(t, e) &&
      !(
        Object.hasOwnProperty.call(t, e) &&
        Object.propertyIsEnumerable.call(t, e)
      )
    )
  }
  function G (t, e, r) {
    var n = {}
    return (
      r.isMergeableObject(t) &&
        I(t).forEach(function (c) {
          n[c] = A(t[c], r)
        }),
      I(e).forEach(function (c) {
        H(t, c) ||
          (q(t, c) && r.isMergeableObject(e[c])
            ? (n[c] = J(c, r)(t[c], e[c], r))
            : (n[c] = A(e[c], r)))
      }),
      n
    )
  }
  function f (t, e, r) {
    ;(r = r || {}),
      (r.arrayMerge = r.arrayMerge || Z),
      (r.isMergeableObject = r.isMergeableObject || R),
      (r.cloneUnlessOtherwiseSpecified = A)
    var n = Array.isArray(e),
      c = Array.isArray(t),
      a = n === c
    return a ? (n ? r.arrayMerge(t, e, r) : G(t, e, r)) : A(e, r)
  }
  f.all = function (e, r) {
    if (!Array.isArray(e)) throw new Error('first argument should be an array')
    return e.reduce(function (n, c) {
      return f(n, c, r)
    }, {})
  }
  var W = f
  v.exports = W
})
var $ = E((ne, U) => {
  var F = S(),
    D = {
      title: 'presta',
      description: '',
      og: {},
      twitter: {},
      meta: [
        '<meta charset="UTF-8"/>',
        { name: 'viewport', content: ['width=device-width', 'initial-scale=1'] }
      ],
      link: [],
      script: [],
      style: []
    }
  function b (t) {
    let e = {}
    for (let r of Object.keys(t)) t[r] && (e[r] = t[r])
    return e
  }
  function l (t) {
    let e = []
    e: for (let r of t) {
      for (let n of e) if (r.name && r.name === n.name) continue e
      e.push(r)
    }
    return e
  }
  function M (t, e) {
    let r = Object.keys(e)
        .filter(c => c !== 'children')
        .map(c => `${c}="${e[c]}"`)
        .join(' '),
      n = r ? ' ' + r : ''
    return t === 'script'
      ? `<script${n}>${e.children || ''}</script>`
      : t === 'style'
      ? `<style${n}>${e.children || ''}</style>`
      : `<${t}${n} />`
  }
  function s (t) {
    return e => (typeof e == 'string' ? e : M(t, e))
  }
  function w (t, e) {
    return Object.keys(e).map(r => ({
      [t === 'og' ? 'property' : 'name']: `${t}:${r}`,
      content: e[r]
    }))
  }
  function X (t = {}) {
    let d = F(D, t),
      { title: e, description: r, image: n, url: c } = d,
      a = j(d, ['title', 'description', 'image', 'url']),
      p = l(a.meta),
      g = l(a.link),
      y = l(a.script),
      i = l(a.style),
      o = b(
        u(u({ title: e, description: r, url: c }, a.og || {}), { image: n })
      ),
      C = b(
        u(u({ title: e, description: r, url: c }, a.twitter || {}), {
          image: n
        })
      ),
      Y = [
        p.concat(r ? { name: 'description', content: r } : []).map(s('meta')),
        w('og', o).map(s('meta')),
        w('twitter', C).map(s('meta')),
        g.map(s('link')),
        y.map(s('script')),
        i.map(s('style'))
      ].flat(2)
    return `<title>${e}</title>${Y.join('')}`
  }
  function k (t = {}) {
    let e = F({ script: [], style: [] }, t),
      r = l(e.script),
      n = l(e.style)
    return [r.map(s('script')), n.map(s('style'))].flat().join('')
  }
  U.exports = {
    pruneEmpty: b,
    filterUnique: l,
    objectToTag: M,
    toTag: s,
    prefixToObjects: w,
    createHeadTags: X,
    createFootTags: k
  }
})
var { createHeadTags: V, createFootTags: _ } = $()
function ee ({
  body: t = '',
  head: e = {},
  foot: r = {},
  htmlAttributes: n = {},
  bodyAttributes: c = {}
}) {
  e.link &&
    !e.link.find(i => i.rel === 'icon' || /rel="icon/.test(i + '')) &&
    (console.log('add icon'),
    e.link.push({
      rel: 'icon',
      type: 'image/png',
      href:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJSSURBVHgB7ZbdcdpAEIB3T6DE9otLwB3YFQRXEFyBYWwYv5kOAhWEvGHxEFIBcQWQCkwqiNIBDwHHKNJmTzCKjO9AAiYzmew3oxmd7va0f7e3AIIgCIIgCIIgCILwf4JZFlGzeRxMp5eEWObhKQuVFhM0AUSfn7Eiui943mf4y6w1QCv+aza7JaImK3kMm9HGdNy7uw+wB54ajW+Js1K4npforWzCP+r10/ls9kAArYzKa0oclc6cf/x4c1OGHUEi038n6YHRAK28CzA0WZ+RkhNFw6DReAdbwg4oWRznpwfKJFhEHOTwuhUdPU6DAVWr+fcKw7Lpc4T4PT1+YYAThh938PwLeK9K4LoPsUdzoBCN0SsQDZ6tSw8e6/UqLCqNGaIRheFFqNRJ/ETROX9r0kpYDcQpldUInXo2JwZKfUmPn1Uh26mPUarmdrt9sMCyLZbdmPO8plX0vLZtXisfFw6jMPa5wtVW9lsKXl+XSamhSY43bL/yvBZs4OnqqgKO8z5DCvq6WqHjfC0soxcscv5yXQboqB90uz6YDFjjQZ/r7glkRKeJ4nTZ5znS2JyYnAFEfGOWpHvIgfZQpNQ5v45hf4xtGZAYwLdtybQgdJzc7YE2gqN2pr0Gu+Nz6lzYJv9EwBJyLqsT2BLttZColqFKmeGqVzw8PFvN+zSF5A1xlPqeCBTnc6twFg56vT6fixGfiyq3BreZLkhuEvnCar/u9TqblmbqRveFbg5/TqcVvqTe4qJvStqFZZTGqL1+dPQJO52tIy8IgiAIgiD8I/wGlKzp9SA8zyUAAAAASUVORK5CYII='
    })),
    e.meta &&
      (e.meta.find(i => !!i.charset) || e.meta.push({ charset: 'UTF-8' }),
      e.meta.find(i => i.name === 'viewport') ||
        e.meta.push({
          name: 'viewport',
          content: 'width=device-width,initial-scale=1'
        }))
  let a = V(e),
    p = _(r),
    g = Object.keys(n).reduce((i, o) => (i += ` ${o}="${n[o]}"`), ''),
    y = Object.keys(c).reduce((i, o) => (i += ` ${o}="${c[o]}"`), '')
  return `<!-- built with presta https://npm.im/presta --><!DOCTYPE html><html${g}><head>${a}</head><body${y}>${t}${p}</body></html>`
}
module.exports = { html: ee }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL2RlZXBtZXJnZS9kaXN0L2Nqcy5qcyIsICJsaWIvY3JlYXRlSGVhZFRhZ3MuanMiLCAibGliL2h0bWwuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIHRhcmdldC5wcm9wZXJ0eUlzRW51bWVyYWJsZShzeW1ib2wpXG5cdFx0fSlcblx0XHQ6IFtdXG59XG5cbmZ1bmN0aW9uIGdldEtleXModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXQpLmNvbmNhdChnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpXG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5SXNPbk9iamVjdChvYmplY3QsIHByb3BlcnR5KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHByb3BlcnR5IGluIG9iamVjdFxuXHR9IGNhdGNoKF8pIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxufVxuXG4vLyBQcm90ZWN0cyBmcm9tIHByb3RvdHlwZSBwb2lzb25pbmcgYW5kIHVuZXhwZWN0ZWQgbWVyZ2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuZnVuY3Rpb24gcHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkge1xuXHRyZXR1cm4gcHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAvLyBQcm9wZXJ0aWVzIGFyZSBzYWZlIHRvIG1lcmdlIGlmIHRoZXkgZG9uJ3QgZXhpc3QgaW4gdGhlIHRhcmdldCB5ZXQsXG5cdFx0JiYgIShPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkgLy8gdW5zYWZlIGlmIHRoZXkgZXhpc3QgdXAgdGhlIHByb3RvdHlwZSBjaGFpbixcblx0XHRcdCYmIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwga2V5KSkgLy8gYW5kIGFsc28gdW5zYWZlIGlmIHRoZXkncmUgbm9uZW51bWVyYWJsZS5cbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0dmFyIGRlc3RpbmF0aW9uID0ge307XG5cdGlmIChvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHRhcmdldCkpIHtcblx0XHRnZXRLZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cblx0Z2V0S2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0aWYgKHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHRpZiAocHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBkZXN0aW5hdGlvblxufVxuXG5mdW5jdGlvbiBkZWVwbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXJyYXlNZXJnZSA9IG9wdGlvbnMuYXJyYXlNZXJnZSB8fCBkZWZhdWx0QXJyYXlNZXJnZTtcblx0b3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCA9IG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgfHwgaXNNZXJnZWFibGVPYmplY3Q7XG5cdC8vIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkIGlzIGFkZGVkIHRvIGBvcHRpb25zYCBzbyB0aGF0IGN1c3RvbSBhcnJheU1lcmdlKClcblx0Ly8gaW1wbGVtZW50YXRpb25zIGNhbiB1c2UgaXQuIFRoZSBjYWxsZXIgbWF5IG5vdCByZXBsYWNlIGl0LlxuXHRvcHRpb25zLmNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQ7XG5cblx0dmFyIHNvdXJjZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHNvdXJjZSk7XG5cdHZhciB0YXJnZXRJc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpO1xuXHR2YXIgc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCA9IHNvdXJjZUlzQXJyYXkgPT09IHRhcmdldElzQXJyYXk7XG5cblx0aWYgKCFzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoKSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIGlmIChzb3VyY2VJc0FycmF5KSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuYXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH1cbn1cblxuZGVlcG1lcmdlLmFsbCA9IGZ1bmN0aW9uIGRlZXBtZXJnZUFsbChhcnJheSwgb3B0aW9ucykge1xuXHRpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBzaG91bGQgYmUgYW4gYXJyYXknKVxuXHR9XG5cblx0cmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2LCBuZXh0KSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZShwcmV2LCBuZXh0LCBvcHRpb25zKVxuXHR9LCB7fSlcbn07XG5cbnZhciBkZWVwbWVyZ2VfMSA9IGRlZXBtZXJnZTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWVwbWVyZ2VfMTtcbiIsICJjb25zdCBtZXJnZSA9IHJlcXVpcmUoJ2RlZXBtZXJnZScpXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICB0aXRsZTogJ3ByZXN0YScsXG4gIGRlc2NyaXB0aW9uOiAnJyxcbiAgb2c6IHt9LFxuICB0d2l0dGVyOiB7fSxcbiAgbWV0YTogW1xuICAgIGA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIi8+YCxcbiAgICB7IG5hbWU6ICd2aWV3cG9ydCcsIGNvbnRlbnQ6IFsnd2lkdGg9ZGV2aWNlLXdpZHRoJywgJ2luaXRpYWwtc2NhbGU9MSddIH1cbiAgXSxcbiAgbGluazogW10sXG4gIHNjcmlwdDogW10sXG4gIHN0eWxlOiBbXVxufVxuXG5mdW5jdGlvbiBwcnVuZUVtcHR5IChvYmopIHtcbiAgbGV0IHJlcyA9IHt9XG5cbiAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKG9iaikpIHtcbiAgICBpZiAoISFvYmpba10pIHJlc1trXSA9IG9ialtrXVxuICB9XG5cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJVbmlxdWUgKGFycikge1xuICBsZXQgcmVzID0gW11cblxuICBvdXRlcjogZm9yIChjb25zdCBhIG9mIGFycikge1xuICAgIGZvciAoY29uc3QgciBvZiByZXMpIHtcbiAgICAgIGlmIChhLm5hbWUgJiYgYS5uYW1lID09PSByLm5hbWUpIGNvbnRpbnVlIG91dGVyXG4gICAgfVxuXG4gICAgcmVzLnB1c2goYSlcbiAgfVxuXG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gb2JqZWN0VG9UYWcgKHRhZywgcHJvcHMpIHtcbiAgY29uc3QgYXR0ciA9IE9iamVjdC5rZXlzKHByb3BzKVxuICAgIC5maWx0ZXIocCA9PiBwICE9PSAnY2hpbGRyZW4nKVxuICAgIC5tYXAocCA9PiBgJHtwfT1cIiR7cHJvcHNbcF19XCJgKVxuICAgIC5qb2luKCcgJylcbiAgY29uc3QgYXR0cmlidXRlcyA9IGF0dHIgPyAnICcgKyBhdHRyIDogJydcblxuICBpZiAodGFnID09PSAnc2NyaXB0JylcbiAgICByZXR1cm4gYDxzY3JpcHQke2F0dHJpYnV0ZXN9PiR7cHJvcHMuY2hpbGRyZW4gfHwgJyd9PC9zY3JpcHQ+YFxuICBpZiAodGFnID09PSAnc3R5bGUnKVxuICAgIHJldHVybiBgPHN0eWxlJHthdHRyaWJ1dGVzfT4ke3Byb3BzLmNoaWxkcmVuIHx8ICcnfTwvc3R5bGU+YFxuICByZXR1cm4gYDwke3RhZ30ke2F0dHJpYnV0ZXN9IC8+YFxufVxuXG5mdW5jdGlvbiB0b1RhZyAodGFnKSB7XG4gIHJldHVybiBvID0+ICh0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBvIDogb2JqZWN0VG9UYWcodGFnLCBvKSlcbn1cblxuZnVuY3Rpb24gcHJlZml4VG9PYmplY3RzIChwcmVmaXgsIHByb3BzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykubWFwKHAgPT4gKHtcbiAgICBbcHJlZml4ID09PSAnb2cnID8gJ3Byb3BlcnR5JyA6ICduYW1lJ106IGAke3ByZWZpeH06JHtwfWAsXG4gICAgY29udGVudDogcHJvcHNbcF1cbiAgfSkpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRUYWdzIChjb25maWcgPSB7fSkge1xuICBjb25zdCB7IHRpdGxlLCBkZXNjcmlwdGlvbiwgaW1hZ2UsIHVybCwgLi4ubyB9ID0gbWVyZ2UoZGVmYXVsdHMsIGNvbmZpZylcblxuICBjb25zdCBtZXRhID0gZmlsdGVyVW5pcXVlKG8ubWV0YSlcbiAgY29uc3QgbGluayA9IGZpbHRlclVuaXF1ZShvLmxpbmspXG4gIGNvbnN0IHNjcmlwdCA9IGZpbHRlclVuaXF1ZShvLnNjcmlwdClcbiAgY29uc3Qgc3R5bGUgPSBmaWx0ZXJVbmlxdWUoby5zdHlsZSlcbiAgY29uc3Qgb2cgPSBwcnVuZUVtcHR5KHtcbiAgICB0aXRsZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICB1cmwsXG4gICAgLi4uKG8ub2cgfHwge30pLFxuICAgIGltYWdlXG4gIH0pXG4gIGNvbnN0IHR3aXR0ZXIgPSBwcnVuZUVtcHR5KHtcbiAgICB0aXRsZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICB1cmwsXG4gICAgLi4uKG8udHdpdHRlciB8fCB7fSksXG4gICAgaW1hZ2VcbiAgfSlcblxuICBjb25zdCB0YWdzID0gW1xuICAgIG1ldGFcbiAgICAgIC5jb25jYXQoZGVzY3JpcHRpb24gPyB7IG5hbWU6ICdkZXNjcmlwdGlvbicsIGNvbnRlbnQ6IGRlc2NyaXB0aW9uIH0gOiBbXSlcbiAgICAgIC5tYXAodG9UYWcoJ21ldGEnKSksXG4gICAgcHJlZml4VG9PYmplY3RzKCdvZycsIG9nKS5tYXAodG9UYWcoJ21ldGEnKSksXG4gICAgcHJlZml4VG9PYmplY3RzKCd0d2l0dGVyJywgdHdpdHRlcikubWFwKHRvVGFnKCdtZXRhJykpLFxuICAgIGxpbmsubWFwKHRvVGFnKCdsaW5rJykpLFxuICAgIHNjcmlwdC5tYXAodG9UYWcoJ3NjcmlwdCcpKSxcbiAgICBzdHlsZS5tYXAodG9UYWcoJ3N0eWxlJykpXG4gIF0uZmxhdCgyKVxuXG4gIHJldHVybiBgPHRpdGxlPiR7dGl0bGV9PC90aXRsZT4ke3RhZ3Muam9pbignJyl9YFxufVxuXG5mdW5jdGlvbiBjcmVhdGVGb290VGFncyAoY29uZmlnID0ge30pIHtcbiAgY29uc3QgbyA9IG1lcmdlKHsgc2NyaXB0OiBbXSwgc3R5bGU6IFtdIH0sIGNvbmZpZylcbiAgY29uc3Qgc2NyaXB0ID0gZmlsdGVyVW5pcXVlKG8uc2NyaXB0KVxuICBjb25zdCBzdHlsZSA9IGZpbHRlclVuaXF1ZShvLnN0eWxlKVxuXG4gIGNvbnN0IHRhZ3MgPSBbc2NyaXB0Lm1hcCh0b1RhZygnc2NyaXB0JykpLCBzdHlsZS5tYXAodG9UYWcoJ3N0eWxlJykpXS5mbGF0KClcblxuICByZXR1cm4gdGFncy5qb2luKCcnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJ1bmVFbXB0eSxcbiAgZmlsdGVyVW5pcXVlLFxuICBvYmplY3RUb1RhZyxcbiAgdG9UYWcsXG4gIHByZWZpeFRvT2JqZWN0cyxcbiAgY3JlYXRlSGVhZFRhZ3MsXG4gIGNyZWF0ZUZvb3RUYWdzXG59XG4iLCAiY29uc3QgeyBjcmVhdGVIZWFkVGFncywgY3JlYXRlRm9vdFRhZ3MgfSA9IHJlcXVpcmUoJy4vY3JlYXRlSGVhZFRhZ3MnKVxuXG5mdW5jdGlvbiBodG1sICh7XG4gIGJvZHkgPSAnJyxcbiAgaGVhZCA9IHt9LFxuICBmb290ID0ge30sXG4gIGh0bWxBdHRyaWJ1dGVzID0ge30sXG4gIGJvZHlBdHRyaWJ1dGVzID0ge31cbn0pIHtcbiAgLy8gaW5zZXJ0IGZhdmljb24gZHVyaW5nIGRldiwgaWYgbm90IG90aGVyd2lzZSBzcGVjaWZpZWRcbiAgaWYgKFxuICAgIGhlYWQubGluayAmJlxuICAgICFoZWFkLmxpbmsuZmluZChtID0+IG0ucmVsID09PSAnaWNvbicgfHwgL3JlbD1cImljb24vLnRlc3QobSArICcnKSlcbiAgKSB7XG4gICAgY29uc29sZS5sb2coJ2FkZCBpY29uJylcbiAgICBoZWFkLmxpbmsucHVzaCh7XG4gICAgICByZWw6ICdpY29uJyxcbiAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgaHJlZjogYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFKU1NVUkJWSGdCN1piZGNkcEFFSUIzVDZERTlvdEx3QjNZRlFSWEVGeUJZV3dZdjVrT0FoV0V2R0h4RUZJQmNRV1FDa3dxaU5JQkR3SEhLTkptVHpDS2pPOUFBaVl6bWV3M294bWQ3dmEwZjdlM0FJSWdDSUlnQ0lJZ0NJTHdmNEpaRmxHemVSeE1wNWVFV09iaEtRdVZGaE0wQVVTZm43RWl1aTk0M21mNHk2dzFRQ3YrYXphN0phSW1LM2tNbTlIR2ROeTd1dyt3QjU0YWpXK0pzMUs0bnBmb3JXekNQK3IxMC9sczlrQUFyWXpLYTBvY2xjNmNmL3g0YzFPR0hVRWkwMzhuNllIUkFLMjhDekEwV1orUmtoTkZ3NkRSZUFkYndnNG9XUnpucHdmS0pGaEVIT1R3dWhVZFBVNkRBVldyK2ZjS3c3THBjNFQ0UFQxK1lZQVRoaDkzOFB3TGVLOUs0TG9Qc1Vkem9CQ04wU3NRRFo2dFN3OGU2L1VxTENxTkdhSVJoZUZGcU5SSi9FVFJPWDlyMGtwWURjUXBsZFVJblhvMkp3WktmVW1QbjFVaDI2bVBVYXJtZHJ0OXNNQ3lMWmJkbVBPOHBsWDB2TFp0WGlzZkZ3NmpNUGE1d3RWVzlsc0tYbCtYU2FtaFNZNDNiTC95dkJaczRPbnFxZ0tPOHo1REN2cTZXcUhqZkMwc294Y3NjdjV5WFFib3FCOTB1ejZZREZqalFaL3I3Z2xrUktlSjRuVFo1em5TMkp5WW5BRkVmR09XcEh2SWdmWlFwTlE1djQ1aGY0eHRHWkFZd0xkdHliUWdkSnpjN1lFMmdxTjJwcjBHdStOejZsellKdjlFd0JKeUxxc1QyQkx0dFpDb2xxRkttZUdxVnp3OFBGdk4relNGNUExeGxQcWVDQlRuYzZ0d0ZnNTZ2VDZmaXhHZml5cTNCcmVaTGtodUV2bkNhci91OVRxYmxtYnFSdmVGYmc1L1RxY1Z2cVRlNHFKdlN0cUZaWlRHcUwxK2RQUUpPNTJ0SXk4SWdpQUlnaUQ4SS93R2xLenA5U0E4enlVQUFBQUFTVVZPUks1Q1lJST1gXG4gICAgfSlcbiAgfVxuXG4gIC8vIGluc2VydCBkZWZhdWx0IGNoYXJzZXQgYW5kIHZpZXdwb3J0LCBpZiBub3Qgb3RoZXJ3aXNlIHNwZWNpZmllZFxuICBpZiAoaGVhZC5tZXRhKSB7XG4gICAgaWYgKCFoZWFkLm1ldGEuZmluZChtID0+ICEhbS5jaGFyc2V0KSkge1xuICAgICAgaGVhZC5tZXRhLnB1c2goeyBjaGFyc2V0OiAnVVRGLTgnIH0pXG4gICAgfVxuICAgIGlmICghaGVhZC5tZXRhLmZpbmQobSA9PiBtLm5hbWUgPT09ICd2aWV3cG9ydCcpKSB7XG4gICAgICBoZWFkLm1ldGEucHVzaCh7XG4gICAgICAgIG5hbWU6ICd2aWV3cG9ydCcsXG4gICAgICAgIGNvbnRlbnQ6ICd3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoZWFkVGFncyA9IGNyZWF0ZUhlYWRUYWdzKGhlYWQpXG4gIGNvbnN0IGZvb3RUYWdzID0gY3JlYXRlRm9vdFRhZ3MoZm9vdClcbiAgY29uc3QgaHRtbEF0dHIgPSBPYmplY3Qua2V5cyhodG1sQXR0cmlidXRlcykucmVkdWNlKChhdHRyLCBrZXkpID0+IHtcbiAgICByZXR1cm4gKGF0dHIgKz0gYCAke2tleX09XCIke2h0bWxBdHRyaWJ1dGVzW2tleV19XCJgKVxuICB9LCAnJylcbiAgY29uc3QgYm9keUF0dHIgPSBPYmplY3Qua2V5cyhib2R5QXR0cmlidXRlcykucmVkdWNlKChhdHRyLCBrZXkpID0+IHtcbiAgICByZXR1cm4gKGF0dHIgKz0gYCAke2tleX09XCIke2JvZHlBdHRyaWJ1dGVzW2tleV19XCJgKVxuICB9LCAnJylcblxuICByZXR1cm4gYDwhLS0gYnVpbHQgd2l0aCBwcmVzdGEgaHR0cHM6Ly9ucG0uaW0vcHJlc3RhIC0tPjwhRE9DVFlQRSBodG1sPjxodG1sJHtodG1sQXR0cn0+PGhlYWQ+JHtoZWFkVGFnc308L2hlYWQ+PGJvZHkke2JvZHlBdHRyfT4ke2JvZHl9JHtmb290VGFnc308L2JvZHk+PC9odG1sPmBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGh0bWxcbn1cbiJdLAogICJtYXBwaW5ncyI6ICJ5akJBQUEsOEJBRUEsR0FBSSxHQUFvQixTQUEyQixFQUFPLENBQ3pELE1BQU8sR0FBZ0IsSUFDbkIsQ0FBQyxFQUFVLElBR2hCLFdBQXlCLEVBQU8sQ0FDL0IsTUFBTyxDQUFDLENBQUMsR0FBUyxNQUFPLElBQVUsU0FHcEMsV0FBbUIsRUFBTyxDQUN6QixHQUFJLEdBQWMsT0FBTyxVQUFVLFNBQVMsS0FBSyxHQUVqRCxNQUFPLEtBQWdCLG1CQUNuQixJQUFnQixpQkFDaEIsRUFBZSxHQUlwQixHQUFJLEdBQWUsTUFBTyxTQUFXLFlBQWMsT0FBTyxJQUN0RCxFQUFxQixFQUFlLE9BQU8sSUFBSSxpQkFBbUIsTUFFdEUsV0FBd0IsRUFBTyxDQUM5QixNQUFPLEdBQU0sV0FBYSxFQUczQixXQUFxQixFQUFLLENBQ3pCLE1BQU8sT0FBTSxRQUFRLEdBQU8s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
