import { Socket } from 'net'
import http from 'http'
import toRegExp from 'regexparam'
import status from 'statuses'
import { WebSocketServer } from 'ws'
import path from 'path'
import getPort from 'get-port'
import { config as dotenv } from 'dotenv'
import { addAliases } from 'module-alias'
import fs from 'fs-extra'
import globSync from 'tiny-glob/sync'
import mime from 'mime-types'
import { create } from 'watch-dependency-graph'
import chokidar from 'chokidar'
import match from 'picomatch'
import { build as esbuild } from 'esbuild'
import { smitter, Smitter } from 'smitter'
import kleur, { Kleur } from 'kleur'
import rsort from 'route-sort'
import {
  Params,
  MultiValueParams,
  Event as LambdaEvent,
  Context as LambdaContext,
  Response as LambdaResponse,
} from 'lambda-types'

import { requireFresh } from './utils/requireFresh'
import { timer } from './utils/timer'
import { hashContent } from './utils/hashContent'
import { requestToEvent } from './utils/requestToEvent'
import { createDefaultHtmlResponse } from './utils/createDefaultHtmlResponse'

import { parsePathParameters } from './runtime/parsePathParameters'
import { sendServerlessResponse } from './runtime/sendServerlessResponse'
import { normalizeEvent } from './runtime/normalizeEvent'
import { normalizeResponse } from './runtime/normalizeResponse'
import { wrapHandler } from './runtime/wrapHandler'

import { HttpError, Mode } from './'
import * as serialize from './serialize'

// TODO add option not to build everything on startup
// TODO outputting directly to platform dirs means no reading of exported { config } by plugins, maybe I need a lifecycle hook to process in situ

export type PrestaConfig = {
  /**
   * @description the current working directory (default `process.cwd()`)
   */
  cwd: string
  /**
   * @description file globs to include in build process
   */
  files: string[]
  /**
   * @description path to static asset directory (default `./public`)
   */
  assets: string
  /**
   * @description array of Presta plugins
   */
  plugins: Plugin[]
  /**
   * @description user requested port (default `4000`)
   */
  port: number
  /**
   * @description whether or not to run the local dev HTTP server (default `false`)
   */
  serve: boolean
  /**
   * @description option to output debug logs during dev (default `false`)
   */
  debug?: boolean
  /**
   * @description the raw args passed in via the Presta CLI
   */
  rawCliArgs: PrestaCliArgs
  /**
   * @description inclues all dependencies in the final bundle instead of
   * externalizing them
   */
  __unsafe_bundle_everything: boolean
}

export type PrestaCliArgs = {
  /**
   * @description variadic CLI args (Presta files)
   */
  _?: string[] // files
  /**
   * @description user provided config filepath
   */
  config?: string
  /**
   * Re-declared because CLI arg comes in as a string
   *
   * @description whether or not to run the local dev HTTP server (default `false`)
   */
  serve?: string
  /**
   * Re-declared because CLI arg comes in as a string
   *
   * @description option to output debug logs during dev (default `false`)
   */
  debug?: string
} & Partial<Omit<PrestaConfig, 'files' | 'plugins' | 'rawCliArgs' | 'serve'>>

export type Headers = Params
export type MultiValueHeaders = MultiValueParams
export type QueryStringParameters = Params
export type MultiValueQueryStringParameters = MultiValueParams
export type PathParameters = Params

export type Event = Omit<
  LambdaEvent,
  'queryStringParameters' | 'multiValueQueryStringParameters' | 'pathParameters'
> & {
  queryStringParameters: Params
  multiValueQueryStringParameters: MultiValueParams
  pathParameters: Params
}
export type Context = LambdaContext & {
  [key: string]: unknown
}
export type Response = Omit<LambdaResponse, 'statusCode'> & {
  statusCode?: number
}

export type Handler = (event: Event, context: Context) => Promise<Response | string> | Response | string
export type AWSLambda = (event: Event, context: Context) => Promise<LambdaResponse>

export type PrestaFile = {
  route?: string
  getStaticPaths?: () => Promise<string[]>
  handler: Handler
}

export type PrestaFunctionFile = PrestaFile & {
  route: string
}

export type PrestaStaticFile = PrestaFile & {
  getStaticPaths: () => Promise<string[]>
}

