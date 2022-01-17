import fs from 'fs-extra'
import path from 'path'
import merge from 'deep-extend'
import toRegExp from 'regexparam'
import { createPlugin, logger, HookPostBuildPayload } from 'presta'
import { build as esbuild } from 'esbuild'

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

export function requireSafe(mod: string) {
  try {
    return require(mod)
  } catch (e) {
    return {}
  }
}

export async function generateRoutes(
  prestaOutput: HookPostBuildPayload['output'],
  prestaFunctionsManifest: HookPostBuildPayload['functionsManifest']
) {
  const manifest = Object.assign({}, routesManifest)

  for (const route of Object.keys(prestaFunctionsManifest)) {
    const source = prestaFunctionsManifest[route]
    const filename = /^\/$/.test(route) ? 'index' : path.basename(source, '.js')
    const tmpfile = path.join(prestaOutput, './.vercel', filename + '.js')
    const { pattern } = toRegExp(route)

    fs.outputFileSync(
      tmpfile,
      `import { adapter } from '@presta/adapter-vercel/dist/adapter';
import { handler } from '${source}';
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

  logger.debug({
    label: '@presta/adapter-vercel',
    message: `manifest generated ${JSON.stringify(manifest)}`,
  })

  fs.outputFileSync(path.join(process.cwd(), './.output/routes-manifest.json'), JSON.stringify(manifest, null, '  '))
}

export function mergeVercelConfig() {
  const config = requireSafe(path.join(process.cwd(), 'vercel.json'))
  return merge(config, vercelConfig)
}

export async function onPostBuild(props: HookPostBuildPayload) {
  const { output: prestaOutput, staticOutput, functionsManifest } = props

  fs.copySync(staticOutput, path.join(process.cwd(), './.output/static'))
  if (Object.keys(functionsManifest).length) await generateRoutes(prestaOutput, functionsManifest)

  logger.info({
    label: '@presta/adapter-vercel',
    message: `complete`,
  })
}

export default createPlugin(() => {
  return async function plugin(config, hooks) {
    logger.debug({
      label: '@presta/adapter-vercel',
      message: `init`,
    })

    fs.outputFileSync(path.join(process.cwd(), 'vercel.json'), JSON.stringify(mergeVercelConfig(), null, '  '))

    hooks.onPostBuild((props) => {
      /* c8 ignore next */
      onPostBuild(props)
    })
  }
})
