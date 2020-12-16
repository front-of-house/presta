import fs from 'fs-extra'
import path from 'path'
import c from 'ansi-colors'
import graph from 'watch-dependency-graph'
import globParent from 'glob-parent'
import chokidar from 'chokidar'

import { debug } from './debug'
import { CONFIG_DEFAULT, OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { createDynamicEntry } from './createEntries'
import { log, formatLog } from './log'
import { getFiles, isStatic, isDynamic } from './getFiles'
import { renderStaticEntries } from './renderStaticEntries'
import * as events from './events'
import { timer } from './timer'

export async function watch (config, options = {}) {
  debug('watch initialized with config', config)

  /*
   * Either the config the user specified, or the default path in case they
   * create a file
   */
  const configFilepath =
    config.configFilepath || path.join(config.cwd, CONFIG_DEFAULT)

  /*
   * Get files that match static/dynamic patters at startup
   */
  const files = getFiles(config)
  const staticIds = files.filter(isStatic)
  const dynamicIds = files.filter(isDynamic)

  /*
   * Create initial dynamic entry
   */
  createDynamicEntry(dynamicIds, config)

  /*
   * if the watch just restarted, rebuild everything
   *
   * TODO could avoid this by better confirWatcher
   */
  if (options.isRestart) {
    renderStaticEntries(staticIds, config, {
      watch: true
    })

    events.emit('refresh')
  }

  /*
   * Set up all watchers
   */
  const staticWatcher = graph() // static pages
  const dynamicWatcher = graph() // dynamic pages
  const configWatcher = graph() // dynamic pages
  // watcher for adding/removing of pages
  const entryWatcher = chokidar.watch(
    config.pages
      .map(p => path.resolve(config.cwd, p))
      .map(globParent)
      .concat(configFilepath),
    { ignoreInitial: true }
  )

  /*
   * Prior to reloading dynamic entry after any update, we need to clear the cache
   */
  function clearDynamicEntryCache () {
    delete require.cache[path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)]
  }

  function updateDynamicEntry (ids, config) {
    const time = timer()

    createDynamicEntry(ids, config)
    clearDynamicEntryCache()

    formatLog({
      color: 'green',
      action: 'build',
      meta: '⚡︎' + time(),
      description: ''
    })
  }

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

      updateDynamicEntry(dynamicIds, config)
    }

    // dynamicWatcher automatically stops watching deleted files

    events.emit('refresh')
  })
  dynamicWatcher.on('change', ([id]) => {
    const isDyn = isDynamic(id)
    const wasDyn = !!dynamicIds.find(i => i === id)

    if (isDyn && wasDyn) {
      debug('dynamicWatcher - reload dynamic file', id)

      clearDynamicEntryCache()
    } else if (!isDyn && wasDyn) {
      // some duplicate events come through, don't want to splice(-1, 1)
      if (dynamicIds.includes(id)) {
        debug('dynamicWatcher - un-configured dynamic file', id)

        dynamicIds.splice(dynamicIds.indexOf(id), 1)

        updateDynamicEntry(dynamicIds, config)
      }

      dynamicWatcher.remove(id) // can be added back by entryWatcher
    } else if (isDyn && !wasDyn) {
      // should never happen
      debug('dynamicWatcher - re-configured dynamic file', id)
    }

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

        const entry = staticIds.find(e => e === id)

        await renderStaticEntries([entry], config, {
          watch: true
        })
      } else if (!isStat && wasStat) {
        // some duplicate events come through, don't want to splice(-1, 1)
        if (staticIds.includes(id)) {
          debug('staticWatcher - remove static file', id)

          staticIds.splice(staticIds.indexOf(id), 1)
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
    debug('configWatcher - config changed', configFilepath)

    // clear config file for re-require
    delete require.cache[configFilepath]

    // safe require in case it's been removed
    try {
      const newConfig = require(configFilepath)
      // just continually merge updates, in case a combo of CLI and config options
      const mergedConfig = {
        ...config,
        ...newConfig
      }

      // only close these after we've safely require'd the new config file
      staticWatcher.close()
      dynamicWatcher.close()
      configWatcher.close()

      clearDynamicEntryCache()

      watch(
        {
          ...mergedConfig,
          pages: [].concat(mergedConfig.pages) // always an array
        },
        { isRestart: true }
      )
    } catch (e) {
      log(`\n  ${c.red('error')} ${configFilepath}\n\n  > ${e.stack || e}\n`)
    }
  })

  /*
   * entryWatcher watches the raw file globs passed to the CLI or as `pages` in
   * the config. If checks on add/change to see if a file should be upgraded to
   * a static/dynamic source file, and added to one of those specific
   * watchers.
   */
  entryWatcher.on('all', async (event, file) => {
    if (!/add|change/.test(event)) return
    if (fs.lstatSync(file).isDirectory()) return

    const isStat = isStatic(file)
    const isDyn = isDynamic(file)

    debug(`entryWatcher - ${event}`, { isStat, isDyn })

    if (isStat && !staticIds.includes(file)) {
      debug('entryWatcher - add static file')

      staticIds.push(file)

      await renderStaticEntries([file], config, {
        watch: true
      })

      staticWatcher.add(file)
    }

    if (isDyn && !dynamicIds.includes(file)) {
      debug('entryWatcher - add dynamic file')

      dynamicIds.push(file)

      updateDynamicEntry(dynamicIds, config)

      dynamicWatcher.add(file)
    }

    if (event === 'add' && file === configFilepath) {
      configWatcher.add(configFilepath)
    }

    events.emit('refresh')
  })

  /**
   * Init watching after event subscriptions
   */
  staticWatcher.add(staticIds)
  dynamicWatcher.add(dynamicIds)

  /*
   * Watch config and tree if available
   */
  if (fs.existsSync(configFilepath)) {
    configWatcher.add(configFilepath)
  }
}
