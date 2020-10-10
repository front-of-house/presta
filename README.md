![presta](https://user-images.githubusercontent.com/4732330/95477753-4aaec980-094e-11eb-9fa1-f2741b8233cd.png)

### The simple way to build the modern web.

> `presta` is in active beta. Questions, comments, ideas? Open an issue or PR!

Presta starts simple and stays simple. It provides familiar ergonomics, but
avoids opaque abstraction, giving more power (and responsibility) to the
developer.

At its core, presta requests paths – or routes – to render, and concatenates
strings returned from your pages into HTML documents. It can event render other
formats too, like JSON.

#### Features
- fast, no compilation
- render any file type, not just HTML
- easily nest microsites
- ergonomic co-located data loading
- smol, ~700 loc
- 0kb runtime (there is no runtime)
- get started with one file, two exports, and the CLI
- made for the document web

#### Installation

`presta` needs to be installed locally to your project:

```bash
$ npm i presta
```

Don't forget, you can always ask the CLI for help:

```bash
$ npx presta help
```

## Docs

Head over to [the docs site](https://sure-thing.net/presta) to get started.

## Roadmap

- TypeScript defs

### License

MIT License © [Eric Bailey](https://estrattonbailey.com)
