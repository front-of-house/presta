import fs from 'fs-extra'
import path from 'path'
import { premove } from 'premove/sync'
import merge from 'deep-extend'
import toRegExp from 'regexparam'
import { createPlugin, logger, HookPostBuildPayload } from 'presta'
import { build as esbuild } from 'esbuild'

const out = path.join(process.cwd(), './.output')
const staticOut = path.join(out, 'static')
const serverOut = path.join(out, 'server/pages')

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
    const source = prestaFunctionsManifest[route]
    const filename = path.basename(source, '.js')
    const tmpfile = path.join(prestaOutput, 'tmp', filename + '.js')
    const { pattern } = toRegExp(route)

    fs.outputFileSync(
      tmpfile,
      `import { requestToEvent } from 'presta/dist/requestToEvent';
import { route, handler } from '${source}';

module.exports = async (req, res) => {
  const event = await requestToEvent(req);
  const response = await handler(event, {});

  for (const key in response.multiValueHeaders) {
    res.setHeader(key, String(response.multiValueHeaders[key]));
  }

  for (const key in response.headers) {
    res.setHeader(key, String(response.headers[key]));
  }

  res.statusCode = response.statusCode;
  res.end(response.body);
}`
    )

    await esbuild({
      entryPoints: [tmpfile],
      outdir: serverOut,
      platform: 'node',
      target: ['node12'],
      minify: true,
      allowOverwrite: true,
      // external: Object.keys(pkg.dependencies || {}),
      bundle: true,
    })

    vercelRoutesManifest.dynamicRoutes.push({
      page: '/' + filename,
      regex: pattern.toString().slice(1).slice(0, -2).replace(/\\/g, ''),
    })
  }

  logger.debug({
    label: '@presta/adapter-vercel',
    message: `manifest generated ${JSON.stringify(vercelRoutesManifest)}`,
  })

  fs.outputFileSync(path.join(out, 'routes-manifest.json'), JSON.stringify(vercelRoutesManifest, null, '  '))
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

export async function onPostBuild(props: HookPostBuildPayload) {
  const { output: prestaOutput, staticOutput, functionsOutput, functionsManifest } = props

  fs.copySync(staticOutput, staticOut)
  if (Object.keys(functionsManifest).length) await generateRoutes(prestaOutput, functionsManifest)

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
