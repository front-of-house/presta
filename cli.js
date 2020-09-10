#!/usr/bin/env node

const fs = require('fs-extra')
const serve = require('./serve')
const c = require('ansi-colors')
const sade = require('sade')

const { watch, build } = require('./')
const {
  PRESTA_DIR,
  PRESTA_PAGES,
  PRESTA_WRAPPED_PAGES
} = require('./lib/constants')
const { createConfigFromCLI } = require('./lib/createConfigFromCLI')
const { safeConfigFilepath } = require('./lib/safeConfigFilepath')
const { safeRequire } = require('./lib/safeRequire')
const { log } = require('./lib/log')
const { fileCache } = require('./lib/fileCache')

const prog = sade('presta')

prog
  .version('1.0.5')
  .option('--config, -c', 'Path to a config file.', 'presta.config.js')
  .option('--runtime, -r', 'Path to a runtime file.', 'presta.runtime.js')
  .option('--clean, -e', 'Clean build directory of cached files.')

// just make sure it's there
fs.ensureDirSync(PRESTA_DIR)

prog
  .command('watch [pages] [output]')
  .describe('Watch and build a glob of pages to an output directory.')
  .option('--incremental, -n', 'Only build changed files.', true)
  .example(`watch`)
  .example(`watch pages/**/*.js build`)
  .example(`watch -c presta.config.js`)
  .action(async (pages, output, opts) => {
    console.clear()

    // clear entire dir
    if (opts.clean) fs.emptyDirSync(PRESTA_DIR)

    const config = createConfigFromCLI({
      ...opts,
      pages,
      output
    })

    log(
      `${c.blue('presta watch')} ${
        config.incremental ? c.gray('awaiting changes') : ''
      }\n`
    )

    watch(config)
  })

prog
  .command(
    'build [pages] [output]',
    'Build a glob of pages to an output directory. Defaults to `./build`.',
    { default: true }
  )
  .option('--incremental, -n', 'Only build changed files.', false)
  .example(`build`)
  .example(`build pages/**/*.js build`)
  .example(`build -c presta.config.js`)
  .action(async (pages, output, opts) => {
    console.clear()

    // clear entire dir
    if (opts.clean) fs.emptyDirSync(PRESTA_DIR)

    const config = createConfigFromCLI({
      ...opts,
      pages,
      output
    })

    log(`${c.blue('presta build')}\n\n  ${c.gray('compiling...')}\n`)

    const st = Date.now()

    await build(config)

    const time = Date.now() - st
    log(`\n${c.blue('built')} ${c.gray(`in ${time}ms`)}`)
  })

prog
  .command('serve [dir]')
  .describe(
    'Serve a directory of files. By default serves the output specified in your presta config file.'
  )
  .option('--livereload, -l', 'Only build changed files.', true)
  .example(`serve`)
  .example(`serve build`)
  .example(`serve -c presta.config.js`)
  .action((dir, opts) => {
    console.clear()
    const config = safeRequire(safeConfigFilepath(opts.config), {})
    return serve(dir || config.output)
  })

prog
  .command('clear <keys>')
  .describe(
    'Pass a comma separated list to clear specific keys from the loader cache.'
  )
  .example(`cache clear pages,photos`)
  .action(raw => {
    const keys = raw.split(/,/)

    log(c.blue('presta clear\n'))

    for (const k of keys) {
      fileCache.removeKey(k)
      fileCache.save(true)
      log(`  ${c.gray(k)}`)
    }

    log(c.blue('\ncleared'))
  })

prog.parse(process.argv)