export type Manifest = {
  /**
   * @description The built pages and files from the Presta process. These are
   * output to the same directory as the `config.assets` static assets.
   */
  statics: { [filepath: string]: string[] }
  /**
   * @description The built AWS Lambda-flavored serverless functions
   */
  functions: { [filepath: string]: { route: string; src: string; dest: string } }
}

export type InternalEvents = {
  devServerRestarted: undefined
  requestRestartDevServer: undefined
  devFileAdded: undefined
  devFileRemoved: undefined
  devFileChanged: undefined
}

export type ExternalEvents = {
  buildComplete: undefined
}

export type LoggerMetadata = {
  duration?: string
}

export type Logger = {
  debug(message: string, metadata?: LoggerMetadata): void
  info(message: string, metadata?: LoggerMetadata): void
  warn(message: string, metadata?: LoggerMetadata): void
  error(error: Error | string, metadata?: LoggerMetadata): void
}

export type PluginInterface = {
  /**
   * @description The package name of the Presta plugin e.g.
   * `@presta/adapter-netlify`
   */
  name: string
  /**
   * @description Called when dev server restarts, like after an edit is made
   * to the config file. Clean up any and all listeners and side-effects within
   * this method.
   */
  cleanup?(): void
}

export type PluginContext = {
  mode: Mode
  cwd: string
  events: { on: Smitter<ExternalEvents>['on'] }
  logger: Logger
  getManifest(): Manifest
  getOutputDir(): string
  getStaticOutputDir(): string
  getFunctionsOutputDir(): string
  restartDevServer(): void
}

export type Plugin = (context: PluginContext) => PluginInterface

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export const defaultJSConfigFilepath = 'presta.config.js'
export const defaultTSConfigFilepath = 'presta.config.ts'
export const rootOutputDir = './.presta'
export const functionsOutputDir = './.presta/functions'
export const staticOutputDir = './.presta/static'

export function createLiveReloadScript({ port }: { port: number }) {
  return `
    <script>
      (function (global) {
        var socket = new WebSocket('ws://localhost:${port}');

        socket.addEventListener('open', function (event) {
          console.log('[presta] connected on port ${port}')
        });

        socket.addEventListener('message', function (event) {
          console.log(\`'[presta] received \$\{event.data\}\`)
          if (event.data === 'refresh') {
            global.location.reload();
          }
        });

        socket.addEventListener('close', function () {
          console.log('[presta] disconnected')
        });
      })(this);
    </script>
  `
}

export function slugify(filename: string, cwd: string) {
  return filename
    .replace(cwd, '') // /pages/File.page.js
    .split('.') // extension, [/pages/File, page, js]
    .reverse()
    .slice(1)
    .reverse()
    .join('-') // /pages/File.page
    .split('/')
    .filter(Boolean)
    .join('-') // pages-File-page
}

/**
 * Accepts the Manifest's functions object and sorts it according to route
 * priority, returning the full object
 */
export function sortManifestFunctions(functions: Manifest['functions']) {
  const files = Object.values(functions)
  const sortedRoutes = rsort(files.map((f) => f.route))
  return sortedRoutes.reduce((fns, route) => {
    const file = files.find((f) => f.route === route)
    if (!file) return fns
    return {
      ...fns,
      [file.src]: file,
    }
  }, {})
}

export function findAndParseConfigFile(userProvidedConfigFilepath?: string): Partial<PrestaConfig> {
  if (userProvidedConfigFilepath) {
    return requireFresh(path.resolve(userProvidedConfigFilepath))?.default
  } else {
    try {
      return requireFresh(path.resolve(defaultJSConfigFilepath))?.default
    } catch (e) {
      if (fs.existsSync(defaultJSConfigFilepath)) {
        throw e
      } else {
        try {
          return requireFresh(path.resolve(defaultTSConfigFilepath))?.default
        } catch (e) {
          if (fs.existsSync(defaultTSConfigFilepath)) {
            throw e
          }
        }
      }
    }

    return {}
  }
}

