import path from 'path'
import ms from 'ms'
import flatCache from 'flat-cache'

type Loader = () => Promise<any>
type Options = {
  key: string;
  duration: string;
}
type Entry = {
  value: any;
  expires: number;
}

const cwd = process.cwd()
const c = flatCache.load('presta', path.resolve(cwd, './.presta/cache'));

export async function cache(loader: Loader, options: Options) {
  const { key, duration } = options
  const interval = ms(duration)

  const entry: Entry = c.getKey(key)
  const now = Date.now()

  if (entry) {
    const { expires } = entry

    if (now > expires) {
      c.removeKey(key)
    } else {
      return entry.value
    }
  }

  const value = await loader()

  c.setKey(key, {
    value,
    expires: now + interval,
  })

  return value
}
