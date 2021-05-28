const fs = require('fs-extra')
const c = require('ansi-colors')
const graph = require('watch-dependency-graph')
const chokidar = require('chokidar')
const match = require('picomatch')

const { debug } = require('./debug')
const { createDynamicEntry } = require('./createDynamicEntry')
const { log, formatLog } = require('./log')
const { getFiles, isStatic, isDynamic } = require('./getFiles')
const { renderStaticEntries } = require('./renderStaticEntries')
const { timer } = require('./timer')
const { createConfig, removeConfigValues, getConfigFile } = require('./config')

function getFileIds (config) {
  const files = getFiles(config)

  return {
    staticIds: files.filter(isStatic),
    dynamicIds: files.filter(isDynamic)
  }
}

/*
 * Prior to reloading dynamic entry after any update, we need to clear the cache
 */
function clearDynamicEntryCache (config) {
  delete require.cache[config.dynamicEntryFilepath]
}

/*
 * Handles the actual writing of the dyanmic entry by updating the file and
 * then clearing require cache
 */
function updateDynamicEntry (ids, config) {
  const time = timer()

  createDynamicEntry(ids, config)
  clearDynamicEntryCache(config)

  // if user actually has routes configured, give feedback
  if (ids.length) {
    formatLog({
      color: 'green',
      action: 'build',
      meta: '⚡︎' + time(),
      description: ''
    })
  }
}

/**
 * Util for other helpers, like source
 */
async function buildFiles (ids, config) {
  const staticIds = ids.filter(isStatic)
  const dynamicIds = ids.filter(isDynamic)

  if (staticIds.length) {
    await renderStaticEntries(staticIds, config, {
      watch: true
    })
  }
  if (dynamicIds.length) updateDynamicEntry(dynamicIds, config)

  config.emitter.emit('refresh')
  config.emitter.emit('done', ids)
}

