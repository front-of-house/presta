#!/usr/bin/env node

require('esm')(module)

const path = require("path");
const fs = require('fs-extra')
const assert = require('assert')
const serve = require('@presta/serve')
const c = require('ansi-colors')

const { watch, build } = require('./')
const { CWD, PRESTA_DIR, PRESTA_PAGES, PRESTA_WRAPPED_PAGES } = require('./lib/constants')
const { getGlobCommonDirectory } = require('./lib/getGlobCommonDirectory')
const { safeConfigFilepath } = require('./lib/safeConfigFilepath')
const { safeRequire } = require('./lib/safeRequire')

const args = require('minimist')(process.argv.slice(2))
const [ command ] = args._

const configFilepath = safeConfigFilepath(args.c || args.config || 'presta.config.js')
const runtimeFilepath = safeConfigFilepath(args.r || args.runtime || 'presta.runtime.js')
const configFile = safeRequire(configFilepath, {})
const input = args.i || args.in || configFile.input
const output = args.o || args.out || configFile.output || 'build'
const incremental = args.inc || args.incremental || configFile.incremental || command === 'watch' ? true : false

assert(!!input, `presta - please provide an input`)

const config = {
  command,
  input,
  output: path.join(CWD, output),
  baseDir: path.resolve(CWD, getGlobCommonDirectory(input)),
  configFilepath,
  runtimeFilepath,
  incremental,
}

function clean() {
  fs.ensureDirSync(PRESTA_DIR);
  fs.emptyDirSync(PRESTA_PAGES);
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES);
}

;(async () => {
  console.clear()

  if (command === "watch") {
    clean()
    console.log(c.blue('presta watch'), incremental ? c.gray('awaiting changes') : '')
    console.log('')
    watch(config);
  } else if (command === "build") {
    clean()
    console.log(c.blue('presta build'), incremental ? c.gray('checking cache') : '')
    console.log('')
    const st = Date.now()
    await build(config)
    const time = Date.now() - st
    console.log('')
    console.log(c.blue('built'), c.gray(`in ${time}ms`))
  } else if (command === "serve") {
    serve(args.i || args.in || config.output)
  }
})();
