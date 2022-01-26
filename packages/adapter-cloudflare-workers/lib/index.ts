import fs from 'fs'
import path from 'path'
import { mkdir } from 'mk-dirs/sync'
import { createPlugin, logger, HookPostBuildPayload, Config } from 'presta'
import { build as esbuild } from 'esbuild'
import { timer } from '@presta/utils/timer'
import { requireSafe } from '@presta/utils/requireSafe'
import { parse } from 'toml'

function createWranglerConfig({ output }: Config) {
  const root = output.replace(process.cwd(), '').replace(/^\/+/, '')

  return `name = "presta-cloudflare-workers"
type = "javascript"

zone_id = ''
account_id = ''
route = ''
workers_dev = true
compatibility_date = "2022-01-22"

[site]
  bucket = '${root}/static'
  entry-point = '${root}'

[build]
  command = ''

[build.upload]
  format = 'service-worker'`
}

export function slugify(slug: string) {
  return slug.replace(/[^a-z]/gi, '')
}

export function getWranglerConfigPath() {
  return path.join(process.cwd(), 'wrangler.toml')
}

export function getWranglerConfig() {
  const wrangerConfigPath = getWranglerConfigPath()

  if (!fs.existsSync(wrangerConfigPath)) return {}

  try {
    return parse(fs.readFileSync(wrangerConfigPath, 'utf8'))
  } catch (e) {
    return {}
  }
}

export async function onPostBuild(props: HookPostBuildPayload) {
  const { output, functionsManifest: fns } = props
  const filepath = path.join(output, 'worker.js')

  mkdir(output)

  const imports = Object.entries(fns)
    .map(([route, filepath]) => {
      return `import * as ${slugify(filepath)} from "${filepath}"`
    })
    .join(';\n')
  const runtime = Object.entries(fns)
    .map(([route, filepath]) => {
      return `routes.push({ route: "${route}", module: ${slugify(filepath)} })`
    })
    .join(';\n')

  fs.writeFileSync(
    filepath,
    `import { adapter } from '@presta/adapter-cloudflare-workers/dist/adapter';
${imports}
const routes = [];
${runtime}
addEventListener("fetch", adapter(${JSON.stringify(props)}, routes));`,
    'utf8'
  )

  await esbuild({
    entryPoints: [filepath],
    outdir: output,
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    allowOverwrite: true, // it will be overwritten
    format: 'cjs',
    bundle: true,
  })
}

export default createPlugin(() => {
  const time = timer()
  const pkgpath = path.join(process.cwd(), 'package.json')
  const pkg = requireSafe(pkgpath)
  const wranglerConfigPath = getWranglerConfigPath()
  const prestaWranglerConfigPath = path.join(process.cwd(), 'presta-wrangler.toml')
  const wrangler = getWranglerConfig()
  const env = wrangler.vars || {}

  for (const v of Object.keys(env)) {
    // @ts-ignore
    globalThis[v] = env[v]
  }

  return async function plugin(config, hooks) {
    logger.debug({
      label: '@presta/adapter-cloudflare-workers',
      message: `init`,
    })

    const buildPkg = {
      private: true,
      name: pkg.name,
      main: 'worker.js',
    }
    const generatedWranglerConfig = createWranglerConfig(config)

    if (!fs.existsSync(wranglerConfigPath)) {
      fs.writeFileSync(wranglerConfigPath, generatedWranglerConfig, 'utf8')
    } else if (!fs.existsSync(prestaWranglerConfigPath)) {
      fs.writeFileSync(prestaWranglerConfigPath, generatedWranglerConfig, 'utf8')
    }

    hooks.onPostBuild(async (props) => {
      /* c8 ignore start */
      await onPostBuild(props)

      fs.writeFileSync(path.join(config.output, 'package.json'), JSON.stringify(buildPkg, null, '  '), 'utf8')

      logger.info({
        label: '@presta/adapter-cloudflare-workers',
        message: `complete`,
        duration: time(),
      })
      /* c8 ignore stop */
    })
  }
})
