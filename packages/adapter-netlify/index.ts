import assert from 'assert'
import fs from 'fs-extra'
import path from 'path'
import { premove } from 'premove/sync'
import { mkdir } from 'mk-dirs/sync'
import { createPlugin, logger, HookPostBuildPayload, ManifestDynamicFile, getDynamicFilesFromManifest } from 'presta'
import { parse as toml } from 'toml'
// @ts-ignore
import { parseFileRedirects } from 'netlify-redirect-parser'

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

export function getNetlifyConfig({ cwd }: { cwd: string }): Partial<NetlifyConfig> | undefined {
  const filepath = path.join(cwd, 'netlify.toml')

  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(
      filepath,
      `[build]\ncommand = 'npm run build'\npublish = 'build/static'\nfunctions = 'build/functions'`,
      'utf8'
    )
  }

  const raw = fs.readFileSync(filepath, 'utf8')
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

export function normalizeNetlifyRoute(route: string) {
  route = route.replace(/^\*/, '/*')
  route = route.replace(/^\/\//, '/')
  return route
}

export function prestaRoutesToNetlifyRedirects(files: ManifestDynamicFile[]): NetlifyRedirect[] {
  return files.map((file) => ({
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

export async function onPostBuild(config: NetlifyConfig, props: HookPostBuildPayload) {
  const { output, staticOutput, functionsOutput, manifest } = props
  const hasFunctions = fs.existsSync(functionsOutput)
  const shouldCopyStaticFiles = config.build.publish !== staticOutput && fs.existsSync(staticOutput)
  const shouldCopyFunctions = config.build.functions !== functionsOutput && hasFunctions
  const userConfiguredRedirects = await getUserConfiguredRedirects(config.build.publish)

  const debug = {
    netlifyConfig: config,
    postBuildPayload: props,
    hasFunctions,
    shouldCopyStaticFiles,
    shouldCopyFunctions,
  }

  logger.debug({
    label: '@presta/adapter-netlify',
    message: `handling onPostBuild hook\n${JSON.stringify(debug)}`,
  })

  if (hasFunctions && !config.build.functions) {
    throw new Error(`Missing required netlify.toml config: build.functions`)
  }

  if (shouldCopyStaticFiles) fs.copySync(staticOutput, config.build.publish)
  if (shouldCopyFunctions) fs.copySync(functionsOutput, config.build.functions as string)

  if (hasFunctions) {
    const prestaRedirects = prestaRoutesToNetlifyRedirects(getDynamicFilesFromManifest(manifest))
    const combinedRedirects = userConfiguredRedirects.concat(prestaRedirects)
    const redirectsFilepath = path.join(config.build.publish, '_redirects')

    mkdir(path.dirname(redirectsFilepath))
    fs.writeFileSync(path.join(config.build.publish, '_redirects'), generateRedirectsString(combinedRedirects), 'utf8')
  }

  if ((shouldCopyStaticFiles && !shouldCopyFunctions) || (shouldCopyStaticFiles && shouldCopyFunctions)) {
    premove(output)
  }

  logger.info({
    label: '@presta/adapter-netlify',
    message: `complete`,
  })
}

export default createPlugin(() => {
  return async function plugin(config, hooks) {
    logger.debug({
      label: '@presta/adapter-netlify',
      message: `init`,
    })

    const netlify = validateAndNormalizeNetlifyConfig(getNetlifyConfig({ cwd: process.cwd() }))

    logger.debug({
      label: '@presta/adapter-netlify',
      message: `configured ${JSON.stringify(netlify)}`,
    })

    hooks.onPostBuild((props) => {
      /* c8 ignore next */
      onPostBuild(netlify, props)
    })
  }
})
