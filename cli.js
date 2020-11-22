import fs from 'fs-extra'
import c from 'ansi-colors'
import sade from 'sade'

import pkg from './package.json'

import { TMP_DIR, CONFIG_DEFAULT } from './lib/constants'
import { safeConfigFilepath } from './lib/safeConfigFilepath'
import { safeRequire } from './lib/safeRequire'
import { log } from './lib/log'
import { fileCache } from './lib/fileCache'
import * as globalConfig from './lib/config'
import { timer } from './lib/timer'
import { watch } from './lib/watch'
import { build } from './lib/build'

import { serve } from './serve'

const prog = sade('presta')

prog
  .version(pkg.version)
  .option('--config, -c', 'Path to a config file.', './' + CONFIG_DEFAULT)
  .option('--jsx', 'Specify a JSX pragma.', 'h')
  .option('--assets, -a', 'Specify static asset directory.', './public')

// just make sure it's there
fs.ensureDirSync(TMP_DIR)

prog
  .command(
    'build [pages] [output]',
    'Render page(s) to output directory (defaults to ./build)',
    { default: true }
  )
  .example(`build`)
  .example(`build pages/**/*.js build`)
  .example(`build -c ${CONFIG_DEFAULT}`)
  .action(async (pages, output, opts) => {
    console.clear()

    const config = globalConfig.create({
      ...opts,
      pages,
      output
    })

    log(`${c.blue('presta build')}\n`)

    const time = timer()

    await build(config, {
      onRenderStart () {},
      onRenderEnd ({ count }) {
        log(`\n${c.blue('built')} ${count} files ${c.gray(`in ${time()}`)}\n`)
      }
    })
  })

prog
  .command('watch [pages] [output]')
  .option('--no-serve, -n', `Don't serve output directory`, false)
  .describe('Watch and build a glob of pages to an output directory.')
  .example(`watch`)
  .example(`watch pages/**/*.js build`)
  .example(`watch -c ${CONFIG_DEFAULT}`)
  .action(async (pages, output, opts) => {
    console.clear()

    const config = globalConfig.create({
      ...opts,
      pages,
      output
    })

    if (!opts.n) {
      const server = await serve(config, { noBanner: true })

      log(
        `${c.blue('presta watch')}${
          !opts.n ? ` – http://localhost:${server.port}` : ''
        }\n`
      )
    } else {
      log(`${c.blue('presta watch')}\n`)
    }

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
  .example(`serve -c ${CONFIG_DEFAULT}`)
  .action((dir, opts) => {
    console.clear()
    const config = safeRequire(safeConfigFilepath(opts.config), {})
    return serve(dir || config.output || 'build', {})
  })

prog.parse(process.argv)