export function mergeConfig(configFile: Partial<PrestaConfig>, cliArgs: PrestaCliArgs = {}): PrestaConfig {
  // TODO make sure cwd is absolute
  const cwd = configFile.cwd || process.cwd()

  const merged: PrestaConfig = {
    cwd,
    files: configFile.files || [], // TODO where do we validate
    assets: configFile.assets || 'public',
    plugins: configFile.plugins || [],
    port: configFile.port || 4000,
    serve: configFile.serve ?? true,
    debug: !!configFile.debug,
    __unsafe_bundle_everything: configFile.__unsafe_bundle_everything ?? false,
    rawCliArgs: cliArgs,
  }

  /**
   * Override config file options with CLI
   */
  if (cliArgs._?.length) merged.files = cliArgs._
  if (cliArgs.assets) merged.assets = cliArgs.assets
  if (cliArgs.port) merged.port = cliArgs.port
  if (cliArgs.serve) merged.serve = cliArgs.serve === 'true'
  if (cliArgs.debug) merged.debug = cliArgs.debug === true

  /**
   * Resolve absolute paths
   */
  if (merged.files) merged.files = ([] as string[]).concat(merged.files).map((p) => path.resolve(merged.cwd, p))
  if (merged.assets) merged.assets = path.resolve(merged.cwd, merged.assets)

  return merged
}

export function pathnameToFile(pathname: string, ext = 'html') {
  return !!path.extname(pathname)
    ? pathname // if path has extension, use it
    : ext === 'html'
    ? `${pathname}/index.html` // if HTML is inferred, create index
    : `${pathname}.${ext}` // anything but HTML will need an extension, otherwise browsers will render as text
}

export function getMimeType(response: LambdaResponse) {
  const type = (response?.headers || {})['content-type']
  return mime.extension(type as string) || 'html'
}

/**
 * Loads the _source_ file, not the built file
 */
export function loadSourceFunctionFileFromManifest(
  url: string,
  manifest: Manifest
): {
  filepath: string
  exports: PrestaFunctionFile
} {
  const prestaFile = Object.entries(manifest.functions)
    .map(([filepath, { route }]) => ({
      matcher: toRegExp(route),
      file: filepath,
    }))
    .filter(({ matcher }) => {
      return matcher.pattern.test(url.split('?')[0])
    })
    .map(({ file }) => file)[0]

  return {
    filepath: prestaFile,
    exports: prestaFile ? requireFresh(prestaFile) : undefined,
  }
}

export class Presta {
  cwd: string = process.cwd()

  /**
   * Full config, with CLI arguments merged in
   */
  config: PrestaConfig

  /**
   * Whether in production or development
   */
  mode: Mode = Mode.Dev

  /**
   * The port presta will serve files from in dev mode
   */
  port: number

  /**
   * @description option to output debug logs during dev (default `false`)
   */
  debug = false

  /**
   * Output directory for static assets and generated files
   */
  staticOutputDir: string

  /**
   * Output directory for serverless functions. This is probably separate from
   * where adapters output files.
   */
  functionsOutputDir: string

  /**
   * Hidden .presta dir for internal files
   */
  prestaOutputDir: string

  /**
   * Filepath to output build manifest to, within `config.output` directory
   */
  manifestFilepath: string

  /**
   * Full build manifest. Should be kept up to date as files are added/removed/built.
   */
  manifest: Manifest = {
    statics: {},
    functions: {},
  }

  /**
   * All watched files, computed from `config.files` or CLI args.
   */
  files: string[] = []

  /**
   * Event emitters for both internal events and external events consumed by
   * users and plugins
   */
  events = {
    internal: smitter<InternalEvents>(),
    external: smitter<ExternalEvents>(),
  }

  /**
   * <script> tag added to all HTML responses, depends on `this.config.port`
   */
  liveReloadScript = ''

  plugins: PluginInterface[]

  logger: Logger

  constructor(config: Partial<PrestaConfig>) {
    this.cwd = config.cwd || process.cwd()

    dotenv({ path: path.join(this.cwd, '.env') })
    addAliases({ '@': this.cwd })

    // merge defaults again in case of programmatic usage and partial options
    this.config = mergeConfig(config)
    this.debug = !!this.config.debug
    this.logger = {
      debug: (message, metadata) => this._log('debug', message, metadata),
      info: (message, metadata) => this._log('info', message, metadata),
      warn: (message, metadata) => this._log('warn', message, metadata),
      error: (error, metadata) => this._log('error', error, metadata),
    }

    this.logger.debug(`initialized with config ${JSON.stringify(config, null, '  ')}`)
  }

