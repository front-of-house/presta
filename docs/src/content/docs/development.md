---
title: Development
description: ''
slug: development
linkTitle: Development
linkDescription: Running Presta locally
---

Once you've [installed Presta](/presta/docs/getting-started) and [created your first page](/presta/docs/pages), you should be ready to run Presta locally.

Now, if you've set up a [config file](/presta/docs/configuration), you can simply run:

```bash
$ npx presta watch
```

Otherwise, if you're running right from the CLI, you'll do this:

```bash
$ npx presta watch path/to/*.js
```

> Remember, you can run `npx presta -h` if you forget these commands.

How you serve your files locally will depend on your intended production environment, but to kick things off you can always use the built-in server that ships with Presta.

```bash
$ npx presta serve
```

For convenience, you can also do this all in one shot:

```bash
$ npx presta watch --serve
```

## Output Files

By default, Presta builds your pages to `./build` in your project's root (or another output directory you specify). When running `npx presta build`, Presta will _empty_ this directory in order to populate a fresh set of files. On `npx presta watch` it won't.

During development, you'll probably have images, scripts, and other static assets you want hosted so they can appear in your pages. To do this, you'll want to copy these files to your output directory.

Let's say your static files are in `./static` in your project's root. A simple recipe for this, via [npm scripts](https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/), looks like this:

```json
{
  "scripts": {
    "copy-static": "cp -R static build/static"
  }
}
```

This will create a `./build/static` directory with all your files, which will then be available (using the Presta server) at `/static/assetPath.ext`. And again, depending on your intended production environment, _this might look different._
