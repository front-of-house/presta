#!/usr/bin/env node

import fs from 'fs-extra'
import sade from 'sade'

import pkg from '../package.json'

import * as logger from './log'
import { createConfig, getConfigFile } from './config'
import { watch } from './watch'
import { build } from './build'
import { serve } from './serve'
import { Env } from './constants'

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
  // do not provide default config here
  .option('--config, -c', `Path to a config file.  (default ${CONFIG_DEFAULT})`)
  .option('--output, -o', `Specify output directory for built files.  (default ./build)`)
  .option('--assets, -a', `Specify static asset directory.  (default ./public)`)
  .option('--debug, -d', `Enable debug mode (prints more logs)`)
  .example(`dev index.jsx -o dist`)
  .example(`dev 'pages/*.tsx' -o static`)
  .example(`'pages/*.tsx'`)
  .example(`-c site.json`)
  .example(`serve -p 8080`)

prog
  .command('build', 'Build project to output directory.', { default: true })
  .example(``)
  .example(`files/**/*.js`)
  .example(`-c ${CONFIG_DEFAULT}`)
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
  .command('dev', 'Start Presta dev server and watch files', { alias: 'watch' })
  .option('--port, -p', `Port to run the local server.  (default 4000)`)
  .option('--no-serve, -n', `Do not run local dev server.  (default false)`)
  .describe('Watch project and build to output directory.')
  .example(`dev`)
  .example(`dev ./files/**/*.js`)
  .example(`dev ./files/**/*.js -o ./out`)
  .example(`dev -c ${CONFIG_DEFAULT}`)
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
  .option('--port, -p', `Port to run the local server.  (default 4000)`)
  .describe('Serve built files, lambdas, and static assets.')
  .example(`serve`)
  .example(`serve -o ./out -p 8080`)
  .example(`serve -c ${CONFIG_DEFAULT}`)
  .action(async (opts) => {
    registerRuntime()

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
