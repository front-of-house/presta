# presta

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