  /**
   * Build all files and copy static assets to `config.output`.
   */
  async build() {
    this.mode = Mode.Build

    this._init()

    if (!this.files.length) {
      this.logger.warn(`no files were found, nothing to build`)

      return
    }

    const time = timer()
    const pkg = require(path.join(this.cwd, 'package.json'))

    // clean slate
    await fs.remove(this.staticOutputDir) // could be overridden by a plugin
    await fs.remove(this.functionsOutputDir) // could be overridden by a plugin

    // copy static assets
    if (fs.existsSync(this.config.assets)) await fs.copy(this.config.assets, this.staticOutputDir)

    // build all files, generate manifeset
    await this.buildFiles(this.files)

    // use manifest to compile production serverless functions
    await esbuild({
      entryPoints: Object.values(this.manifest.functions).map(({ dest }) => dest),
      outdir: this.functionsOutputDir,
      platform: 'node',
      target: ['node12'],
      minify: true,
      allowOverwrite: true,
      external: this.config.__unsafe_bundle_everything ? [] : Object.keys(pkg.dependencies || {}),
      bundle: true,
      define: {
        'process.env.PRESTA_SERVERLESS_RUNTIME': 'true',
      },
    })

    this.logger.info(`presta build complete`, { duration: time() })

    this.events.external.emit('buildComplete')
  }

  async dev() {
    this.mode = Mode.Dev

    this._init()

    if (this.config.serve) {
      await this._getPort()
      this.liveReloadScript = this.config.serve ? createLiveReloadScript({ port: this.port }) : ''
    }

    /**
     * Debounce restarts if multiple are triggered in quick succession
     */
    let restarting = false

    /**
     * The main dev process.
     */
    let watcher = await this._initDev()

    /**
     * Local function to handle resetting everything after a config file change.
     * Also called programmatically from plugins when their configs change.
     */
    const restart = async () => {
      // debounce
      if (restarting) return
      restarting = true

      try {
        // destroy old watch process
        await watcher.cleanup()

        if (!this.debug) console.clear()

        this.logger.info(`♺ restarting`)

        // reset config in case of changes
        this.config = mergeConfig(findAndParseConfigFile(this.config.rawCliArgs.config), this.config.rawCliArgs)

        // run _init again to recompute instance values and cleanup plugins
        this._init()

        // start a new watch process
        watcher = await this._initDev()

        this.events.internal.emit('devServerRestarted')
      } catch (e) {
        this.logger.error(e as Error)
      }

      // don't forget to reset!
      restarting = false
    }

    /**
     * Watches for config files changes and restarts the watch process on changes.
     */
    const configWatcher = chokidar
      .watch(
        [
          this.config.rawCliArgs.config && path.resolve(this.config.rawCliArgs.config),
          defaultJSConfigFilepath,
          defaultTSConfigFilepath,
        ].filter(Boolean) as string[],
        { ignoreInitial: true }
      )
      .on('all', restart)

    this.events.internal.on('requestRestartDevServer', restart)

    return {
      /**
       * Ends the watch process. Mostly useful for internal testing.
       */
      async cleanup() {
        await watcher.cleanup()
        await configWatcher.close()
      },
    }
  }

  serve() {
    this.mode = Mode.Serve
    this._init()
    this._serve()
  }

  /**
   * Restarts the entire dev process and rebuilds *all* files. Usually used by
   * plugins after a critical configuration change. *Use with caution.*
   */
  restartDevServer() {
    if (this.mode !== Mode.Dev) {
      throw new Error(`Requested a dev server restart in ${this.mode} mode`)
    }

    this.events.internal.emit('requestRestartDevServer')
  }

