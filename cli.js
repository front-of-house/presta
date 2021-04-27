require('core-js/stable')
require('regenerator-runtime/runtime')

const sade = require('sade')
const exit = require('exit')
const c = require('ansi-colors')

const pkg = require('./package.json')

const { CONFIG_DEFAULT } = require('./lib/constants')
const { log } = require('./lib/log')
const globalConfig = require('./lib/config')
const { watch } = require('./lib/watch')
const { build } = require('./lib/build')
const { serve } = require('./lib/serve')

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

prog
  .command(
    'build [files] [output]',
    'Render files(s) to output directory (defaults to ./build)',
    { default: true }
  )
  .example(`build`)
  .example(`build files/**/*.js build`)
  .example(`build -c ${CONFIG_DEFAULT}`)
  .action(async (files, output, opts) => {
    console.clear()

    warnOnBadGlob(output)

    const config = globalConfig.create({
      ...opts,
      files,
      output,
      env: 'production'
    })

    log(`${c.blue('~ presta build')}\n`)

    await build(config)
  })

prog
  .command('watch [files] [output]')
  .option('--no-serve, -n', `Don't serve output directory`, false)
  .describe('Watch and build page(s) to output directory')
  .example(`watch`)
  .example(`watch files/**/*.js build`)
  .example(`watch -c ${CONFIG_DEFAULT}`)
  .action(async (files, output, opts) => {
    console.clear()

    warnOnBadGlob(output)

    const config = globalConfig.create({
      ...opts,
      files,
      output,
      env: 'development'
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
