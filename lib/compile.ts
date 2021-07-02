import path from 'path'
import { build } from 'esbuild'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'

import type { Presta } from '../'

export function compile (config: Presta) {
  return build({
    entryPoints: [path.join(config.merged.output, OUTPUT_DYNAMIC_PAGES_ENTRY)],
    outfile: path.join(config.merged.output, 'functions', 'presta.js'),
    bundle: true,
    platform: 'node',
    target: ['node12'],
    minify: true,
    allowOverwrite: true
  })
}