  /**
   * Loads a module from filepath and generates static files and functions
   */
  async buildFile(filepath: string) {
    try {
      const { route, getStaticPaths, handler } = require(filepath) as PrestaFile

      if (getStaticPaths) {
        const staticPaths = await getStaticPaths() // urls to render
        const builtFiles = [] // newly built files
        const prevBuiltFiles = this.manifest.statics[filepath] || [] // empty on first pass

        // if no paths are returned, clean up old paths and manifest entry
        if (!staticPaths.length) {
          for (const prevBuiltFile of prevBuiltFiles) {
            await fs.remove(prevBuiltFile)
          }

          this.manifest.statics[filepath] = []

          this.logger.debug(`no built files detected, removing all previous artifacts for ${filepath}`)

          return
        }

        for (const url of staticPaths) {
          const time = timer()

          const event = normalizeEvent({
            path: url,
            pathParameters: route ? parsePathParameters(url, route) : {},
          })

          const response = normalizeResponse(await handler(event, {} as Context))
          const type = (response?.headers || {})['content-type'] // intelligently infer type
          const ext = mime.extension(type as string) || 'html' // defaults to html
          const filename = pathnameToFile(url, ext)
          const html = response.body
          const outfile = path.join(this.staticOutputDir, filename)

          fs.outputFileSync(outfile, html, 'utf-8')
          builtFiles.push(outfile)

          this.logger.info(`● ${url}`, { duration: time() })
        }

        // diff previous built files with new files and remove stale
        for (const prevBuiltFile of prevBuiltFiles) {
          if (!builtFiles.includes(prevBuiltFile)) {
            await fs.remove(prevBuiltFile)
            this.logger.debug(`detected removed file, cleaning up ${filepath}`)
          }
        }

        // overwrite every time with new files
        this.manifest.statics[filepath] = builtFiles
      }

      if (route) {
        const time = timer()
        const slug = slugify(filepath, this.cwd) // prevents name collisions
        // hash in prod for cache busting
        let outfile = ''

        // in dev mode we just serve using the source file
        if (this.mode === Mode.Build) {
          outfile = path.join(
            this.functionsOutputDir,
            this.mode === Mode.Build
              ? // TODO do I need to hash this since it's slugified and platforms do their own caching?
                slug + '-' + hashContent(fs.readFileSync(filepath, 'utf8')) + '.js'
              : slug + '.js'
          )

          fs.outputFileSync(
            outfile,
            `import { wrapHandler } from 'presta/runtime/wrapHandler';
import * as file from '${filepath}';
const mod = Object.assign({ config: {} }, file)
export const route = mod.route
export const config = mod.config
export const handler = wrapHandler(mod)`
          )
        }

        // sort by route priority and again, always overwrite
        this.manifest.functions = sortManifestFunctions({
          ...this.manifest.functions,
          [filepath]: {
            route,
            src: filepath,
            dest: outfile,
          },
        })

        this.logger.info(`λ ${route}`, { duration: time() })

        // TODO diff and remove old lambdas
      }

      // commit to file for reference by plugins
      this._commitManifestToFile()
    } catch (e) {
      this.logger.error(e as Error)
    }
  }

  /**
   * Wrapper around `this.buildFile`
   */
  async buildFiles(filepaths: string[]) {
    await Promise.all(filepaths.map((file) => this.buildFile(file)))
  }

  /**
   * Called during start/restart. References `this.config` to compute some
   * instance properties that are used throughout the instance methods (and so
   * must be called after this.config is set or updated). Also parses the
   * user-input file globs to discover targeted files and assign to
   * this.files`.
   */
  private _init() {
    if (this.plugins?.length) {
      this.plugins.forEach((plugin) => {
        if (plugin.cleanup) {
          this._log('debug', `cleaning up ${plugin.name} plugin`)
          plugin.cleanup()
        }
      })
    }

    this.prestaOutputDir = path.join(this.cwd, rootOutputDir)
    this.staticOutputDir = path.join(this.cwd, staticOutputDir)
    this.functionsOutputDir = path.join(this.cwd, functionsOutputDir)
    this.manifestFilepath = path.join(this.prestaOutputDir, 'manifest.json')
    this.files = ([] as string[])
      .concat(this.config.files)
      .map((file) => globSync(file))
      .flat()
      .map((file) => path.resolve(this.cwd, file)) // make absolute

    this.plugins = this.config.plugins.map((plugin) => {
      const p = plugin({
        mode: this.mode,
        cwd: this.cwd,
        events: { on: this.events.external.on },
        logger: this.logger,
        getManifest: () => this.manifest,
        getOutputDir: () => this.prestaOutputDir,
        getStaticOutputDir: () => this.staticOutputDir,
        getFunctionsOutputDir: () => this.functionsOutputDir,
        restartDevServer: this.restartDevServer.bind(this),
      })

      this.logger.debug(`${p.name} initialized`)

      return p
    })

    this.logger.debug(`presta start\n${JSON.stringify(this, null, '  ')}`)
  }

