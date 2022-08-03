import assert from 'assert'
import fs from 'fs-extra'
import path from 'path'
import { parse as toml } from 'toml'
// @ts-ignore
import { parseFileRedirects } from 'netlify-redirect-parser'
// @ts-ignore
import filewatcher from 'filewatcher'
import { createPlugin, PluginContext, Manifest, Mode } from 'presta'
import { timer } from 'presta/utils/timer'

import pkg from './package.json'

// TODO do I need more here?
export type NetlifyConfig = {
  build: {
    publish: string
    functions?: string
  }
}

export type NetlifyRedirect = {
  from: string
  to: string
  status: number
  force: boolean
  query: { [param: string]: string }
  conditions: { [param: string]: string }
  signed: string | undefined
}

const PLUGIN = `${pkg.name}@${pkg.version}`

export function getNetlifyConfig(configFilepath: string): Partial<NetlifyConfig> | undefined {
  const raw = fs.readFileSync(configFilepath, 'utf8')
  const json = toml(raw)
  return JSON.parse(JSON.stringify(json))
}

export function validateAndNormalizeNetlifyConfig(config?: Partial<NetlifyConfig>): NetlifyConfig {
  assert(!!config, `Missing required netlify.toml config file`)
  assert(!!config.build, `Missing required netlify.toml config: build`)

  const publish = toAbsolutePath(process.cwd(), config.build.publish)

  assert(!!publish, `Missing required netlify.toml config: build.publish`)

  const functions = toAbsolutePath(process.cwd(), config.build.functions)

  return {
    build: {
      publish,
      functions,
    },
  }
}

export function toAbsolutePath(cwd: string, file?: string) {
  return file ? path.join(cwd, file) : undefined
}

export function toRelativePath(cwd: string, filepath: string) {
  return path.relative(cwd, filepath)
}

export function normalizeNetlifyRoute(route: string) {
  route = route.replace(/^\*/, '/*')
  route = route.replace(/^\/\//, '/')
  return route
}

export function prestaRoutesToNetlifyRedirects(files: Manifest['functions']): NetlifyRedirect[] {
  return Object.values(files).map((file) => ({
    from: normalizeNetlifyRoute(file.route),
    to: `/.netlify/functions/${path.basename(file.dest, '.js')}`,
    status: 200,
    force: false,
    query: {},
    conditions: {},
    signed: undefined,
  }))
}

export function generateRedirectsString(redirects: NetlifyRedirect[]) {
  return redirects.map((r) => [r.from, r.to, `${r.status}${r.force ? '!' : ''}`].join(' ')).join('\n')
}

export async function getUserConfiguredRedirects(dir: string) {
  return (
    [
      ...(await parseFileRedirects(path.join(process.cwd(), '_redirects'))),
      ...(await parseFileRedirects(path.join(dir, '_redirects'))),
    ] as NetlifyRedirect[]
  ).reduce((redirects, redirect) => {
    if (redirects.find((r) => r.from === redirect.from)) return redirects
    return redirects.concat(redirect)
  }, [] as NetlifyRedirect[])
}

export async function onPostBuild(config: NetlifyConfig, ctx: PluginContext) {
  const { publish: publishDir, functions: functionsDir } = config.build
  const time = timer()
  const manifest = ctx.getManifest()
  const userConfiguredRedirects = await getUserConfiguredRedirects(publishDir)
  const staticOutputDir = ctx.getStaticOutputDir()
  const functionsOutputDir = ctx.getFunctionsOutputDir()

  if (Object.keys(manifest.statics).length) {
    if (publishDir === staticOutputDir) {
      ctx.logger.debug(`${PLUGIN} Netlify publish directory matches static output directory`)
    } else {
      fs.copySync(ctx.getStaticOutputDir(), publishDir)
      ctx.logger.debug(`${PLUGIN} copying static files`)
    }
  }

  if (Object.keys(manifest.functions).length) {
    if (!functionsDir) {
      ctx.logger.warn(
        `${PLUGIN} detected built functions, but Netlify config does not specify an functions output directory.`
      )
    } else {
      const prestaRedirects = prestaRoutesToNetlifyRedirects(ctx.getManifest().functions)
      const combinedRedirects = userConfiguredRedirects.concat(prestaRedirects)
      const redirectsFilepath = path.join(config.build.publish, '_redirects')

      // TODO overwrites, right?
      fs.outputFileSync(redirectsFilepath, generateRedirectsString(combinedRedirects), 'utf8')
      ctx.logger.debug(`${PLUGIN} writing redirects`)

      if (functionsDir === functionsOutputDir) {
        ctx.logger.debug(`${PLUGIN} Netlify functions directory matches functions output directory`)
      } else {
        fs.copySync(ctx.getFunctionsOutputDir(), functionsDir)
        ctx.logger.debug(`${PLUGIN} copying functions`)
      }
    }
  }

  ctx.logger.info(`${PLUGIN} complete`, { duration: time() })
}

export default createPlugin(() => {
  return (ctx) => {
    const startupTime = timer()

    ctx.logger.debug(`${PLUGIN} initialized`)

    const netlifyConfigFilepath = path.join(ctx.cwd, 'netlify.toml')

    if (!fs.existsSync(netlifyConfigFilepath)) {
      ctx.logger.debug(`${PLUGIN} Netlify config not found, initializing defaults`)

      const relativePublishDir = path.relative(ctx.cwd, ctx.getStaticOutputDir())
      const relativeFunctionsDir = path.relative(ctx.cwd, ctx.getFunctionsOutputDir())

      fs.writeFileSync(
        netlifyConfigFilepath,
        `[build]\n\tcommand = 'npm run build'\n\tpublish = '${relativePublishDir}'\n\tfunctions = '${relativeFunctionsDir}'`,
        'utf8'
      )
    } else {
      ctx.logger.debug(`${PLUGIN} Netlify config found`)
    }

    const netlifyConfig = validateAndNormalizeNetlifyConfig(getNetlifyConfig(netlifyConfigFilepath))

    ctx.logger.info(`${PLUGIN} initialized`, { duration: startupTime() })

    if (ctx.mode === Mode.Dev) {
      const watcher = filewatcher()
      watcher.add(netlifyConfigFilepath)
      watcher.on('change', () => {
        ctx.logger.debug(`${PLUGIN} Netlify config changed, requesting dev server restart`)
        ctx.restartDevServer()
      })

      return {
        name: PLUGIN,
        cleanup() {
          watcher.removeAll()
        },
      }
    } else {
      ctx.events.on('buildComplete', () => {
        ctx.logger.debug(`${PLUGIN} received event buildComplete`)

        /* c8 ignore next */
        onPostBuild(netlifyConfig, ctx)
      })

      return {
        name: PLUGIN,
      }
    }
  }
})
