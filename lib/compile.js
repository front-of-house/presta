const path = require('path')
const { buildSync } = require('esbuild')

const { OUTPUT_DYNAMIC_PAGES_ENTRY } = require('./constants')

/**
 * if one external package passed, turn it into an array
 * @param {object} cliArgs
 * @returns undefined | string[]
 */
function getExternalPackages (cliArgs) {
  if (!cliArgs.external) return undefined

  if (Array.isArray(cliArgs.external)) {
    return cliArgs.external
  }

  return [cliArgs.external]
}

function compile (config) {
  return buildSync({
    entryPoints: [path.join(config.merged.output, OUTPUT_DYNAMIC_PAGES_ENTRY)],
    outfile: path.join(config.merged.output, 'functions', 'presta.js'),
    bundle: true,
    platform: 'node',
    target: ['node12'],
    minify: true,
    allowOverwrite: true,
    external: getExternalPackages(config.cliArgs)
  })
}

module.exports = { compile }
