const matched = require('matched')
const callsites = require('callsites')
const filewatcher = require('filewatcher')

const { getCurrentConfig } = require('./lib/config')

// use these to trigger the corrent renderer
const { isStatic, isDynamic } = require('./lib/getFiles')

const hash = {}
const watcher = filewatcher()

watcher.on('change', (file, stat) => {
  console.log(file)
})

function source (...globs) {
  const key = JSON.stringify(globs)

  if (hash[key]) {
    return hash[key]
  }

  const { env, cwd, merged: config } = getCurrentConfig()
  const parent = callsites()[1].getFileName() // file that called source()
  const files = matched.sync(globs, { cwd })

  hash[key] = files

  // watcher.add(files)

  return files
}

module.exports = {
  source
}
