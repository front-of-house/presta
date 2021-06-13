const c = require('ansi-colors')

const { createCache } = require('./loadCache')

const { NODE_ENV } = process.env

const requests = {}
const errors = {}
const loadCache = createCache('presta-load-cache')

function log (str) {
  if (NODE_ENV !== 'test') console.log(str)
}

function loadError (key, e) {
  log(`\n  ${c.red('error')} load { ${key} }\n\n${e}\n`)
  errors[key] = e
  delete requests[key]
}

function prime (key, value, duration) {
  loadCache.set(key, value, duration)
}

async function cache (loader, { key, duration }) {
  let value = loadCache.get(key)

  if (!value) {
    value = await loader()
    loadCache.set(key, value, duration)
  }

  return value
}

function load (loader, { key, duration }) {
  let value = loadCache.get(key)

  if (!value && !errors[key]) {
    // try/catch required for sync loaders
    try {
      requests[key] = loader()

      requests[key]
        .then(value => {
          loadCache.set(key, value, duration)
          delete requests[key]
        })
        // catch async errors
        .catch(e => loadError(key, e))
    } catch (e) {
      loadError(key, e)
    }
  }

  delete errors[key]

  return value
}

async function flush (run, data = {}) {
  const content = run()

  if (Object.keys(requests).length) {
    await Promise.allSettled(Object.values(requests))
    return flush(run, data)
  }

  return { content, data: loadCache.dump() }
}

module.exports = {
  loadCache,
  prime,
  cache,
  load,
  flush
}
