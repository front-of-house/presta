import c from 'ansi-colors'

import { createCache } from './lib/loadCache'

const { NODE_ENV } = process.env

const requests = {}
const errors = {}
export const loadCache = createCache('presta-load-cache')

export const log = (str: string) => {
  if (NODE_ENV !== 'test') console.log(str)
}

export const loadError = (key: string, e: any) => {
  log(`\n  ${c.red('error')} load { ${key} }\n\n${e}\n`)
  errors[key] = e
  delete requests[key]
}

export const prime = (key: string, value: any, duration?: number) => {
  loadCache.set(key, value, duration)
}

export const cache = async (loader: () => Promise<any>, { key, duration }: { key: string, duration?: number }) => {
  let value = loadCache.get(key)

  if (!value) {
    value = await loader()
    loadCache.set(key, value, duration)
  }

  return value
}

export const load = (loader: () => Promise<any>, { key, duration }: { key: string, duration?: number }) => {
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
        .catch((e: any) => loadError(key, e))
    } catch (e) {
      loadError(key, e)
    }
  }

  delete errors[key]

  return value
}

export const flush = async (run: () => any, data: any = {}) => {
  const content = run()

  if (Object.keys(requests).length) {
    await Promise.allSettled(Object.values(requests))
    return flush(run, data)
  }

  return { content, data: loadCache.dump() }
}