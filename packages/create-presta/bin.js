#! /usr/bin/env node
var L = Object.create
var c = Object.defineProperty
var P = Object.getOwnPropertyDescriptor
var T = Object.getOwnPropertyNames
var _ = Object.getPrototypeOf,
  F = Object.prototype.hasOwnProperty
var I = (e) => c(e, '__esModule', { value: !0 })
var J = (e, t, a) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let r of T(t))
        !F.call(e, r) && r !== 'default' && c(e, r, { get: () => t[r], enumerable: !(a = P(t, r)) || a.enumerable })
    return e
  },
  i = (e) =>
    J(
      I(
        c(
          e != null ? L(_(e)) : {},
          'default',
          e && e.__esModule && 'default' in e ? { get: () => e.default, enumerable: !0 } : { value: e, enumerable: !0 }
        )
      ),
      e
    )
var v = i(require('fs-extra')),
  m = i(require('path')),
  h = i(require('prompts')),
  w = i(require('kleur'))
var O = 'create-presta',
  $ = '0.1.1',
  E = 'Create a new Presta project from your CLI',
  q = 'bin.js',
  A = 'index.d.ts',
  M = ['bin.js'],
  N = { 'create-presta': 'bin.js' },
  W = { build: 'node scripts/build && tsc --emitDeclarationOnly', typecheck: 'tsc --noEmit' },
  G = { type: 'git', url: 'git+ssh://git@github.com/sure-thing/presta.git' },
  H = 'estrattonbailey',
  R = 'MIT',
  V = { url: 'https://github.com/sure-thing/presta/issues' },
  Y = 'https://github.com/sure-thing/presta#readme',
  z = {
    deepmerge: '^4.2.2',
    'fs-extra': '^9.1.0',
    kleur: '^4.1.4',
    presta: 'workspace:^0.45.0',
    prompts: '^2.4.2',
    'sort-package-json': '^1.54.0',
  },
  B = {
    '@types/fs-extra': '^9.0.12',
    '@types/node': '^18.6.3',
    '@types/prompts': '^2.0.14',
    'package-json-types': '^1.0.2',
    typescript: '^4.7.4',
  },
  y = {
    name: O,
    version: $,
    description: E,
    main: q,
    types: A,
    files: M,
    bin: N,
    scripts: W,
    repository: G,
    author: H,
    license: R,
    bugs: V,
    homepage: Y,
    dependencies: z,
    devDependencies: B,
  }
var o = i(require('path')),
  n = i(require('fs-extra')),
  l = i(require('deepmerge')),
  f = i(require('sort-package-json')),
  p = o.default.join(__dirname, 'lib/templates'),
  K = { name: 'create-presta', version: '0.0.0', scripts: { start: 'presta dev', build: 'presta' } },
  Q = {
    js: { devDependencies: {}, dependencies: { presta: '*' } },
    ts: { devDependencies: { typescript: '*' }, dependencies: { presta: '*' } },
  },
  U = {
    presta: { devDependencies: {}, dependencies: {} },
    netlify: { devDependencies: { '@presta/adapter-netlify': '*' }, dependencies: {} },
    vercel: { devDependencies: { '@presta/adapter-vercel': '*' }, dependencies: {} },
  }
