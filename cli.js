import sade from 'sade'
import exit from 'exit'
import c from 'ansi-colors'

import pkg from './package.json'

import { CONFIG_DEFAULT } from './lib/constants'
import { log } from './lib/log'
import * as globalConfig from './lib/config'
import { watch } from './lib/watch'
import { build } from './lib/build'

import { serve } from './serve'

function warnOnBadGlob (output) {
  if (/\.(js|jsx|ts|tsx)$/.test(output)) {
    const msg = `  Your specified output '${output}' looks like a file. Maybe you need surround your file glob with quotes?`
    const issue = `  More info here: https://github.com/sure-thing/presta/issues/15`
    log(`${c.yellow(`presta`)}\n\n${msg}\n\n${issue}\n`)
    exit()
  }
}

const prog = sade('presta')

prog
  .version(pkg.version)
  .option(
    '--config, -c',
    `Path to a config file.  (default /${CONFIG_DEFAULT})`
  )
  .option('--assets, -a', `Specify static asset directory.  (default /public)`)
  .option('--jsx', 'Specify a JSX pragma.', 'h')
  .option('--cwd, -d', 'Set the current working directory.')

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

    warnOnBadGlob(output)

    const config = globalConfig.create({
      ...opts,
      pages,
      output
    })

    log(`${c.blue('~ presta build')}\n`)

    await build(config)
  })

prog
  .command('watch [pages] [output]')
  .option('--no-serve, -n', `Don't serve output directory`, false)
  .describe('Watch and build page(s) to output directory')
  .example(`watch`)
  .example(`watch pages/**/*.js build`)
  .example(`watch -c ${CONFIG_DEFAULT}`)
  .action(async (pages, output, opts) => {
    console.clear()

    warnOnBadGlob(output)

    const config = globalConfig.create({
      ...opts,
      pages,
      output
    })

    if (!opts.n) {
      const server = await serve(config, { noBanner: true })

      log(
        `${c.blue('~ presta watch')}${
          !opts.n ? ` – http://localhost:${server.port}` : ''
        }\n`
      )
    } else {
      log(`${c.blue('~ presta watch')}\n`)
    }

    watch(config)
  })

prog.parse(process.argv)
