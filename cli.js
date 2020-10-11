import fs from 'fs-extra'
import c from 'ansi-colors'
import sade from 'sade'

import pkg from './package.json'
import serve from './serve'
import { watch, build } from './'
import { PRESTA_DIR, PRESTA_CONFIG_DEFAULT } from './lib/constants'
import { createConfigFromCLI } from './lib/createConfigFromCLI'
import { safeConfigFilepath } from './lib/safeConfigFilepath'
import { safeRequire } from './lib/safeRequire'
import { log } from './lib/log'
import { fileCache } from './lib/fileCache'

const prog = sade('presta')

prog
  .version(pkg.version)
  .option('--config, -c', 'Path to a config file.', PRESTA_CONFIG_DEFAULT)
  .option('--clean, -e', 'Clean build directory of cached files.')
  .option('--jsx', 'Specify a JSX pragma.', 'h')

// just make sure it's there
fs.ensureDirSync(PRESTA_DIR)

prog
  .command(
    'build [pages] [output]',
    'Build a glob of pages to an output directory. Defaults to `./build`.',
    { default: true }
  )
  .example(`build`)
  .example(`build pages/**/*.js build`)
  .example(`build -c ${PRESTA_CONFIG_DEFAULT}`)
  .action(async (pages, output, opts) => {
    console.clear()

    // clear entire dir
    if (opts.clean) fs.emptyDirSync(PRESTA_DIR)

    const config = createConfigFromCLI({
      ...opts,
      pages,
      output
    })

    log(`${c.blue('presta build')}\n`)

    const st = Date.now()

    await build(config, {
      onRenderStart () {},
      onRenderEnd ({ count }) {
        const time = Date.now() - st
        log(`\n${c.blue('built')} ${count} files ${c.gray(`in ${time}ms`)}`)
      }
    })
  })

prog
  .command('watch [pages] [output]')
  .describe('Watch and build a glob of pages to an output directory.')
  .example(`watch`)
  .example(`watch pages/**/*.js build`)
  .example(`watch -c ${PRESTA_CONFIG_DEFAULT}`)
  .action(async (pages, output, opts) => {
    console.clear()

    // clear entire dir
    if (opts.clean) fs.emptyDirSync(PRESTA_DIR)

    const config = createConfigFromCLI({
      ...opts,
      pages,
      output
    })

    log(`${c.blue('presta watch')}\n`)

    watch(config)
  })

prog
  .command('serve [dir]')
  .describe(
    'Serve a directory of files. By default serves the output specified in your presta config file.'
  )
  .option('--livereload, -l', 'Only build changed files.', true)
  .example(`serve`)
  .example(`serve build`)
  .example(`serve -c ${PRESTA_CONFIG_DEFAULT}`)
  .action((dir, opts) => {
    console.clear()
    const config = safeRequire(safeConfigFilepath(opts.config), {})
    return serve(dir || config.output || 'build')
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