async function j(e) {
  let { root: t, language: a, service: r } = e,
    d = a === 'ts',
    g = o.default.join(p, r)
  await n.default.copy(o.default.join(p, '_common'), t),
    await n.default.copy(d ? o.default.join(p, '_ts') : o.default.join(p, '_js'), t)
  let b = Q[a],
    k = U[r],
    D = (0, l.default)(b, k),
    x = (0, l.default)(K, D)
  await n.default.writeFile(o.default.join(t, 'package.json'), JSON.stringify((0, f.default)(x), null, '  '), 'utf8')
  let S =
    n.default.readFileSync(o.default.join(t, 'gitignore'), 'utf8') +
    n.default.readFileSync(o.default.join(g, 'gitignore'), 'utf8')
  await n.default.writeFile(o.default.join(t, './.gitignore'), S, 'utf8')
  let u = d ? 'presta.config.ts' : 'presta.config.js',
    C = o.default.join(g, u)
  await n.default.copy(C, o.default.join(t, u))
}
console.clear()
console.log(`create-presta ${w.default.gray(`v${y.version}`)}

Hey there. Let's get you set up :)
`)
;(async () => {
  let t = await (0, h.default)([
    {
      type: 'text',
      name: 'root',
      message: 'Where would you like to create your project?',
      initial: './',
      validate(r) {
        return v.default.existsSync(m.default.join(process.cwd(), r))
          ? `whoops, looks like directory ${r} already exists`
          : !0
      },
      format(r) {
        return m.default.join(process.cwd(), r)
      },
    },
    {
      type: 'autocomplete',
      name: 'service',
      message: "Where do you plan to deploy your project? If you're unsure, just hit enter.",
      choices: [
        { title: "I don't know", value: 'presta' },
        { title: 'Netlify', value: 'netlify' },
        { title: 'Vercel', value: 'vercel' },
      ],
    },
    {
      type: 'autocomplete',
      name: 'language',
      message: 'JavaScript or TypeScript?',
      choices: [
        { title: 'JavaScript', value: 'js' },
        { title: 'TypeScript', value: 'ts' },
      ],
    },
  ])
  await j(t)
  let a = '.' + t.root.replace(process.cwd(), '')
  console.log(`
You're all set! To get started, run:

  cd ${a} && npm i
`)
})()
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGliL2Jpbi50cyIsICJsaWIvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIiMhIC91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcHJvbXB0cywgeyBQcm9tcHRPYmplY3QgfSBmcm9tICdwcm9tcHRzJ1xuaW1wb3J0IGMgZnJvbSAna2xldXInXG5cbmltcG9ydCBwa2cgZnJvbSAnLi4vcGFja2FnZS5qc29uJ1xuaW1wb3J0IHsgY3JlYXRlUHJlc3RhLCBDb25maWcgfSBmcm9tICcuJ1xuXG5jb25zb2xlLmNsZWFyKClcbmNvbnNvbGUubG9nKGBjcmVhdGUtcHJlc3RhICR7Yy5ncmF5KGB2JHtwa2cudmVyc2lvbn1gKX1cXG5cXG5IZXkgdGhlcmUuIExldCdzIGdldCB5b3Ugc2V0IHVwIDopXFxuYClcbjsoYXN5bmMgKCkgPT4ge1xuICBjb25zdCBxdWVzdGlvbnM6IFByb21wdE9iamVjdFtdID0gW1xuICAgIHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIG5hbWU6ICdyb290JyxcbiAgICAgIG1lc3NhZ2U6IGBXaGVyZSB3b3VsZCB5b3UgbGlrZSB0byBjcmVhdGUgeW91ciBwcm9qZWN0P2AsXG4gICAgICBpbml0aWFsOiBgLi9gLFxuICAgICAgdmFsaWRhdGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHZhbHVlKSlcbiAgICAgICAgICA/IGB3aG9vcHMsIGxvb2tzIGxpa2UgZGlyZWN0b3J5ICR7dmFsdWV9IGFscmVhZHkgZXhpc3RzYFxuICAgICAgICAgIDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGZvcm1hdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHZhbHVlKVxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICdhdXRvY29tcGxldGUnLFxuICAgICAgbmFtZTogJ3NlcnZpY2UnLFxuICAgICAgbWVzc2FnZTogYFdoZXJlIGRvIHlvdSBwbGFuIHRvIGRlcGxveSB5b3VyIHByb2plY3Q/IElmIHlvdSdyZSB1bnN1cmUsIGp1c3QgaGl0IGVudGVyLmAsXG4gICAgICBjaG9pY2VzOiBbXG4gICAgICAgIHsgdGl0bGU6IGBJIGRvbid0IGtub3dgLCB2YWx1ZTogYHByZXN0YWAgfSxcbiAgICAgICAgeyB0aXRsZTogYE5ldGxpZnlgLCB2YWx1ZTogYG5ldGxpZnlgIH0sXG4gICAgICAgIHsgdGl0bGU6IGBWZXJjZWxgLCB2YWx1ZTogYHZlcmNlbGAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAnYXV0b2NvbXBsZXRlJyxcbiAgICAgIG5hbWU6ICdsYW5ndWFnZScsXG4gICAgICBtZXNzYWdlOiBgSmF2YVNjcmlwdCBvciBUeXBlU2NyaXB0P2AsXG4gICAgICBjaG9pY2VzOiBbXG4gICAgICAgIHsgdGl0bGU6IGBKYXZhU2NyaXB0YCwgdmFsdWU6ICdqcycgfSxcbiAgICAgICAgeyB0aXRsZTogYFR5cGVTY3JpcHRgLCB2YWx1ZTogJ3RzJyB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdXG5cbiAgY29uc3QgYW5zd2VycyA9IGF3YWl0IHByb21wdHMocXVlc3Rpb25zKVxuXG4gIGF3YWl0IGNyZWF0ZVByZXN0YShhbnN3ZXJzIGFzIENvbmZpZylcblxuICBjb25zdCByZWxhdGl2ZUN3ZCA9ICcuJyArIGFuc3dlcnMucm9vdC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxuXG4gIGNvbnNvbGUubG9nKGBcXG5Zb3UncmUgYWxsIHNldCEgVG8gZ2V0IHN0YXJ0ZWQsIHJ1bjpcXG5cXG4gIGNkICR7cmVsYXRpdmVDd2R9ICYmIG5wbSBpXFxuYClcbn0pKClcbiIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xuaW1wb3J0IG1lcmdlIGZyb20gJ2RlZXBtZXJnZSdcbmltcG9ydCBzb3J0IGZyb20gJ3NvcnQtcGFja2FnZS1qc29uJ1xuLy8gaW1wb3J0IHR5cGUgeyBCb2R5IH0gZnJvbSAncGFja2FnZS1qc29uLXR5cGVzJ1xuXG5leHBvcnQgdHlwZSBTZXJ2aWNlID0gJ3ByZXN0YScgfCAnbmV0bGlmeScgfCAndmVyY2VsJ1xuZXhwb3J0IHR5cGUgTGFuZ3VhZ2UgPSAndHMnIHwgJ2pzJ1xuZXhwb3J0IHR5cGUgQ29uZmlnID0ge1xuICByb290OiBzdHJpbmdcbiAgc2VydmljZTogU2VydmljZVxuICBsYW5ndWFnZTogTGFuZ3VhZ2Vcbn1cblxuY29uc3QgTE9DQUxfVEVNUExBVEVTX0RJUiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdsaWIvdGVtcGxhdGVzJylcblxuY29uc3QgYmFzZVBhY2thZ2VKc29uID0ge1xuICBuYW1lOiAnY3JlYXRlLXByZXN0YScsXG4gIHZlcnNpb246ICcwLjAuMCcsXG4gIHNjcmlwdHM6IHtcbiAgICBzdGFydDogJ3ByZXN0YSBkZXYnLFxuICAgIGJ1aWxkOiAncHJlc3RhJyxcbiAgfSxcbn1cblxuY29uc3QgY29tbW9uRGVwZW5kZW5jaWVzID0ge1xuICBqczoge1xuICAgIGRldkRlcGVuZGVuY2llczoge30sXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBwcmVzdGE6ICcqJyxcbiAgICB9LFxuICB9LFxuICB0czoge1xuICAgIGRldkRlcGVuZGVuY2llczoge1xuICAgICAgdHlwZXNjcmlwdDogJyonLFxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBwcmVzdGE6ICcqJyxcbiAgICB9LFxuICB9LFxufVxuXG5jb25zdCBzZXJ2aWNlRGVwZW5kZW5jaWVzID0ge1xuICBwcmVzdGE6IHtcbiAgICBkZXZEZXBlbmRlbmNpZXM6IHt9LFxuICAgIGRlcGVuZGVuY2llczoge30sXG4gIH0sXG4gIG5ldGxpZnk6IHtcbiAgICBkZXZEZXBlbmRlbmNpZXM6IHtcbiAgICAgICdAcHJlc3RhL2FkYXB0ZXItbmV0bGlmeSc6ICcqJyxcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczoge30sXG4gIH0sXG4gIHZlcmNlbDoge1xuICAgIGRldkRlcGVuZGVuY2llczoge1xuICAgICAgJ0BwcmVzdGEvYWRhcHRlci12ZXJjZWwnOiAnKicsXG4gICAgfSxcbiAgICBkZXBlbmRlbmNpZXM6IHt9LFxuICB9LFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJlc3RhKGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IHsgcm9vdCwgbGFuZ3VhZ2UsIHNlcnZpY2UgfSA9IGNvbmZpZ1xuICBjb25zdCBpc1R5cGVTY3JpcHQgPSBsYW5ndWFnZSA9PT0gJ3RzJ1xuICBjb25zdCBzZXJ2aWNlRGlyID0gcGF0aC5qb2luKExPQ0FMX1RFTVBMQVRFU19ESVIsIHNlcnZpY2UpXG5cbiAgLy8gY29tbW9uIGZpbGVzXG4gIGF3YWl0IGZzLmNvcHkocGF0aC5qb2luKExPQ0FMX1RFTVBMQVRFU19ESVIsICdfY29tbW9uJyksIHJvb3QpXG4gIGF3YWl0IGZzLmNvcHkoaXNUeXBlU2NyaXB0ID8gcGF0aC5qb2luKExPQ0FMX1RFTVBMQVRFU19ESVIsICdfdHMnKSA6IHBhdGguam9pbihMT0NBTF9URU1QTEFURVNfRElSLCAnX2pzJyksIHJvb3QpXG5cbiAgLy8gcGFja2FnZS5qc29uXG4gIGNvbnN0IGNvbW1vbkRlcHMgPSBjb21tb25EZXBlbmRlbmNpZXNbbGFuZ3VhZ2VdXG4gIGNvbnN0IHNlcnZpY2VEZXBzID0gc2VydmljZURlcGVuZGVuY2llc1tzZXJ2aWNlXVxuICBjb25zdCBkZXBzID0gbWVyZ2UoY29tbW9uRGVwcywgc2VydmljZURlcHMpXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gbWVyZ2UoYmFzZVBhY2thZ2VKc29uLCBkZXBzKVxuICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKHJvb3QsICdwYWNrYWdlLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkoc29ydChwYWNrYWdlSnNvbiksIG51bGwsICcgICcpLCAndXRmOCcpXG5cbiAgLy8gLmdpdGlnbm9yZVxuICBjb25zdCBtZXJnZWRHaXRpZ25vcmUgPVxuICAgIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4ocm9vdCwgJ2dpdGlnbm9yZScpLCAndXRmOCcpICsgZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihzZXJ2aWNlRGlyLCAnZ2l0aWdub3JlJyksICd1dGY4JylcbiAgYXdhaXQgZnMud3JpdGVGaWxlKHBhdGguam9pbihyb290LCAnLi8uZ2l0aWdub3JlJyksIG1lcmdlZEdpdGlnbm9yZSwgJ3V0ZjgnKVxuXG4gIC8vIHByZXN0YS5jb25maWdcbiAgY29uc3QgcHJlc3RhQ29uZmlnRmlsZW5hbWUgPSBpc1R5cGVTY3JpcHQgPyAncHJlc3RhLmNvbmZpZy50cycgOiAncHJlc3RhLmNvbmZpZy5qcydcbiAgY29uc3QgcHJlc3RhQ29uZmlnRmlsZXBhdGggPSBwYXRoLmpvaW4oc2VydmljZURpciwgcHJlc3RhQ29uZmlnRmlsZW5hbWUpXG4gIGF3YWl0IGZzLmNvcHkocHJlc3RhQ29uZmlnRmlsZXBhdGgsIHBhdGguam9pbihyb290LCBwcmVzdGFDb25maWdGaWxlbmFtZSkpXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO29oQkFFQSxNQUFlLHVCQUNmLEVBQWlCLG1CQUNqQixFQUFzQyxzQkFDdEMsRUFBYyx1MkJDTGQsTUFBaUIsbUJBQ2pCLEVBQWUsdUJBQ2YsRUFBa0Isd0JBQ2xCLEVBQWlCLGdDQVdYLEVBQXNCLFVBQUssS0FBSyxVQUFXLGlCQUUzQyxFQUFrQixDQUN0QixLQUFNLGdCQUNOLFFBQVMsUUFDVCxRQUFTLENBQ1AsTUFBTyxhQUNQLE1BQU8sV0FJTCxFQUFxQixDQUN6QixHQUFJLENBQ0YsZ0JBQWlCLEdBQ2pCLGFBQWMsQ0FDWixPQUFRLE1BR1osR0FBSSxDQUNGLGdCQUFpQixDQUNmLFdBQVksS0FFZCxhQUFjLENBQ1osT0FBUSxPQUtSLEVBQXNCLENBQzFCLE9BQVEsQ0FDTixnQkFBaUIsR0FDakIsYUFBYyxJQUVoQixRQUFTLENBQ1AsZ0JBQWlCLENBQ2YsMEJBQTJCLEtBRTdCLGFBQWMsSUFFaEIsT0FBUSxDQUNOLGdCQUFpQixDQUNmLHlCQUEwQixLQUU1QixhQUFjLEtBSWxCLGlCQUFtQyxFQUFnQixDQUNqRCxHQUFNLENBQUUsT0FBTSxXQUFVLFdBQVksRUFDOUIsRUFBZSxJQUFhLEtBQzVCLEVBQWEsVUFBSyxLQUFLLEVBQXFCLEdBR2xELEtBQU0sV0FBRyxLQUFLLFVBQUssS0FBSyxFQUFxQixXQUFZLEdBQ3pELEtBQU0sV0FBRyxLQUFLLEVBQWUsVUFBSyxLQUFLLEVBQXFCLE9BQVMsVUFBSyxLQUFLLEVBQXFCLE9BQVEsR0FHNUcsR0FBTSxHQUFhLEVBQW1CLEdBQ2hDLEVBQWMsRUFBb0IsR0FDbEMsRUFBTyxjQUFNLEVBQVksR0FDekIsRUFBYyxjQUFNLEVBQWlCLEdBQzNDLEtBQU0sV0FBRyxVQUFVLFVBQUssS0FBSyxFQUFNLGdCQUFpQixLQUFLLFVBQVUsY0FBSyxHQUFjLEtBQU0sTUFBTyxRQUduRyxHQUFNLEdBQ0osVUFBRyxhQUFhLFVBQUssS0FBSyxFQUFNLGFBQWMsUUFBVSxVQUFHLGFBQWEsVUFBSyxLQUFLLEVBQVksYUFBYyxRQUM5RyxLQUFNLFdBQUcsVUFBVSxVQUFLLEtBQUssRUFBTSxnQkFBaUIsRUFBaUIsUUFHckUsR0FBTSxHQUF1QixFQUFlLG1CQUFxQixtQkFDM0QsRUFBdUIsVUFBSyxLQUFLLEVBQVksR0FDbkQsS0FBTSxXQUFHLEtBQUssRUFBc0IsVUFBSyxLQUFLLEVBQU0sSUQzRXRELFFBQVEsUUFDUixRQUFRLElBQUksaUJBQWlCLFVBQUUsS0FBSyxJQUFJLEVBQUk7QUFBQTtBQUFBO0FBQUEsR0FDM0MsQUFBQyxVQUFZLENBcUNaLEdBQU0sR0FBVSxLQUFNLGNBcENZLENBQ2hDLENBQ0UsS0FBTSxPQUNOLEtBQU0sT0FDTixRQUFTLCtDQUNULFFBQVMsS0FDVCxTQUFTLEVBQU8sQ0FDZCxNQUFPLFdBQUcsV0FBVyxVQUFLLEtBQUssUUFBUSxNQUFPLElBQzFDLGdDQUFnQyxtQkFDaEMsSUFFTixPQUFPLEVBQU8sQ0FDWixNQUFPLFdBQUssS0FBSyxRQUFRLE1BQU8sS0FHcEMsQ0FDRSxLQUFNLGVBQ04sS0FBTSxVQUNOLFFBQVMsOEVBQ1QsUUFBUyxDQUNQLENBQUUsTUFBTyxlQUFnQixNQUFPLFVBQ2hDLENBQUUsTUFBTyxVQUFXLE1BQU8sV0FDM0IsQ0FBRSxNQUFPLFNBQVUsTUFBTyxZQUc5QixDQUNFLEtBQU0sZUFDTixLQUFNLFdBQ04sUUFBUyw0QkFDVCxRQUFTLENBQ1AsQ0FBRSxNQUFPLGFBQWMsTUFBTyxNQUM5QixDQUFFLE1BQU8sYUFBYyxNQUFPLFVBT3BDLEtBQU0sR0FBYSxHQUVuQixHQUFNLEdBQWMsSUFBTSxFQUFRLEtBQUssUUFBUSxRQUFRLE1BQU8sSUFFOUQsUUFBUSxJQUFJO0FBQUE7QUFBQTtBQUFBLE9BQWtEOyIsCiAgIm5hbWVzIjogW10KfQo=
