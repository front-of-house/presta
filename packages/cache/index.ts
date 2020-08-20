import path from 'path'
import ms from 'ms'
import flatCache from 'flat-cache'
import createDebug from 'debug'
import assert from 'assert'

type Loader = () => Promise<any>
type Options = {
  key: string;
  duration: string;
}
type Entry = {
  value: any;
  expires: number;
}

const debug = createDebug('presta-cache')
const cwd = process.cwd()
const dir = path.resolve(cwd, './.presta/cache')
const c = flatCache.load('presta', path.resolve(cwd, './.presta/cache'));

debug(`@presta/cache at ${dir}`)

export async function cache(loader: Loader, options: Options) {
  const { key, duration } = options

  assert(!!key, '@presta/cache expects a key')
  assert(!!duration, '@presta/cache expects a duration')

  const interval = ms(duration)

  const entry: Entry = c.getKey(key)
  const now = Date.now()

  if (entry) {
    const { expires } = entry

    if (now > expires) {
      debug(`${key} has expired`)
      c.removeKey(key)
    } else {
      debug(`${key} is cached`)
      return entry.value
    }
  }

  const value = await loader()

  c.setKey(key, {
    value,
    expires: now + interval,
  })

  c.save(true)

  debug(`${key} has been cached for ${duration}`)

  return value
}
