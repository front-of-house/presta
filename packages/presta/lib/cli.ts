#!/usr/bin/env node

import fs from 'fs-extra'
import sade from 'sade'

import pkg from '../package.json'

import * as logger from './log'
import { createConfig, getConfigFile } from './config'
import { watch } from './watch'
import { build } from './build'
import { serve } from './serve'

import { Env } from './types'

const prog = sade('presta')
const CONFIG_DEFAULT = 'presta.config.js'

function registerRuntime(options = {}) {
  require('module-alias').addAliases({
    '@': process.cwd(),
    'presta:internal': __dirname, // wherever this is running from
  })

  require('esbuild-register/dist/node').register(options)
}

prog
  .version(pkg.version)
  // don't provide default config here
  .option('--config, -c', `Path to a config file — defaults to ${CONFIG_DEFAULT}`)
  .option('--output, -o', `Specify output directory for built files — defaults to ./build`)
  .option('--assets, -a', `Specify static asset directory — defaults to ./public`)
  .option('--debug, -d', `Enable debug mode (prints more logs)`)

prog
  .command('build', 'Render files(s) to output directory.', { default: true })
  .example(`build`)
  .example(`build files/**/*.js`)
  .example(`build -c ${CONFIG_DEFAULT}`)
  .action(async (opts) => {
    registerRuntime()

    console.clear()

    const config = createConfig({
      env: Env.PRODUCTION,
      config: getConfigFile(opts.config, true),
      cli: {
        ...opts,
        files: opts._,
      },
    })

    fs.emptyDirSync(config.output)

    logger.raw(`${logger.colors.blue('presta build')}`)
    logger.newline()

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
  .action(async (opts) => {
    registerRuntime()

    console.clear()

    const config = createConfig({
      env: Env.DEVELOPMENT,
      config: getConfigFile(opts.config),
      cli: {
        ...opts,
        files: opts._,
      },
    })

    fs.emptyDirSync(config.output)

    if (!opts.n) {
      const server = await serve(config)

      logger.raw(`${logger.colors.blue('presta dev')} - http://localhost:${server.port}`)
      logger.newline()
    } else {
      logger.info({
        label: 'dev',
      })
      logger.newline()
    }

    watch(config)
  })

prog
  .command('serve')
  .describe('Serve built files.')
  .example(`serve`)
  .example(`serve -o ./out`)
  .example(`watch -c ${CONFIG_DEFAULT}`)
  .action(async (opts) => {
    console.clear()

    const config = createConfig({
      env: Env.PRODUCTION,
      config: getConfigFile(opts.config),
      cli: opts,
    })
    const server = await serve(config)

    logger.raw(`${logger.colors.blue('presta serve')} - http://localhost:${server.port}`)
    logger.newline()
  })

prog.parse(process.argv)
