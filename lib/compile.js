const path = require('path')
const { buildSync } = require('esbuild')

const { OUTPUT_DYNAMIC_PAGES_ENTRY } = require('./constants')

function compile (config) {
  return buildSync({
    entryPoints: [path.join(config.merged.output, OUTPUT_DYNAMIC_PAGES_ENTRY)],
    outfile: path.join(config.merged.output, 'functions', 'presta.js'),
    bundle: true,
    platform: 'node',
    target: ['node12'],
    minify: true,
    allowOverwrite: true
  })
}

module.exports = { compile }
