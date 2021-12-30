#!/usr/bin/env node

import sade from 'sade'

import pkg from '../package.json'

import { buildCommand, devCommand, serveCommand } from './cli'
import { defaultConfigFilepath } from './config'
import { Env } from './constants'

export function registerRuntime(options = {}) {
  require('module-alias').addAliases({
    '@': process.cwd(),
    'presta:internal': __dirname, // TODO wherever this is running from
  })

  require('esbuild-register/dist/node').register(options)
}

const program = sade('presta')

program
  .version(pkg.version)
  // do not provide default config here
  .option('--config, -c', `Path to a config file.  (default ${defaultConfigFilepath})`)
  .option('--output, -o', `Specify output directory for built files.  (default ./build)`)
  .option('--assets, -a', `Specify static asset directory.  (default ./public)`)
  .option('--debug, -d', `Enable debug mode (prints more logs)`)
  .example(`dev index.jsx -o dist`)
  .example(`dev 'pages/*.tsx' -o static`)
  .example(`'pages/*.tsx'`)
  .example(`-c site.json`)
  .example(`serve -p 8080`)

program
  .command('build', 'Build project to output directory.', { default: true })
  .example(``)
  .example(`files/**/*.js`)
  .example(`-c ${defaultConfigFilepath}`)
  .action((options) => {
    process.env.PRESTA_ENV = Env.PRODUCTION
    process.env.PRESTA_DEBUG = options.debug ? 'debug' : ''
    console.clear()
    registerRuntime()
    buildCommand(options)
  })

program
  .command('dev', 'Start Presta dev server and watch files', { alias: 'watch' })
  .option('--port, -p', `Port to run the local server.  (default 4000)`)
  .option('--no-serve, -n', `Do not run local dev server.  (default false)`)
  .describe('Watch project and build to output directory.')
  .example(`dev`)
  .example(`dev ./files/**/*.js`)
  .example(`dev ./files/**/*.js -o ./out`)
  .example(`dev -c ${defaultConfigFilepath}`)
  .action((options) => {
    process.env.PRESTA_ENV = Env.DEVELOPMENT
    process.env.PRESTA_DEBUG = options.debug ? 'debug' : ''
    console.clear()
    registerRuntime()
    devCommand(options)
  })

program
  .command('serve')
  .option('--port, -p', `Port to run the local server.  (default 4000)`)
  .describe('Serve built files, lambdas, and static assets.')
  .example(`serve`)
  .example(`serve -o ./out -p 8080`)
  .example(`serve -c ${defaultConfigFilepath}`)
  .action(async (options) => {
    process.env.PRESTA_ENV = Env.DEVELOPMENT
    process.env.PRESTA_DEBUG = options.debug ? 'debug' : ''
    console.clear()
    registerRuntime()
    serveCommand(options)
  })

program.parse(process.argv)
