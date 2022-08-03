#!/usr/bin/env node

import sade from 'sade'
import { register as esbuild } from 'esbuild-register/dist/node'

// @ts-ignore
import pkg from '../package.json'
import { defaultJSConfigFilepath, findAndParseConfigFile, mergeConfig, PrestaCliArgs, Presta } from './core'

esbuild()

const program = sade('presta')

program
  .version(pkg.version)
  // do not provide default config here
  .option('--config, -c', `Path to a config file.  (default ${defaultJSConfigFilepath})`)
  .option('--staticOutputDir', `Specify output directory for built static files.  (default ./.presta/static/)`)
  .option(
    '--functionsOutputDir',
    `Specify output directory for built serverless functions.  (default ./.presta/functions/)`
  )
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
  .example(`-c ${defaultJSConfigFilepath}`)
  .action(async (cliArgs: PrestaCliArgs) => {
    process.env.PRESTA_ENV = 'Production' // TODO
    process.env.PRESTA_DEBUG = cliArgs.debug ? 'debug' : ''
    console.clear()
    const config = mergeConfig(findAndParseConfigFile(cliArgs.config), cliArgs)
    await new Presta(config).build()
  })

program
  .command('dev', 'Start Presta dev server and watch files', { alias: 'watch' })
  .option('--port, -p', `Port to run the local server.  (default 4000)`)
  .option('--serve, -s', `Run local dev server.  (default true)`)
  .describe('Watch project and build to output directory.')
  .example(`dev`)
  .example(`dev ./files/**/*.js`)
  .example(`dev ./files/**/*.js -o ./out`)
  .example(`dev -c ${defaultJSConfigFilepath}`)
  .action(async (cliArgs: PrestaCliArgs) => {
    process.env.PRESTA_ENV = 'Development' // TODO
    process.env.PRESTA_DEBUG = cliArgs.debug ? 'debug' : ''
    console.clear()
    const config = mergeConfig(findAndParseConfigFile(cliArgs.config), cliArgs)
    new Presta(config).dev()
  })

program
  .command('serve')
  .option('--port, -p', `Port to run the local server.  (default 4000)`)
  .describe('Serve built files, lambdas, and static assets.')
  .example(`serve`)
  .example(`serve -o ./out -p 8080`)
  .example(`serve -c ${defaultJSConfigFilepath}`)
  .action(async (cliArgs: PrestaCliArgs) => {
    process.env.PRESTA_ENV = 'Development' // TODO
    process.env.PRESTA_DEBUG = cliArgs.debug ? 'debug' : ''
    console.clear()
    const config = mergeConfig(findAndParseConfigFile(cliArgs.config), cliArgs)
    new Presta(config).serve()
  })

program.parse(process.argv)
