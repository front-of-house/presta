import path from 'path'
import { createPlugin, logger } from 'presta'
import { addHook } from 'pirates'
// @ts-ignore
import filewatcher from 'filewatcher'
import sync from 'tiny-glob/sync'

let watcher: ReturnType<typeof filewatcher>

const hash: {
  [parent: string]: string[]
} = {}

export default createPlugin(() => {
  return (config, hooks) => {
    if (config.env !== 'production' && !watcher) {
      watcher = filewatcher()

      watcher.on('change', (file: string) => {
        if (hash[file]) {
          logger.debug({
            level: logger.Levels.Debug,
            label: `@presta/source-filesystem`,
            message: `parent updated, reset`,
          })
          // parent file, reset everything
          watcher.remove(hash[file])
          hash[file].map((file) => watcher.remove(file))
        } else {
          logger.debug({
            level: logger.Levels.Debug,
            label: `@presta/source-filesystem`,
            message: `watched file updated build parent`,
          })

          outer: for (const parent of Object.keys(hash)) {
            for (const child of hash[parent]) {
              if (child === file) {
                hooks.emitBuildFile({ file: parent })
                continue outer
              }
            }
          }
        }
      })
    }

    // support .md
    const revert = addHook((code) => `module.exports = \`${code.replace(/`/g, '\\`')}\``, { exts: ['.md'] })

    logger.debug({
      level: logger.Levels.Debug,
      label: `@presta/source-filesystem`,
      message: `initialized`,
    })

    return {
      cleanup() {
        if (watcher) {
          watcher.removeAll()
          watcher = undefined
        }

        // otherwise we hook existing hooks recursively
        revert()

        logger.debug({
          level: logger.Levels.Debug,
          label: `@presta/source-filesystem`,
          message: `cleaned up`,
        })
      },
    }
  }
})

export function source(globs: string, parent: string) {
  const dirname = path.dirname(parent)
  const filepaths = ([] as string[])
    .concat(globs)
    .map((glob) => path.resolve(dirname, glob))
    .map((glob) => sync(glob, { absolute: true }))
    .flat()

  if (watcher) {
    setTimeout(() => {
      hash[parent] = hash[parent] || []
      hash[parent].push(...filepaths)
      watcher.add(parent)
      filepaths.map((file) => watcher.add(file))
    }, 100) // avoid race condition where cleanup happens after setup
  }

  return filepaths.map((filepath) => {
    delete require.cache[filepath]
    return [filepath, require(filepath)]
  })
}
