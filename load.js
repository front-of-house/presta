const assert = require('assert')
const ms = require('ms')
const flatCache = require('flat-cache')
const c = require('ansi-colors')

const { debug } = require('./lib/debug')
const { log } = require('./lib/log')

const cwd = process.cwd()
const { PRESTA_ENV } = process.env

let memory = {}
const requests = {}

const persistent = flatCache.load('.presta', cwd)

function clearMemoryCache () {
  memory = {}
}

function prime (value, { key, duration } = {}) {
  assert(!!key, 'presta/load requires a key')

  const persist = !!duration && PRESTA_ENV !== 'production'

  if (persist) {
    const interval = ms(duration)

    persistent.setKey(key, {
      value,
      expires: Date.now() + interval,
      duration
    })

    persistent.save(true)
  } else {
    memory[key] = value
  }

  debug(
    `{ ${key} } has been cached ${
      persist ? `to disk for ${duration}` : 'in memory'
    }`
  )
}

function cache (loader, { key, duration } = {}) {
  const persist = !!duration && PRESTA_ENV !== 'production'

  // try in-memory first
  let entry = memory[key]
  let hasEntry = memory.hasOwnProperty(key)

  // try file cache
  if (persist) {
    const cached = persistent.getKey(key)

    if (cached) {
      if (Date.now() > cached.expires || duration !== cached.duration) {
        debug(`{ ${key} } has expired on disk`)

        persistent.removeKey(key)
      } else {
        debug(`{ ${key} } is cached on disk`)

        entry = cached.value
        hasEntry = true
      }
    }
  }

  if (hasEntry) return entry

  return (typeof loader === 'function' ? loader() : loader).then(res => {
    prime(res, { key, duration })
    return res
  })
}

function load (loader, { key, duration } = {}) {
  function error (e) {
    log(`\n  ${c.red('error')} load { ${key} }\n\n${e}\n`)

    // reset
    delete requests[key]

    // fallback or set to error object
    memory[key] = memory[key] || e

    const cached = persistent.getKey(key)

    // use previous responses or return error
    return cached ? cached.value : memory[key]
  }

  try {
    if (!memory.hasOwnProperty(key)) requests[key] = loader()

    const res = cache(requests[key], { key, duration })

    if (res.then) {
      res.catch(error)
      return undefined
    } else {
      // done loading
      delete requests[key]
      return res
    }
  } catch (e) {
    error(e)
  }
}

async function render (
  template,
  context,
  renderer = (fn, context) => fn(context) // for a custom render, like React
) {
  const content = renderer(template, context)

  if (Object.keys(requests).length) {
    await Promise.allSettled(Object.values(requests))
    return render(template, context, renderer)
  }

  context.props.content = content
  context.props.data = {
    ...memory,
    ...persistent.all()
  }

  return context
}

async function flush (run, data = {}) {
  const content = run()

  if (Object.keys(requests).length) {
    await Promise.allSettled(Object.values(requests))
    return flush(run, data)
  }

  const cached = persistent.all()

  data = {
    ...memory,
    ...Object.keys(cached).reduce((res, k) => {
      res[k] = cached[k].value
      return res
    }, {})
  }

  return { content, data }
}

module.exports = {
  persistent,
  clearMemoryCache,
  prime,
  cache,
  load,
  render,
  flush
}
