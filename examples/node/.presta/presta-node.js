var r = Object.defineProperty
var i = Object.getOwnPropertyDescriptor
var n = Object.getOwnPropertyNames
var l = Object.prototype.hasOwnProperty
var c = (s, e) => {
    for (var a in e) r(s, a, { get: e[a], enumerable: !0 })
  },
  d = (s, e, a, o) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let t of n(e))
        !l.call(s, t) && t !== a && r(s, t, { get: () => e[t], enumerable: !(o = i(e, t)) || o.enumerable })
    return s
  }
var f = (s) => d(r({}, '__esModule', { value: !0 }), s)
var u = {}
c(u, { default: () => m })
module.exports = f(u)
var p = require('@presta/adapter-node/dist/runtime'),
  m = (0, p.adapter)(
    {
      staticOutputDir: '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/static',
      functionsOutputDir: '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/functions',
      manifest: {
        statics: {
          '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Index.ts': [
            '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/static/index.html',
            '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/static/about/index.html',
          ],
        },
        functions: {
          '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Redirect.ts': {
            route: '/redirect',
            src: '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Redirect.ts',
            dest: '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/functions/src-pages-Redirect-tt4cq.js',
          },
          '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Page.ts': {
            route: '/:slug?',
            src: '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Page.ts',
            dest: '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/functions/src-pages-Page-1mo4i19.js',
          },
          '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Api.ts': {
            route: '/api/*',
            src: '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/Api.ts',
            dest: '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/functions/src-pages-Api-1ynskub.js',
          },
          '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/NotFound.ts': {
            route: '*',
            src: '/Users/estrattonbailey/Sites/foh/presta/examples/node/src/pages/NotFound.ts',
            dest: '/Users/estrattonbailey/Sites/foh/presta/examples/node/.presta/functions/src-pages-NotFound-8ku7vy.js',
          },
        },
      },
    },
    { port: 4e3 }
  )
0 && (module.exports = {})
