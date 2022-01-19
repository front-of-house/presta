import fs from 'fs'
import path from 'path'
import { mkdir } from 'mk-dirs/sync'
import { createPlugin, logger, HookPostBuildPayload } from 'presta'
import { build as esbuild } from 'esbuild'
import { timer } from '@presta/utils/timer'

import { Options } from './types'

export async function onPostBuild(props: HookPostBuildPayload, options: Options) {
  const { output } = props
  const filepath = path.join(output, 'server.js')

  mkdir(output)

  fs.writeFileSync(
    filepath,
    `import { adapter } from '@presta/adapter-node/dist/adapter';
export default adapter(${JSON.stringify(props)}, ${JSON.stringify(options)});`,
    'utf8'
  )

  await esbuild({
    entryPoints: [filepath],
    outdir: output,
    platform: 'node',
    target: ['node12'],
    minify: true,
    allowOverwrite: true, // it will be overwritten
    format: 'cjs',
  })
}

export default createPlugin((options: Partial<Options> = {}) => {
  const opts = Object.assign({ port: 4000 }, options)
  const time = timer()

  return async function plugin(config, hooks) {
    logger.debug({
      label: '@presta/adapter-node',
      message: `init`,
    })

    hooks.onPostBuild(async (props) => {
      /* c8 ignore start */
      await onPostBuild(props, opts)

      logger.info({
        label: '@presta/adapter-node',
        message: `complete`,
        duration: time(),
      })
      /* c8 ignore stop */
    })
  }
})
