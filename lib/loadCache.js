const fs = require('fs')
const path = require('path')

const PRESTA_ENV = process.env.PRESTA_ENV || 'production'

function write (filepath, json) {
  if (PRESTA_ENV !== 'production')
    fs.writeFileSync(filepath, JSON.stringify(json), 'utf-8')
}

function createCache (name, { dir = process.cwd() } = {}) {
  const filename = '.' + name
  const filepath = path.join(dir, filename)

  if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, '{}', 'utf-8')

  let cache = JSON.parse(fs.readFileSync(filepath))

  return {
    get (key) {
      const [value, expiration] = cache[key] || []

      if (expiration !== null && Date.now() > expiration) {
        delete cache[key]
        write(filepath, cache)
        return undefined
      } else {
        return value
      }
    },
    set (key, value, duration) {
      const expiration = duration ? Date.now() + duration : null
      cache[key] = [value, expiration]

      if (expiration) write(filepath, cache)
    },
    clear (key) {
      delete cache[key]
      write(filepath, cache)
    },
    clearAllMemory () {
      for (const key of Object.keys(cache)) {
        const [value, expiration] = cache[key] || []
        if (!expiration) delete cache[key]
      }
    },
    cleanup () {
      cache = {}
      fs.unlinkSync(filepath)
    },
    dump () {
      const res = {}

      for (const key of Object.keys(cache)) {
        res[key] = cache[key][0]
      }

      return res
    }
  }
}

module.exports = { createCache }