async function watch (config, options = {}) {
  debug('watch initialized with config', config)

  let hasConfigFile = !!Object.keys(config.configFile).length

  /*
   * Get files that match static/dynamic patters at startup
   */
  let { staticIds, dynamicIds } = getFileIds(config)

  if (!staticIds.length && !dynamicIds.length) {
    log(`  ${c.gray('no files configured')}\n`)
  }

  /*
   * Create initial dynamic entry regardless of if the user has routes, bc we
   * need this file to serve 404
   */
  updateDynamicEntry(dynamicIds, config)

  /*
   * Set up all watchers
   */
  const watchOptions = { alias: { '@': config.cwd } }
  const staticWatcher = graph(watchOptions) // static pages
  const dynamicWatcher = graph(watchOptions) // dynamic pages
  const configWatcher = graph(watchOptions) // dynamic pages
  const globalWatcher = chokidar.watch(config.cwd, {
    ignoreInitial: true,
    ignored: [config.merged.output, config.merged.assets]
  })

  async function handleConfigUpdate () {
    // stop watching previous pages
    staticWatcher.remove(staticIds)
    dynamicWatcher.remove(dynamicIds)

    // get new file ids
    const ids = getFileIds(config)

    // set local values
    staticIds = ids.staticIds
    dynamicIds = ids.dynamicIds

    // re-render everything
    updateDynamicEntry(dynamicIds, config)
    await renderStaticEntries(staticIds, config, { watch: true })

    // start watching new files ids
    staticWatcher.add(staticIds)
    dynamicWatcher.add(dynamicIds)

    // refresh server
    config.emitter.emit('refresh')
  }

  /*
   * dynamicWatcher monitors files that were determined to be dynamic at
   * startup. If a file is updated to remove the exported route, or the file is
   * deleted, the watcher stops watching the file and we remove it from the
   * server. Otherwise, just reload the page if needed.
   *
   * on 'remove', the file is automatically removed from the watch, so no need
   * to handle that here
   */
  dynamicWatcher.on('remove', ([id]) => {
    // some duplicate events come through, don't want to splice(-1, 1)
    if (dynamicIds.includes(id)) {
      debug('dynamicWatcher - deleted dynamic file', id)

      dynamicIds.splice(dynamicIds.indexOf(id), 1)

      updateDynamicEntry(dynamicIds, config)
    }

    config.emitter.emit('refresh')
    config.emitter.emit('remove', [id])
  })
  dynamicWatcher.on('change', ([id]) => {
    const isDyn = isDynamic(id)
    const wasDyn = !!dynamicIds.find(i => i === id)

    if (isDyn && wasDyn) {
      debug('dynamicWatcher - reload dynamic file', id)

      clearDynamicEntryCache(config)
    } else if (!isDyn && wasDyn) {
      // some duplicate events come through, don't want to splice(-1, 1)
      if (dynamicIds.includes(id)) {
        debug('dynamicWatcher - un-configured dynamic file', id)

        dynamicIds.splice(dynamicIds.indexOf(id), 1)

        updateDynamicEntry(dynamicIds, config)
      }

      dynamicWatcher.remove(id) // can be added back by globalWatcher
    } else if (isDyn && !wasDyn) {
      // should never happen
      debug('dynamicWatcher - re-configured dynamic file', id)
    }

    config.emitter.emit('refresh')
    config.emitter.emit('done', [id])
  })
  dynamicWatcher.on('error', e => {
    log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
  })

  /*
   * staticWatcher, again, monitors only files that matched the required static
   * exports as startup. Here they can be removed by deletion or un-configuring
   * the static exports. globalWatcher also manages adding them back when deleted.
   *
   * on 'remove', the file is automatically removed from the watch, so no need
   * to handle that here
   */
  staticWatcher.on('remove', ids => {
    for (const id of ids) {
      // some duplicate events come through, don't want to splice(-1, 1)
      if (staticIds.includes(id)) {
        debug('staticWatcher - deleted static file', id)

        staticIds.splice(staticIds.indexOf(id), 1)

        // TODO remove built files here, probably
      }
    }

    config.emitter.emit('refresh')
    config.emitter.emit('remove', ids)
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
        // should never happen
        debug('staticWatcher - re-configured static file', id)
      }
    }

    config.emitter.emit('refresh')
    config.emitter.emit('done', ids)
  })
  staticWatcher.on('error', e => {
    log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
  })

  /*
   * configWatcher is intentionally naive bc any 'change' events could be
   * triggered by imported modules down the tree, and *could* affect the output
   * files. Without extensive AST traversal, we can't know if a change is
   * meaningful or not, so we err on the side of caution and just render
   * everything.
   *
   *    - on remove, re-render everything
   *    - on change, re-render everything
   *    - on add (via globalWatcher), re-render everything
   */
  configWatcher.on('remove', async files => {
    debug('configWatcher - config removed')

    if (files[0] === config.configFilepath) {
      // filter out values from the config file
      config = removeConfigValues()

      handleConfigUpdate()
    }
  })
  configWatcher.on('change', async () => {
    debug('configWatcher - config changed')

    // clear config file for re-require
    delete require.cache[config.configFilepath]

    try {
      // merge in new values from config file
      config = createConfig({
        configFile: getConfigFile(config.configFilepath)
      })

      handleConfigUpdate()
    } catch (e) {
      log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
    }
  })
  configWatcher.on('error', e => {
    log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
  })

  /*
   * globalWatcher watches the raw file globs passed to the CLI or as `pages` in
   * the config. If checks on add/change to see if a file should be upgraded to
   * a static/dynamic source file, and added to one of those specific
   * watchers. It also watches for addition of a config file.
   */
  globalWatcher.on('all', async (event, file) => {
    // ignore events handled by wdg, or any directory events
    if (
      !/add|change/.test(event) ||
      !fs.existsSync(file) ||
      fs.lstatSync(file).isDirectory()
    )
      return

    // if a file change matches any pages globs
    if (match(config.merged.files)(file)) {
      const isStat = isStatic(file)
      const isDyn = isDynamic(file)

      // new static file, render it
      // TODO Should I check staticIds or the ids from the watcher instances
      if (isStat && !staticIds.includes(file)) {
        debug('globalWatcher - add static file')

        // add these first in case render fails
        staticIds.push(file)
        staticWatcher.add(file)

        await renderStaticEntries([file], config, {
          watch: true
        })

        config.emitter.emit('refresh')
        config.emitter.emit('done', [file])
      }

      // new dynamice file, add it
      if (isDyn && !dynamicIds.includes(file)) {
        debug('globalWatcher - add dynamic file')

        // add these first in case render fails
        dynamicIds.push(file)
        dynamicWatcher.add(file)

        updateDynamicEntry(dynamicIds, config)

        config.emitter.emit('refresh')
        config.emitter.emit('done', [file])
      }
    }

    // if file matches config file and we don't already have one
    if (file === config.configFilepath && !hasConfigFile) {
      debug('globalWatcher - add config file')

      configWatcher.add(config.configFilepath)

      try {
        // merge in new values from config file
        config = createConfig({
          configFile: getConfigFile(config.configFilepath)
        })

        hasConfigFile = true

        handleConfigUpdate()
      } catch (e) {
        log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
      }
    }
  })

  /**
   * Init watching after event subscriptions
   */
  staticWatcher.add(staticIds)
  dynamicWatcher.add(dynamicIds)

  /*
   * Watch config and tree if available
   */
  if (fs.existsSync(config.configFilepath)) {
    configWatcher.add(config.configFilepath)
  }

  try {
    staticIds.map(require)
    dynamicIds.map(require)
  } catch (e) {
    log(`\n  ${c.red('error')}\n\n  > ${e.stack || e}\n`)
  }
}

module.exports = { buildFiles, watch }
