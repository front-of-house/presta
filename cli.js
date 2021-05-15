#!/usr/bin/env node

const fs = require('fs-extra')
const sade = require('sade')
const exit = require('exit')
const c = require('ansi-colors')

const pkg = require('./package.json')

const { CONFIG_DEFAULT } = require('./lib/constants')
const { log } = require('./lib/log')
const { createConfig, getConfigFile } = require('./lib/config')
const { watch } = require('./lib/watch')
const { build } = require('./lib/build')
const { serve } = require('./lib/serve')

function registerRuntime (options = {}) {
  require('module-alias').addAliases({
    '@': process.cwd(),
    'presta:internal': __dirname // wherever this is running from
  })

  require('esbuild-register/dist/node').register(options)
}

const prog = sade('presta')

prog
  .version(pkg.version)
  .option(
    '--config, -c',
    `Path to a config file — defaults to ${CONFIG_DEFAULT}`
  )
  .option(
    '--output, -o',
    `Specify output directory for built files — defaults to ./build`
  )
  .option(
    '--assets, -a',
    `Specify static asset directory — defaults to ./public`
  )

prog
  .command('build', 'Render files(s) to output directory.', { default: true })
  .example(`build`)
  .example(`build files/**/*.js`)
  .example(`build -c ${CONFIG_DEFAULT}`)
  .action(async opts => {
    process.env.PRESTA_ENV = 'production'

    registerRuntime()

    console.clear()

    const config = createConfig({
      env: 'production',
      configFile: getConfigFile(opts.config),
      cliArgs: {
        ...opts,
        files: opts._
      }
    })

    fs.emptyDirSync(config.merged.output)

    log(`${c.blue('~ presta build')}\n`)

    await build(config)
  })

prog
  .command('watch')
  .option('--no-serve, -n', `Do not run local dev server.`, false)
  .describe('Watch and build files(s) to output directory')
  .example(`watch`)
  .example(`watch ./files/**/*.js`)
  .example(`watch ./files/**/*.js -o ./out`)
  .example(`watch -c ${CONFIG_DEFAULT}`)
  .action(async opts => {
    process.env.PRESTA_ENV = 'development'

    registerRuntime()

    console.clear()

    const config = createConfig({
      env: 'development',
      configFile: getConfigFile(opts.config),
      cliArgs: {
        ...opts,
        files: opts._
      }
    })

    fs.emptyDirSync(config.merged.output)

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
