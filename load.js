import path from 'path'
import ms from 'ms'
import assert from 'assert'
import c from 'ansi-colors'
import merge from 'deepmerge'

import { debug } from './lib/debug'
import { log } from './lib/log'
import { fileCache } from './lib/fileCache'

const requests = new Map()
let memoryCache = {}
const skipLoaders = []

export function clearMemoryCache () {
  memoryCache = {}
}

function getFromFileCache (key) {
  const entry = fileCache.getKey(key)
  const now = Date.now()

  if (entry) {
    const { expires } = entry

    if (now > expires) {
      debug(`{ ${key} } has expired on disk`)
      fileCache.removeKey(key)
      return undefined
    } else {
      debug(`{ ${key} } is cached to disk`)
      return entry
    }
  }
}

export function prime (value, options) {
  const { key, duration } = options

  assert(!!key, 'prime requires a key')

  if (duration) {
    const interval = ms(duration)
    const now = Date.now()

    fileCache.setKey(key, {
      value,
      expires: now + interval,
      duration
    })

    //fileCache.save(true) // TODO will this break?

    debug(`{ ${key} } has been primed to disk for ${duration}`)
  } else {
    memoryCache[key] = value
    debug(`{ ${key} } has been primed to memory`)
  }
}

export function expire (key) {
  fileCache.removeKey(key)
  fileCache.save(true)
}

export async function cache (loading, options) {
  const { key, duration } = options

  assert(!!key, 'presta/load cache expects a key')
  assert(duration !== undefined, 'presta/load cache expects a duration')

  const interval = ms(duration)

  const entry = getFromFileCache(key)
  if (entry) return entry.value

  const value = await (typeof loading === 'function' ? loading() : loading)

  fileCache.setKey(key, {
    value,
    expires: Date.now() + parseInt(interval),
    duration
  })

  fileCache.save(true)

  debug(`{ ${key} } has been cached to disk for ${duration}`)

  return value
}

export function load (loader, options = {}) {
  const { key, duration } = options
  const cacheToFile = !!duration && process.env.PRESTA_ENV === 'development'

  assert(!!key, 'presta/load cache expects a key')

  if (skipLoaders.indexOf(key) > -1) {
    debug(`{ ${key} } threw on last render, skipping...`)
    return null
  }

  const entry = cacheToFile ? getFromFileCache(key) : memoryCache[key]

  if (entry) {
    if (cacheToFile && duration !== entry.duration) {
      prime(entry.value, { key, duration })
    }

    return cacheToFile ? entry.value : entry
  }

  async function run () {
    try {
      const loading = loader()
      requests.set(key, loading)

      if (cacheToFile) {
        cache(loading, { key, duration })
      }

      const res = await loading

      requests.delete(key)

      if (!cacheToFile) {
        memoryCache[key] = res
        debug(`{ ${key} } has been cached in memory`)
      }
    } catch (e) {
      debug(`{ ${key} } threw an error: ${e.message}`)
      requests.delete(key)

      skipLoaders.push(key)

      if (cacheToFile) {
        expire(key)
      }

      log(`\n  ${c.red('error')} load { ${key} }\n\n${e}\n`)
    }
  }

  run()
}

export async function render (
  component,
  context,
  renderer = (fn, context) => fn(context), // for a custom render, like React
  internals = { headCache: {} } // internal, don't use this elsewhere
) {
  if (!context.plugins.head) {
    // TODO attach this better elsewhere
    context.plugins.head = obj => {
      Object.assign(internals.headCache, merge(internals.headCache, obj))
    }
  }

  const content = renderer(component, context)

  if (!!requests.size) {
    await Promise.allSettled(Array.from(requests.values()))
    return render(component, context, renderer, internals)
  }

  if (requests.size) {
    throw new Error(
      `presta/load - unresolved requests: ${JSON.stringify(
        Array.from(requests.keys())
      )}`
    )
  }

  return {
    ...context,
    props: {
      ...context.props,
      content,
      head: internals.headCache,
      data: {
        ...memoryCache,
        ...fileCache.all()
      }
    }
  }
}
