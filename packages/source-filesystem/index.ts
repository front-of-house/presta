import path from 'path'
import { getCurrentPrestaInstance } from 'presta'
import { addHook } from 'pirates'
// @ts-ignore
import filewatcher from 'filewatcher'
import sync from 'tiny-glob/sync'

let watcher: filewatcher

const hash: {
  [parent: string]: string[]
} = {}

export function createPlugin() {
  return () => {
    watcher = filewatcher()

    watcher.on('change', (file: string) => {
      if (hash[file]) {
        // parent file, reset everything
        watcher.remove(hash[file])
        hash[file].map((file) => watcher.remove(file))
      } else {
        // watched file
        getCurrentPrestaInstance().actions.build(file)
      }
    })

    // support .md
    addHook((code) => `module.exports = \`${code.replace(/`/g, '\\`')}\``, { exts: ['.md'] })
  }
}

export function source(globs: string, parent: string) {
  const dirname = path.dirname(parent)
  const filepaths = ([] as string[])
    .concat(globs)
    .map((glob) => path.resolve(dirname, glob))
    .map((glob) => sync(glob, { absolute: true }))
    .flat()

  setTimeout(() => {
    hash[parent] = hash[parent] || []
    hash[parent].push(...filepaths)
    watcher.add(parent)
    filepaths.map((file) => watcher.add(file))
  }, 100) // avoid race condition where cleanup happens after setup

  return filepaths.map((filepath) => {
    delete require.cache[filepath]
    return [filepath, require(filepath)]
  })
}