  private async _serve() {
    if (this.mode === Mode.Serve) await this._getPort()

    this.logger.info(`⚡︎http://localhost:${this.port}`)

    const server = http.createServer((req, res) => this._httpServerHandler(req, res)).listen(this.port)
    const websocket = new WebSocketServer({ server })
    const sockets: Socket[] = []

    // once a browser connects, track its socket
    server.on('connection', (socket) => {
      sockets.push(socket)
      socket.on('close', () => sockets.splice(sockets.indexOf(socket), 1))
    })

    const refresh = () => {
      this.logger.debug(`refreshing browser`)
      websocket.clients.forEach((ws) => ws.send('refresh'))
    }

    const listeners = [
      this.events.internal.on('devServerRestarted', () => refresh()),
      this.events.internal.on('devFileAdded', () => refresh()),
      this.events.internal.on('devFileRemoved', () => refresh()),
      this.events.internal.on('devFileChanged', () => refresh()),
    ]

    return {
      /**
       * Stop HTTP server and close all websocket listeners
       */
      cleanup() {
        // so just always resolve OK
        return new Promise((y) => {
          listeners.map((l) => l())
          server.close(() => y(1))
          // sockets includes ws sockets
          sockets.forEach((ws) => ws.destroy())
        })
      },
    }
  }

  private _log(level: LogLevel, message: string | Error, { duration }: { duration?: string } = {}) {
    if (!this.debug && level === 'debug') return

    const colors: {
      [key in LogLevel]: string
    } = {
      debug: 'magenta',
      info: 'reset',
      warn: 'yellow',
      error: 'red',
    }

    const color = kleur[colors[level] as keyof Kleur]

    console[level](
      [kleur.gray(this.mode), color(String(message)), duration && `${kleur.gray(duration)}`].filter(Boolean).join(' ')
    )

    if (level === 'error' && message instanceof Error) console.error(message)
  }

  /**
   * The main dev process
   */
  private async _initDev() {
    /**
     * Watcher for *known* files. Does not pick up newly added files, but does
     * detect removals.
     */
    const fileWatcher = create({ alias: { '@': this.cwd } })

    /*
     * Watches the raw file globs passed to the CLI or as `config.files`.
     * Checks on add/change to see if a file should be upgraded to a a Presta
     * source file, and added to the `fileWatcher`.
     */
    const globalWatcher = chokidar.watch(this.cwd, {
      ignoreInitial: true,
      ignored: [this.staticOutputDir, this.functionsOutputDir, this.config.assets],
    })

    /**
     * HTTP server
     */
    let server: Awaited<ReturnType<typeof this._serve>>

    /**
     * Watches for static asset changes and reports to connected browsers for a
     * refresh
     */
    let staticAssetWatcher: ReturnType<typeof chokidar.watch>
    if (this.config.serve) {
      server = await this._serve()

      staticAssetWatcher = chokidar.watch(this.config.assets, { ignoreInitial: true }).on('all', (event, file) => {
        this.logger.debug(`static asset ${file} changed`)
        this.events.internal.emit('devFileChanged')
      })
    }

    fileWatcher.onChange(async (changed) => {
      this.logger.debug(`file ${changed[0]} changed`)
      await this.buildFiles(changed)
      this.events.internal.emit('devFileChanged')
    })

    fileWatcher.onRemove(async ([id]) => {
      this.logger.debug(`file ${id} was removed`)

      // remove from local hash
      this.files.splice(this.files.indexOf(id), 1)

      // a single file can generate both static and dyanmic outputs
      const prevBuiltStaticFiles = this.manifest.statics[id] || []
      const prevBuiltFunctionsFiles = this.manifest.functions[id]

      // push all removal tasks to an array
      const removals = prevBuiltStaticFiles.map((f) => fs.remove(f))
      if (prevBuiltFunctionsFiles) {
        removals.push(fs.remove(prevBuiltFunctionsFiles.dest))
      }

      await Promise.all(removals)

      // cleanup
      delete this.manifest.statics[id]
      delete this.manifest.functions[id]

      this.events.internal.emit('devFileRemoved')
    })

    fileWatcher.onError((e) => {
      this.logger.error(typeof e === 'string' ? new Error(e) : e)
    })

    // begin watching existing files
    await fileWatcher.add(this.files)

    globalWatcher.on('add', async (file) => {
      // some edge cases
      if (!fs.existsSync(file) || fs.lstatSync(file).isDirectory()) return
      // ignore files that don't match globs
      if (!match(this.config.files)(file)) return
      // ignore already watched files
      if (this.files.includes(file)) return

      this.logger.debug(`${file} added`)

      // must be new, start watching
      this.files.push(file)
      await fileWatcher.add(file)

      // build for first time
      await this.buildFile(file)

      this.events.internal.emit('devFileAdded')
    })

    /**
     * Important: if we ever remove initial rendering, we will want to
     * re-introduce "file priming" where we require all files and surface errors
     * on startup.
     */
    await fs.remove(this.staticOutputDir)
    await fs.remove(this.functionsOutputDir)
    await this.buildFiles(this.files)

    return {
      /**
       * Destroys main dev process, readies for subsequent calls.
       */
      async cleanup() {
        await Promise.all(
          [
            fileWatcher.close(),
            globalWatcher.close(),
            staticAssetWatcher && staticAssetWatcher.close(),
            server && server.cleanup(),
          ].filter(Boolean)
        )
      },
    }
  }

