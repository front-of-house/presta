import fs from 'fs-extra'
import path from 'path'
import { build as esbuild } from 'esbuild'
import { createPlugin, PluginContext } from 'presta'
import { timer } from 'presta/utils/timer'

import pkg from '../package.json'
import { Options } from './types'

const PLUGIN = `${pkg.name}@${pkg.version}`

export async function onPostBuild(ctx: PluginContext, options: Options) {
  const outputDir = ctx.getOutputDir()
  const filepath = path.join(outputDir, 'presta-node.js')
  const context = {
    staticOutputDir: ctx.getStaticOutputDir(),
    functionsOutputDir: ctx.getFunctionsOutputDir(),
    manifest: ctx.getManifest(),
  }

  fs.outputFileSync(
    filepath,
    `import { adapter } from '@presta/adapter-node/dist/runtime';
export default adapter(${JSON.stringify(context)}, ${JSON.stringify(options)});`,
    'utf8'
  )

  await esbuild({
    entryPoints: [filepath],
    outdir: outputDir,
    platform: 'node',
    target: ['node12'],
    minify: true,
    allowOverwrite: true, // it will be overwritten
    format: 'cjs',
  })
}

export default createPlugin((options: Partial<Options> = {}) => {
  const opts = Object.assign({ port: 4000 }, options)

  return function plugin(ctx) {
    ctx.logger.debug(`${PLUGIN} initialized`)

    ctx.events.on('buildComplete', async () => {
      const time = timer()
      /* c8 ignore start */
      await onPostBuild(ctx, opts)

      ctx.logger.info(`${PLUGIN} complete`, { duration: time() })
      /* c8 ignore stop */
    })

    return {
      name: PLUGIN,
    }
  }
})
