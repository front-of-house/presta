import c from 'ansi-colors'

import { createCache } from './loadCache'

const { NODE_ENV } = process.env

const requests = {}
const errors = {}
export const loadCache = createCache('presta-load-cache')

function log (str: string) {
  if (NODE_ENV !== 'test') console.log(str)
}

export function loadError (key: string, e: Error) {
  log(`\n  ${c.red('error')} load { ${key} }\n\n${e}\n`)
  errors[key] = e
  delete requests[key]
}

export function prime (key: string, value: any, duration?: number) {
  loadCache.set(key, value, duration)
}

export async function cache (
  loader: () => Promise<any>,
  { key, duration }: { key: string; duration?: number }
) {
  let value = loadCache.get(key)

  if (!value) {
    value = await loader()
    loadCache.set(key, value, duration)
  }

  return value
}

export function load (
  loader: () => Promise<any>,
  { key, duration }: { key: string; duration?: number }
) {
  let value = loadCache.get(key)

  if (!value && !errors[key]) {
    // try/catch required for sync loaders
    try {
      requests[key] = loader()

      requests[key]
        .then((value: any) => {
          loadCache.set(key, value, duration)
          delete requests[key]
        })
        // catch async errors
        .catch((e: Error) => loadError(key, e))
    } catch (e) {
      loadError(key, e)
    }
  }

  delete errors[key]

  return value
}

export async function flush (run: () => any, data = {}) {
  const content = run()

  if (Object.keys(requests).length) {
    await Promise.allSettled(Object.values(requests))
    return flush(run, data)
  }

  return { content, data: loadCache.dump() }
}
