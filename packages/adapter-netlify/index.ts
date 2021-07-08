import fs from 'fs-extra'
import path from 'path'
import { Plugin, getCurrentConfig } from 'presta'
import { parse as toml } from 'toml'
// @ts-ignore
import { parseFileRedirects } from 'netlify-redirect-parser'

type PostbuildEvent = {
  output: string
  staticOutput: string
  functionsOutput: string
  functionsManifest: {
    [route: string]: string
  }
}

// TODO do I need more here?
export type NetlifyConfig = {
  build?: {
    publish?: string
    functions?: string
  }
}

export type NetlifyRedirect = {
  from: string
  to: string
  status: number
  query?: { [param: string]: string }
  force?: boolean
  conditions?: { [param: string]: string }
  signed?: string
}

export function getNetlifyConfig({ cwd }: { cwd: string }): Partial<NetlifyConfig> | undefined {
  const filepath = path.join(cwd, 'netlify.toml')
  const raw = fs.readFileSync(filepath, 'utf8')
  const json = toml(raw)

  return json ? JSON.parse(JSON.stringify(json)) : undefined
}

export function toAbsolutePath(cwd: string, file?: string) {
  return file ? path.join(cwd, file) : undefined
}

export function normalizeNetlifyRoute(route: string) {
  route = route.replace(/^\*/, '/*')
  route = route.replace(/^\/\//, '/')
  return route
}

export function prestaRoutesToNetlifyRedirects(routes: [string, string][]): NetlifyRedirect[] {
  return routes.map(([route, filename]) => ({
    from: normalizeNetlifyRoute(route),
    to: `/.netlify/functions/${path.basename(filename, '.js')}`,
    status: 200,
  }))
}

export function generateRedirectsString(redirects: NetlifyRedirect[]) {
  return redirects.map((r) => [r.from, r.to, `${r.status}${r.force ? '!' : ''}`].join(' ')).join('\n')
}

export function createPlugin({ cwd = process.cwd() }: { cwd?: string } = {}): Plugin {
  return async function plugin() {
    const netlifyConfig = getNetlifyConfig({ cwd })

    if (!netlifyConfig) {
      throw new Error(`Missing required netlify.toml config file`)
    }
    if (!netlifyConfig.build) {
      throw new Error(`Missing required netlify.toml config: build`)
    }

    const publishDir = toAbsolutePath(cwd, netlifyConfig.build.publish)

    if (!publishDir) {
      throw new Error(`Missing required netlify.toml config: build.publish`)
    }

    const functionsDir = toAbsolutePath(cwd, netlifyConfig.build.functions)
    const fileRedirects = Array.from(
      new Set([
        ...(await parseFileRedirects(path.join(cwd, '_redirects'))),
        ...(await parseFileRedirects(path.join(publishDir || cwd, '_redirects'))),
      ])
    )

    let canRemoveStaticOutput = false
    let canRemoveFunctionsOutput = false
    const { events } = getCurrentConfig()

    events.on('postbuild', (props: PostbuildEvent) => {
      const { output, staticOutput, functionsOutput, functionsManifest } = props
      const hasStaticFiles = fs.existsSync(staticOutput)
      const hasFunctions = fs.existsSync(functionsOutput)

      if (hasFunctions && !functionsDir) {
        throw new Error(`Missing required netlify.toml config: build.functions`)
      }

      if (hasStaticFiles) {
        if (publishDir !== staticOutput) {
          fs.copySync(staticOutput, publishDir)
          fs.removeSync(staticOutput)
          canRemoveStaticOutput = true
        }
      }

      if (hasFunctions) {
        if (functionsDir !== functionsOutput) {
          fs.copySync(functionsOutput, functionsDir as string)
          fs.removeSync(functionsOutput)
          canRemoveFunctionsOutput = true
        }

        const prestaRedirects = prestaRoutesToNetlifyRedirects(Object.entries(functionsManifest))
        const combinedRedirects = fileRedirects.concat(prestaRedirects)
        const redirectsContent = generateRedirectsString(combinedRedirects)

        fs.outputFileSync(path.join(publishDir, '_redirects'), redirectsContent)
      }

      if (canRemoveStaticOutput && canRemoveFunctionsOutput) {
        fs.removeSync(output)
      }
    })
  }
}
