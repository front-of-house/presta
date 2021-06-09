#!/usr/bin/env node

import fs from 'fs-extra'
import sade from 'sade'
import exit from 'exit'
import c from 'ansi-colors'

import pkg from './package.json'

import { CONFIG_DEFAULT } from './lib/constants'
import { log } from './lib/log'
import { createConfig, getConfigFile } from './lib/config'
import { watch } from './lib/watch'
import { build } from './lib/build'
import { serve } from './lib/serve'

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
