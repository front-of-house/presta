import path from 'path'
import ms from 'ms'
import flatCache from 'flat-cache'
import createDebug from 'debug'
import assert from 'assert'

const debug = createDebug('presta')
const cwd = process.cwd()
const requests = new Map()
const memoryCache = {}
const fileCache = flatCache.load('presta', path.resolve(cwd, './.presta/cache'));

function getFromFileCache(key) {
  const entry = fileCache.getKey(key)
  const now = Date.now()

  if (entry) {
    const { expires } = entry

    if (now > expires) {
      debug(`{ ${key} } has expired on disk`)
      fileCache.removeKey(key)
      return undefined;
    } else {
      debug(`{ ${key} } is cached to disk`)
      return entry
    }
  }
}

export function prime(value, options) {
  const { key, duration } = options

  assert(!!key, 'prime requires a key')

  if (duration) {
    const interval = ms(duration)
    const now = Date.now()

    fileCache.setKey(key, {
      value,
      expires: now + interval,
      duration,
    })

    //fileCache.save(true) // TODO will this break?

    debug(`{ ${key} } has been primed to disk for ${duration}`)
  } else {
    memoryCache[key] = value
    debug(`{ ${key} } has been primed to memory`)
  }
}

export function expire(key) {
  fileCache.removeKey(key)
}

export async function cache(loading, options) {
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
    duration,
  })

  debug(`{ ${key} } has been cached for ${duration}`)

  return value
}

export function load(
  loader,
  options = {}
) {
  const { key, duration } = options

  assert(!!key, 'presta/load cache expects a key')

  if (duration) {
    const entry = getFromFileCache(key)

    if (entry) {
      // update duration
      if (duration !== entry.duration) {
        prime(entry.value, { key, duration })
      }

      return entry.value;
    }

    const loading = loader()

    requests.set(key, loading)

    cache(loading, { key, duration })

    loading.then(() => {
      requests.delete(key)
    })
  } else {
    const entry = memoryCache[key]

    if (entry) {
      debug(`{ ${key} } is cached in memory`)
      return entry;
    }

    const loading = loader()

    requests.set(key, loading)

    loading.then(res => {
      requests.delete(key)
      memoryCache[key] = res;

      debug(`{ ${key} } has been cached in memory`)
    })
  }
}

export async function render(
  component,
  ctx,
  renderer = (fn, ctx) => fn(ctx)
) {
  const body = renderer(component, ctx);

  if (!!requests.size) {
    await Promise.allSettled(Array.from(requests.values()));
    return render(component, ctx, renderer);
  }

  if (requests.size) {
    throw new Error(`presta/load - unresolved requests: ${JSON.stringify(Array.from(requests.keys()))}`)
  }

  fileCache.save(true)

  return {
    ...ctx,
    body: body + (ctx.body || ''),
    data: {
      ...memoryCache,
      ...fileCache.all(),
      ...(ctx.data || {}),
    },
  };
}

