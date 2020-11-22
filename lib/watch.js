import path from 'path'
import c from 'ansi-colors'
import graph from 'watch-dependency-graph'
import globParent from 'glob-parent'
import chokidar from 'chokidar'

import { debug } from './debug'
import {
  CWD,
  CONFIG_DEFAULT,
  TMP_DYNAMIC,
  OUTPUT_DYNAMIC_PAGES_ENTRY
} from './constants'
import { createStaticEntry, createDynamicEntry } from './createEntries'
import { log } from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { safeRequire } from './safeRequire'
import { ignoredFilesArray } from './ignore'
import { set as setConfig } from './config'
import { renderStaticEntries } from './renderStaticEntries'
import * as events from './events'

import { clearMemoryCache } from '../load'

export async function watch (config, options = {}) {
  debug('watch initialized with config', config)

  /*
   * Set computed config for later use
   */
  setConfig(config)

  /*
   * Either the config the user specified, or the default path in case they
   * create a file
   */
  const configPath = config.configFile || path.join(CWD, CONFIG_DEFAULT)

  /*
   * Get files that match static/dynamic patters at startup
   */
  let staticIds = getFiles(config.pages).filter(isStatic)
  let dynamicIds = getFiles(config.pages).filter(isDynamic)

  /*
   * Create initial static and dynamic entries
   */
  let staticEntries = staticIds.map(id =>
    createStaticEntry(id, TMP_DYNAMIC, config)
  )
  createDynamicEntry(dynamicIds, config)

  /*
   * if the watch just restarted, rebuild everything
   *
   * TODO could avoid this by better confirWatcher
   */
  if (options.isRestart) {
    renderStaticEntries(staticEntries, config, {
      watch: true
    })

    events.emit('refresh')
  }

  /*
   * Set up all watchers
   */
  const staticWatcher = graph() // static pages
  const dynamicWatcher = graph() // dynamic pages
  // config file watcher only
  const configWatcher = chokidar.watch(configPath, {
    ignore: ignoredFilesArray,
    ignoreInitial: true
  })
  // watcher for adding/removing of pages
  const entryWatcher = chokidar.watch(
    config.pages.map(p => path.resolve(CWD, p)).map(globParent),
    { ignore: ignoredFilesArray, ignoreInitial: true }
  )

  /*
   * dynamicWatcher monitors files that were determined to be dynamic at
   * startup. If a file is updated to remove the exported route, or the file is
   * deleted, the watcher stops watching the file and we remove it from the
   * server. Otherwise, just reload the page if needed.
   */
  dynamicWatcher.on('remove', ([id]) => {
    // some duplicate events come through, don't want to splice(-1, 1)
    if (dynamicIds.includes(id)) {
      debug('dynamicWatcher - deleted dynamic file', id)

      dynamicIds.splice(dynamicIds.indexOf(id), 1)

      createDynamicEntry(dynamicIds, config)
    }

    // clear so updates come through
    delete require.cache[path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)]

    // dynamicWatcher automatically stops watching deleted files

    events.emit('refresh')
  })
  dynamicWatcher.on('change', ([id]) => {
    const isDyn = isDynamic(id)
    const wasDyn = !!dynamicIds.find(i => i === id)

    if (isDyn && wasDyn) {
      debug('dynamicWatcher - reload dynamic file', id)
    } else if (!isDyn && wasDyn) {
      // some duplicate events come through, don't want to splice(-1, 1)
      if (dynamicIds.includes(id)) {
        debug('dynamicWatcher - un-configured dynamic file', id)

        dynamicIds.splice(dynamicIds.indexOf(id), 1)

        createDynamicEntry(dynamicIds, config)
      }

      dynamicWatcher.remove(id) // can be added back by entryWatcher
    } else if (isDyn && !wasDyn) {
      debug('dynamicWatcher - re-configured dynamic file', id)
    }

    // clear so updates come through
    delete require.cache[path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)]

    events.emit('refresh')
  })

  /*
   * staticWatcher, again, monitors only files that matched the required static
   * exports as startup. Here they can be removed by deletion or un-configuring
   * the static exports. entryWatcher also manages adding them back when deleted.
   */
  staticWatcher.on('remove', ids => {
    for (const id of ids) {
      // some duplicate events come through, don't want to splice(-1, 1)
      if (staticIds.includes(id)) {
        debug('staticWatcher - deleted static file', id)

        staticIds.splice(staticIds.indexOf(id), 1)

        const index = staticEntries.findIndex(e => e.sourceFile === id)

        staticEntries.splice(index, 1)
      }
    }

    // staticWatcher automatically stops watching deleted files

    events.emit('refresh')
  })
  staticWatcher.on('change', async ids => {
    for (const id of ids) {
      const isStat = isStatic(id)
      const wasStat = !!staticIds.find(e => e === id)

      if (isStat && wasStat) {
        debug('staticWatcher - render static file', id)

        const entry = staticEntries.find(e => e.sourceFile === id)

        await renderStaticEntries([entry], config, {
          watch: true
        })
      } else if (!isStat && wasStat) {
        // some duplicate events come through, don't want to splice(-1, 1)
        if (staticIds.includes(id)) {
          debug('staticWatcher - remove static file', id)

          staticIds.splice(staticIds.indexOf(id), 1)

          const index = staticEntries.findIndex(e => e.sourceFile === id)

          staticEntries.splice(index, 1)
        }

        staticWatcher.remove(id)
      } else if (isStat && !wasStat) {
        debug('staticWatcher - re-configured static file', id)
      }
    }

    events.emit('refresh')
  })

  /*
   * configWatcher for the moment is very naive. If it changes, we just restart
   * everything and rebuild all files (since their config might contain
   * templating).
   *
   * TODO In the future we could probably be smarter about this.
   */
  configWatcher.on('change', async file => {
    debug('configWatcher - config changed', configPath)

    staticWatcher.close()
    dynamicWatcher.close()
    configWatcher.close()

    // clear config file for re-require
    delete require.cache[configPath]

    // safe require in case it's been removed
    const newConfig = safeRequire(configPath, {})

    // just continually merge updates, in case a combo of CLI and config options
    const mergedConfig = {
      ...config,
      ...newConfig
    }

    watch(
      {
        ...mergedConfig,
        pages: [].concat(mergedConfig.pages) // always an array
      },
      { isRestart: true }
    )
  })

  /*
   * entryWatcher watches the raw file globs passed to the CLI or as `pages` in
   * the config. If checks on add/change to see if a file should be upgraded to
   * a static/dynamic source file, and added to one of those specific
   * watchers.
   */
  entryWatcher.on('all', async (event, file) => {
    if (!/add|change/.test(event)) return

    const isStat = isStatic(file)
    const isDyn = isDynamic(file)

    debug(`entryWatcher - ${event}`, { isStat, isDyn })

    if (isStat && !staticIds.includes(file)) {
      debug('entryWatcher - add static file')

      staticIds.push(file)

      const entry = createStaticEntry(file, TMP_DYNAMIC, config)

      staticEntries.push(entry)

      await renderStaticEntries([entry], config, {
        watch: true
      })

      staticWatcher.add(file)
    }

    if (isDyn && !dynamicIds.includes(file)) {
      debug('entryWatcher - add dynamic file')

      dynamicIds.push(file)

      createDynamicEntry(dynamicIds, config)

      dynamicWatcher.add(file)
    }

    events.emit('refresh')
  })

  /**
   * Init watching after event subscriptions
   */
  staticWatcher.add(staticIds)
  dynamicWatcher.add(dynamicIds)
}
