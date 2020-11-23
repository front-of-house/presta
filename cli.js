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
  .option('--assets, -a', 'Specify static asset directory.', './public')
  .option('--jsx', 'Specify a JSX pragma.', 'h')

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

    const time = timer()

    const config = globalConfig.create({
      ...opts,
      pages,
      output
    })

    log(`${c.blue('presta build')}\n`)

    await build(config)

    log('') // leave a 1-line buffer

    log(`  ${c.blue(`build complete`)} ${c.gray(`in ${time()}`)}`)

    log('') // leave a 1-line buffer
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

prog.parse(process.argv)
