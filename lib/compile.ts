import path from 'path'
import { buildSync } from 'esbuild'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import config from './types/config'

export const compile = (config: config) => {
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
