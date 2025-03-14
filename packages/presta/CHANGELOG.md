# presta

## 0.46.2

### Patch Changes

- [`b4c57ab568c09a4a618a4188b89d2a64c84bae0d`](https://github.com/front-of-house/presta/commit/b4c57ab568c09a4a618a4188b89d2a64c84bae0d) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Small fixes

## 0.46.1

### Patch Changes

- [#227](https://github.com/front-of-house/presta/pull/227) [`fbd77a8`](https://github.com/front-of-house/presta/commit/fbd77a8e8cfddb1065af6497f4430e28fe276995) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fixes some compiled `presta` files not being published with the rest of the npm package.

## 0.46.0

### Minor Changes

- [#223](https://github.com/front-of-house/presta/pull/223) [`55f2883`](https://github.com/front-of-house/presta/commit/55f288321da4fdfd3b4e0fc999f904997ca600e4) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Initial release after refactor! This release contains a few breaking changes, please review the latest docs.

## 0.45.4

### Patch Changes

- [`ee0d39c`](https://github.com/sure-thing/presta/commit/ee0d39c00dc234a655e2b9c70c049724319b9c5d) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Ensure that outputLambdas can throw on compile errors during build

## 0.45.3

### Patch Changes

- [`f62bacf`](https://github.com/sure-thing/presta/commit/f62bacfbfacf2ac7d73d8858cc283761efd9b807) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Unset headers and body if response is a redirect

## 0.45.2

### Patch Changes

- [#215](https://github.com/sure-thing/presta/pull/215) [`ccbfd7d`](https://github.com/sure-thing/presta/commit/ccbfd7d158c7dcb962a50116319cdc825dda1aa0) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Introduce \_\_unsafe_bundle_everything to config

## 0.45.1

### Patch Changes

- [#201](https://github.com/sure-thing/presta/pull/201) [`b4132d5`](https://github.com/sure-thing/presta/commit/b4132d532b8be2a997b9f173d374fe65c8de42f6) Thanks [@mikehwagz](https://github.com/mikehwagz)! - Let end user of presta handle output directory removal instead of automatically removing the output directory

## 0.45.0

### Minor Changes

- [#203](https://github.com/sure-thing/presta/pull/203) [`67a3235`](https://github.com/sure-thing/presta/commit/67a32350e33ae958dc22cbe8f2e1faf6f8a4b13b) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Output and consume manifest.json

## 0.44.4

### Patch Changes

- [`0f87fe9`](https://github.com/sure-thing/presta/commit/0f87fe9727d9e1cd5e3a96eb95b2f73349bc2ff4) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Add lambda-types dep

## 0.44.3

### Patch Changes

- [`040810c`](https://github.com/sure-thing/presta/commit/040810cfbed0b3a8679150749b09fa6e288b3221) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Normalize user-supplied headers before merging

## 0.44.2

### Patch Changes

- [`66eaa4a`](https://github.com/sure-thing/presta/commit/66eaa4a560ec679b7409689866a33e14bc293fb8) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Move parsePathParameters to @presta/utils

- Updated dependencies [[`66eaa4a`](https://github.com/sure-thing/presta/commit/66eaa4a560ec679b7409689866a33e14bc293fb8)]:
  - @presta/utils@0.1.2

## 0.44.1

### Patch Changes

- [#187](https://github.com/sure-thing/presta/pull/187) [`0d77419`](https://github.com/sure-thing/presta/commit/0d77419e97d2a69f302321939d526a899f32f179) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fix multi-header setting, move default HTML response to utils

- Updated dependencies [[`0d77419`](https://github.com/sure-thing/presta/commit/0d77419e97d2a69f302321939d526a899f32f179)]:
  - @presta/utils@0.1.1

## 0.44.0

### Minor Changes

- [#183](https://github.com/sure-thing/presta/pull/183) [`f6f9f1e`](https://github.com/sure-thing/presta/commit/f6f9f1eefd9636a2818badf4518757145e1510d1) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Factors out `@presta/utils`, refactors packages to use utils, introduces `@presta/adapter-node`

### Patch Changes

- Updated dependencies [[`f6f9f1e`](https://github.com/sure-thing/presta/commit/f6f9f1eefd9636a2818badf4518757145e1510d1)]:
  - @presta/utils@0.1.0

## 0.43.10

### Patch Changes

- [#180](https://github.com/sure-thing/presta/pull/180) [`be4fe30`](https://github.com/sure-thing/presta/commit/be4fe30b0f7c8438e5d6e211553b90dc7072ad3f) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Small refactors, additional tests

## 0.43.9

### Patch Changes

- [#177](https://github.com/sure-thing/presta/pull/177) [`7ad6812`](https://github.com/sure-thing/presta/commit/7ad68128de91a2306530318eba7c3d29ad49d81e) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Parse correct body enconding

* [#177](https://github.com/sure-thing/presta/pull/177) [`f687184`](https://github.com/sure-thing/presta/commit/f687184ff1600f169fd2444ab77a0f8fa76de35d) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Export normalizeHeaders and parseQueryStringParameters as separate files

## 0.43.8

### Patch Changes

- [`91ca4b0`](https://github.com/sure-thing/presta/commit/91ca4b02d9890c053d2fd76c3edce99b727caeef) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Create separate file for requestToEvent

## 0.43.7

### Patch Changes

- [`a2f4fed`](https://github.com/sure-thing/presta/commit/a2f4fed0c3c11bceb5ed95d0ab4848015d6597cb) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Export requestToEvent util

## 0.43.6

### Patch Changes

- [`89420b3`](https://github.com/sure-thing/presta/commit/89420b30dbd8188e142d24c28f1f12b6c8607484) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Stub awsRequestId in dev

## 0.43.5

### Patch Changes

- [`1c2faa8`](https://github.com/sure-thing/presta/commit/1c2faa824e5d7594fccaa8d15cdaa1bb1651e00e) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Add PRESTA_SERVE_URL to env

## 0.43.4

### Patch Changes

- [`15e3c7b`](https://github.com/sure-thing/presta/commit/15e3c7bc16930f6a176555d9fdcada3b22995ead) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Add support for .env with dotenv

## 0.43.3

### Patch Changes

- [`24457dd`](https://github.com/sure-thing/presta/commit/24457dd3891b6f97a9369127f1324bc6f5763c73) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Export parsePathParameters util

## 0.43.2

### Patch Changes

- [`16db9fe`](https://github.com/sure-thing/presta/commit/16db9fe13b429ce0a098d63d49f27950347d360f) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Reduce lambda bundle size

## 0.43.1

### Patch Changes

- [#156](https://github.com/sure-thing/presta/pull/156) [`a29752f`](https://github.com/sure-thing/presta/commit/a29752fa95faf0dad9785128f7e195668e229d5d) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Export more plugin types

## 0.43.0

### Minor Changes

- [`3b41578`](https://github.com/sure-thing/presta/commit/3b41578612855375f9ec25f89f5c974283cff0de) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Refactor config, watch, types, and update wdg.

## 0.42.1

### Patch Changes

- [`d6f1d4e`](https://github.com/sure-thing/presta/commit/d6f1d4e3855b5e6b90e108f744aae276b65c6c38) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Add .npmignore to trim publish size

## 0.42.0

### Minor Changes

- [#146](https://github.com/sure-thing/presta/pull/146) [`b030000`](https://github.com/sure-thing/presta/commit/b03000046aa462216e6a973059c7ae740d58f761) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Update file exports and type generation for easier maintenance

* [#148](https://github.com/sure-thing/presta/pull/148) [`efca778`](https://github.com/sure-thing/presta/commit/efca77808259f866e63c9465292d5344482beaa0) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Refactor server code for better testing

### Patch Changes

- [#148](https://github.com/sure-thing/presta/pull/148) [`513b9bd`](https://github.com/sure-thing/presta/commit/513b9bd199c9c7850041f8a545b29c0894d23024) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fix port assignment, update tests

## 0.41.1

### Patch Changes

- [`d18d29f`](https://github.com/sure-thing/presta/commit/d18d29fc6aaf18a3dd4a72a468bb3d1dd5f6265b) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Standardize dev server responses

* [`021c290`](https://github.com/sure-thing/presta/commit/021c2905059c5d27a558289117191320633c6c13) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Remove error handling and logging from `wrapHandler.ts` — this should only be handled during dev. In prod, users should rely on other libraries like `hypr`.

- [`eb59ca9`](https://github.com/sure-thing/presta/commit/eb59ca940a3ff0a6f92a47f177ed2799d9f2e12e) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Normalize request headers & query params, add tests

* [`79c9482`](https://github.com/sure-thing/presta/commit/79c948243403944d680a9a1da54ea3af59c134cf) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Remove static 404.html handling — this is specific to every hosting platform, we should not attempt to mimic it locally because it can result in non-prod-like edge cases that could confuse users.

- [`7798391`](https://github.com/sure-thing/presta/commit/7798391e9019a576bcc1e8d02ec158da85495633) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Make sure new logo is used

## 0.41.0

### Minor Changes

- [`07a540f`](https://github.com/sure-thing/presta/commit/07a540fa296edeea304d90de84c9c9f98f6bb0b1) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Update watch-dependency-graph to v3

## 0.40.7

### Patch Changes

- [`1ac8f37`](https://github.com/sure-thing/presta/commit/1ac8f373fa0fe01dd3d78eee246ee99f446908c9) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Adds back livereload script to static HTML files, fixes #137

## 0.40.6

### Patch Changes

- [`6e85ff9`](https://github.com/sure-thing/presta/commit/6e85ff9fef00c06e394d71372171d3bf2ef67415) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Ok now we got it I think, fixes #128

## 0.40.5

### Patch Changes

- [`7329b16`](https://github.com/sure-thing/presta/commit/7329b16f39e37d1d10276d84288f3ddc34ad221f) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Pass PRESTA_SERVERLESS_RUNTIME at build time, fixes #128

## 0.40.4

### Patch Changes

- [`61a3341`](https://github.com/sure-thing/presta/commit/61a3341036badd8d87eba4345cc520ba58289f54) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fix routeParameters types

* [`bb5a090`](https://github.com/sure-thing/presta/commit/bb5a090871ce11ee183ce4f4d9cf8cf735e0e203) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Adds PRESTA_SERVERLESS_RUNTIME, fixes #128

## 0.40.3

### Patch Changes

- [`26dc21d`](https://github.com/sure-thing/presta/commit/26dc21d2e6fe7a1103739286508589361aa58d3c) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Allow sirv to pick up generated static files if they exist

* [`50d5f21`](https://github.com/sure-thing/presta/commit/50d5f21ef2faffb3b93c1dd65bc47d0c4fc83415) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Delegate local server handling all the way down the chain of handlers

## 0.40.2

### Patch Changes

- [`e5129dc`](https://github.com/sure-thing/presta/commit/e5129dceea0ec0ab96e67b6ba997380f8e14a51b) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Handle route params separately from query params, now available as `routeParameters` and `queryStringParameters` instead of merged in `params`.

## 0.40.1

### Patch Changes

- [`ac87bc2`](https://github.com/sure-thing/presta/commit/ac87bc26a6c98e535d210ea442deed56d30bd76c) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Ensure query params are parsed and merged with route params

## 0.40.0

### Minor Changes

- [`f640eac`](https://github.com/sure-thing/presta/commit/f640eacefefc34b039eed317589cd292a5af5f1e) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Make config creation async to allow plugins to bootstrap themselves if need be

## 0.39.2

### Patch Changes

- [`4bdb013`](https://github.com/sure-thing/presta/commit/4bdb013f6424d00561274c2c79b17753b2ef2224) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Do not clear output directory on dev/watch startup

## 0.39.1

### Patch Changes

- [`e6131bd`](https://github.com/sure-thing/presta/commit/e6131bd9effdefd421b39d80d109e02c27a0e07b) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Export logger, emit build before final core library logs 'complete' message

## 0.39.0

### Minor Changes

- [`c53c96c`](https://github.com/sure-thing/presta/commit/c53c96c5ea5ab9698ca4776beeacc7ad3ff52ae1) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Standardize hooks interfaces — everything is now on `context.hooks` and follows `emitX` and `onX` pattern

## 0.38.0

### Minor Changes

- [`e7e9fa4`](https://github.com/sure-thing/presta/commit/e7e9fa42be718902763c1e4b0dad5f8b10bb93a1) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Pass full context getter to plugins, standardize type imports

### Patch Changes

- [`aa32825`](https://github.com/sure-thing/presta/commit/aa3282511351de5afa2cb79b2c7c6bfbed0b44ea) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Move Env to constant value

## 0.37.1

### Patch Changes

- [`747bc24`](https://github.com/sure-thing/presta/commit/747bc24d6c751cd9348477bb8a304b411f47fecb) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Clear manifest from require cache before routing

## 0.37.0

### Minor Changes

- [`6010c96`](https://github.com/sure-thing/presta/commit/6010c968b3dfe2e04638233be1e3f20839bdfab8) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Introduce an actions API — subject to change

## 0.36.3

### Patch Changes

- [`b867a13`](https://github.com/sure-thing/presta/commit/b867a13a7932d91b7be5086f68ab68333d198cc3) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fix CLI help inconsistencies

## 0.36.2

### Patch Changes

- [`898f5b2`](https://github.com/sure-thing/presta/commit/898f5b2e0ec9be7cc7a997a9164593aa6b75c3bb) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fix typo

## 0.36.1

### Patch Changes

- [`32e3bc5`](https://github.com/sure-thing/presta/commit/32e3bc557f6f9124e60ca6edb7e413c17e6008f7) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Register runtime for serve command

## 0.36.0

### Minor Changes

- [`cd0a41f`](https://github.com/sure-thing/presta/commit/cd0a41ff0362fcca938d8b4c4442933f536ca1ba) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Update esbuild dependencies

* [`50050de`](https://github.com/sure-thing/presta/commit/50050de22a8edf52c7fdb156d18b747e96a37847) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Adds port option to CLI and config file

### Patch Changes

- [`933f060`](https://github.com/sure-thing/presta/commit/933f060f5c511a58a733387bdd810d7b2b1590a4) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Handle getFiles exception

* [`1649697`](https://github.com/sure-thing/presta/commit/1649697bc888f6e02418b886296f5ced45e9f0c8) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Add more CLI help docs

- [`f6dd990`](https://github.com/sure-thing/presta/commit/f6dd99040395e735514ca515b8e436ac4a0437f1) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Log swallowed handler error

## 0.35.6

### Patch Changes

- [`f6c1b25`](https://github.com/sure-thing/presta/commit/f6c1b251fd217ee5c872ae1909b5dd428f9e5c42) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Noop bump for debug purposes

## 0.35.5

### Patch Changes

- [`4b9da8c`](https://github.com/sure-thing/presta/commit/4b9da8c115ee9ebd74f41d1c595b60cda7364154) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Add port to console log

## 0.35.4

### Patch Changes

- [`bdcbded`](https://github.com/sure-thing/presta/commit/bdcbded8c9a3fdadf0848eb15166ad14625d6bc9) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Further improve config try/catch handling

## 0.35.3

### Patch Changes

- [`100838b`](https://github.com/sure-thing/presta/commit/100838bac0ac260ba25dcc75a01061ee1765db3a) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Change task watch -> dev, add watch alias and description

* [`c028e4a`](https://github.com/sure-thing/presta/commit/c028e4acf8f70d1aeef7fd24dc95bb19384234c5) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Fix getConfigFile try/catch logic — only log and/or exit under certain circumstances

## 0.35.2

### Patch Changes

- [`c8df2d6`](https://github.com/sure-thing/presta/commit/c8df2d692a45a9d2ff244830189bc0630c2bd28f) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Adds simple default error handling to wrapHandler for both HTML and JSON requests

## 0.35.1

### Patch Changes

- [`17ba054`](https://github.com/sure-thing/presta/commit/17ba054a323e44a6c62270cc74dbd88eba8cdfa8) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Adds additional export of getCurrentPrestaInstance

* [`241aa30`](https://github.com/sure-thing/presta/commit/241aa304316a32d098564308a22eed822c8828f9) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - add typed hooks to Presta instance

## 0.35.0

### Minor Changes

- [#105](https://github.com/sure-thing/presta/pull/105) [`bb4c1d0`](https://github.com/sure-thing/presta/commit/bb4c1d0d3505bd99639eec8d244e4a1763c77458) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - - adds `postbuild` event for adapter plugin use
  - adds support for rudimentary plugins
  - adds and fixes a few types

### Patch Changes

- [#105](https://github.com/sure-thing/presta/pull/105) [`c47957c`](https://github.com/sure-thing/presta/commit/c47957c6b9c4c97f578094a3e991a2aaeaaf8670) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Require cache was not being cleared during watch

## 0.34.6

### Patch Changes

- [`0e6130e`](https://github.com/sure-thing/presta/commit/0e6130e3ceb3f5bcac3b9ac94ff95b590400f05f) Thanks [@estrattonbailey](https://github.com/estrattonbailey)! - Test new changeset config

## 0.34.5

### Patch Changes

- 0d514fd: New tiny-glob package was returning relative filepaths — the opposite of previous library, matched.

## 0.34.4

### Patch Changes

- ff08a59: Test changesets with new config

## 0.34.3

### Patch Changes

- Test changeset with new config

## 0.34.2

### Patch Changes

- Previous build was published using es-mime-types, which is ESM an was not transpiled. This release reverts to mime-types and installs the TypeScript types required to use it.

## 0.34.1

### Patch Changes

- Setup changesets
