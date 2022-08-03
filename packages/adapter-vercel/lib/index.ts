import fs from 'fs-extra'
import path from 'path'
import merge from 'deep-extend'
import toRegExp from 'regexparam'
import { createPlugin, PluginContext } from 'presta'
import { build as esbuild } from 'esbuild'
import { timer } from 'presta/utils/timer'
import { requireSafe } from 'presta/utils/requireSafe'

import pkg from '../package.json'

const PLUGIN = `${pkg.name}@${pkg.version}`

export const vercelConfig = {
  build: {
    env: {
      ENABLE_FILE_SYSTEM_API: '1',
    },
  },
}

export const routesManifest: {
  version: 3
  basePath: string
  pages404: false
  dynamicRoutes: {
    page: string
    regex: string
  }[]
} = {
  version: 3,
  basePath: '',
  pages404: false,
  dynamicRoutes: [],
}

export async function generateRoutes(ctx: PluginContext) {
  const functionsFiles = ctx.getManifest().functions
  const prestaOutputDir = ctx.getOutputDir()
  const manifest = Object.assign({}, routesManifest)

  for (const source of Object.values(functionsFiles)) {
    const filename = /^\/$/.test(source.route) ? 'index' : path.basename(source.dest, '.js')
    const tmpfile = path.join(prestaOutputDir, './.vercel', filename + '.js')
    const { pattern } = toRegExp(source.route)

    fs.outputFileSync(
      tmpfile,
      `import { adapter } from '@presta/adapter-vercel/dist/runtime';
import { handler } from '${source.dest}';
export default adapter(handler);`
    )

    await esbuild({
      entryPoints: [tmpfile],
      outdir: path.join(process.cwd(), './.output/server/pages'),
      platform: 'node',
      target: ['node12'],
      minify: true,
      allowOverwrite: true,
      bundle: true,
    })

    manifest.dynamicRoutes.push({
      page: '/' + filename,
      regex: pattern.toString().slice(1).slice(0, -2).replace(/\\/g, ''),
    })
  }

  ctx.logger.debug(`${PLUGIN} manifest generated ${JSON.stringify(manifest)}`)

  fs.outputFileSync(path.join(process.cwd(), './.output/routes-manifest.json'), JSON.stringify(manifest, null, '  '))
}

export function mergeVercelConfig() {
  const config = requireSafe(path.join(process.cwd(), 'vercel.json'))
  return merge(config, vercelConfig)
}

export async function onPostBuild(ctx: PluginContext) {
  const time = timer()
  const manifest = ctx.getManifest()
  const staticOutputDir = ctx.getStaticOutputDir()

  if (fs.existsSync(staticOutputDir)) fs.copySync(staticOutputDir, path.join(process.cwd(), './.output/static'))
  if (Object.keys(manifest.functions).length) await generateRoutes(ctx)

  ctx.logger.info(`${PLUGIN} complete`, { duration: time() })
}

export default createPlugin(() => {
  return function plugin(ctx) {
    ctx.logger.debug(`${PLUGIN} initialized`)

    // cleanup
    fs.removeSync(path.join(process.cwd(), './.output'))
    fs.outputFileSync(path.join(process.cwd(), 'vercel.json'), JSON.stringify(mergeVercelConfig(), null, '  '))

    ctx.events.on('buildComplete', () => {
      ctx.logger.debug(`${PLUGIN} received event buildComplete`)
      /* c8 ignore next */
      onPostBuild(ctx)
    })

    return {
      name: PLUGIN,
    }
  }
})