  /**
   * Assigns `this.port` and must be called when starting dev or serve modes
   */
  private async _getPort() {
    const port = this.config.port || 4000
    this.port = await getPort({ port })

    if (this.port !== port) {
      this.logger.debug(`desired port ${port} not available, assigning ${this.port}`)
    }
  }

  /**
   * Commits `this.manifest` to a file on system.
   */
  private async _commitManifestToFile() {
    return fs.outputFileSync(this.manifestFilepath, JSON.stringify(this.manifest, null, '  '))
  }

  private async _httpServerHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const time = timer()

    this.logger.debug(`handling ${req.url}`)

    this._httpTryServeFile(req, res, async (handled) => {
      if (handled) {
        this.logger.info(`⚡︎${req.url} ${res.statusCode}`, { duration: time() })
      } else {
        await this._httpTryServeLambda(req, res)
      }
    })
  }

  private async _httpTryServeFile(req: http.IncomingMessage, res: http.ServerResponse, cb: (handled: boolean) => void) {
    const { pathname } = new URL(req.url as string, 'https://presta.dev')
    const contentType = mime.lookup(pathname) || 'text/html'
    const isHtml = contentType === 'text/html'

    const assetFilepath = path.join(this.config.assets, pathname)
    const staticFilepath = path.join(this.staticOutputDir, pathname)

    let handled = false

    const filepaths = [
      assetFilepath,
      staticFilepath,
      path.join(assetFilepath, 'index.html'),
      path.join(staticFilepath, 'index.html'),
    ]

    for (const filepath of filepaths) {
      this.logger.debug(`attempting to serve ${filepath} as ${contentType}`)

      if (fs.existsSync(filepath)) {
        if (fs.statSync(filepath).isDirectory()) continue

        res.writeHead(200, { 'content-type': contentType })

        if (isHtml) {
          let html = fs.readFileSync(filepath, 'utf8')
          html += this.liveReloadScript
          res.end(html)
        } else {
          fs.createReadStream(filepath).pipe(res)
        }

        handled = true

        break
      }
    }

    cb(handled)
  }

  private async _httpTryServeLambda(req: http.IncomingMessage, res: http.ServerResponse) {
    const time = timer()

    const event = await requestToEvent(req) // stock AWS Event shape
    const accept = event.headers.Accept || event.headers.accept
    const acceptsJson = accept && accept.includes('json')

    this.logger.debug(`handling function request ${event.path}`)

    try {
      const { filepath, exports: file } = loadSourceFunctionFileFromManifest(event.path, this.manifest)

      if (!file) {
        this.logger.error(`⚡︎${event.path} ${404}`, { duration: time() })
        sendServerlessResponse(res, { statusCode: 404 })
        return
      }

      if (!file.handler) throw new HttpError(`file ${filepath} does not export a \`handler\``, 404)

      const response = await wrapHandler(file)(event, {} as Context)
      const redir = response.statusCode > 299 && response.statusCode < 399
      const mime = redir ? undefined : getMimeType(response)

      if (mime === 'html') {
        response.body = (response.body || '').split('</body>')[0] + this.liveReloadScript
      }

      sendServerlessResponse(res, response)

      this.logger.info(`⚡︎${redir ? response?.headers?.Location || event.path : event.path} ${response.statusCode}`, {
        duration: time(),
      })
    } catch (e) {
      const error = e as HttpError
      const { statusCode = 500 } = error

      if (statusCode > 499) this.logger.error(error)

      const response = acceptsJson
        ? serialize.json({
            statusCode: statusCode,
            body: { detail: status.message[statusCode] },
          })
        : serialize.html({
            statusCode: statusCode,
            body: createDefaultHtmlResponse({ statusCode }),
          })

      this.logger.error(error)
      this.logger.error(`⚡︎${event.path} ${response.statusCode}`, { duration: time() })

      sendServerlessResponse(res, response)
    }
  }
}
