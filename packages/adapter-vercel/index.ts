import fs from 'fs-extra'
import path from 'path'
import { premove } from 'premove/sync'
import merge from 'deep-extend'
import toRegExp from 'regexparam'
import { createPlugin, logger, HookPostBuildPayload } from 'presta'

const output = path.join(process.cwd(), './.output')

export function requireSafe(mod: string) {
  try {
    return require(mod)
  } catch (e) {
    return {}
  }
}

export function generateRoutesManifest(prestaFunctionsManifest: HookPostBuildPayload['functionsManifest']) {
  const vercelRoutesManifest: {
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

  for (const route of Object.keys(prestaFunctionsManifest)) {
    const { pattern } = toRegExp(route)
    vercelRoutesManifest.dynamicRoutes.push({
      page: path.basename(prestaFunctionsManifest[route]),
      regex: String(pattern),
    })
  }

  logger.debug({
    label: '@presta/adapter-vercel',
    message: `manifest generated ${JSON.stringify(vercelRoutesManifest)}`,
  })

  fs.outputFileSync(path.join(output, 'routes-manifest.json'), JSON.stringify(vercelRoutesManifest, null, '  '))
}

export function mergeVercelConfig() {
  const config = requireSafe(path.join(process.cwd(), 'vercel.json'))
  return merge(config, {
    build: {
      env: {
        ENABLE_FILE_SYSTEM_API: '1',
      },
    },
  })
}

export function onPostBuild(props: HookPostBuildPayload) {
  const { output: prestaOutput, staticOutput, functionsOutput, functionsManifest } = props

  fs.copySync(staticOutput, path.join(output, 'static'))
  fs.copySync(functionsOutput, path.join(output, 'server/pages'))

  if (Object.keys(functionsManifest).length) generateRoutesManifest(functionsManifest)

  fs.outputFileSync(path.join(process.cwd(), 'vercel.json'), JSON.stringify(mergeVercelConfig(), null, '  '))

  premove(prestaOutput)

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

    hooks.onPostBuild((props) => {
      onPostBuild(props)
    })
  }
})
