const fs = require('fs-extra')
const path = require('path')
const matched = require('matched')
const callsites = require('callsites')
const chokidar = require('chokidar')
const match = require('picomatch')

const { getCurrentConfig } = require('./lib/config')
const { buildFiles } = require('./lib/watch')

let ready // flag for global watch.js wathcers
let watcher // single chokidar watcher

const pid = process.pid
const cwd = process.cwd()

// process specific hashes to manage listeners
const rootCounters = { [pid]: {} }
const sourcesToRootsMaps = { [pid]: {} }
const rootsToSourcesMaps = { [pid]: {} }
const rootsToGlobsMaps = { [pid]: {} }

function createUrlFromFilepath ({ filepath, baseDir }) {
  return filepath.split(baseDir)[1].split('.')[0]
}

function createDefaultExtensions ({ baseDir }) {
  return {
    md (filepath) {
      const p = createUrlFromFilepath({ filepath, baseDir })

      return {
        [p]: fs.readFileSync(filepath, 'utf8')
      }
    }
  }
}

function source (globs, { baseDir = cwd, extensions } = {}) {
  /*
   * Current process variables
   */
  const rootCounter = rootCounters[pid]
  const sourcesToRootsMap = sourcesToRootsMaps[pid]
  const rootsToSourcesMap = rootsToSourcesMaps[pid]
  const rootsToGlobsMap = rootsToGlobsMaps[pid]

  const config = getCurrentConfig() // current process config
  const { env, emitter } = config
  const root = callsites()[1].getFileName() // file that just called source()

  /*
   * Normalize values
   */
  baseDir = path.resolve(path.dirname(root), baseDir)
  globs = [].concat(globs).map(g => path.resolve(baseDir, g))
  extensions = {
    ...createDefaultExtensions({ baseDir }),
    ...extensions
  }

  /*
   * Sourced files
   */
  const files = globs
    .map(glob => matched.sync(glob, { cwd: baseDir }))
    .flat()
    .map(fp => path.resolve(baseDir, fp))

  /*
   * If we're in watch mode, set up listeners
   */
  if (env === 'development') {
    rootsToGlobsMap[root] = globs

    rootCounter[root] = rootCounter[root] || {
      prevCallCount: 0,
      callCount: 0
    }

    function processNewSource (s, r) {
      sourcesToRootsMap[s] = sourcesToRootsMap[s] || new Set()
      sourcesToRootsMap[s].add(r)

      rootsToSourcesMap[r] = rootsToSourcesMap[r] || new Set()
      rootsToSourcesMap[r].add(s)
    }

    /**
     * Map sourced file to the root that sourced it.
     * Call this EVERY render to source new files.
     */
    for (const source of files) {
      processNewSource(source, root)
    }

    if (!ready) {
      ready = true

      /*
       * Clean up all source files on remove of root file
       */
      function cleanupOnRootRemoval (currentRoot) {
        // first clear the deleted root file from any files
        for (const source of rootsToSourcesMap[currentRoot]) {
          sourcesToRootsMap[source].delete(currentRoot)
        }

        delete rootsToSourcesMap[currentRoot]
        delete rootCounter[currentRoot]
        delete rootsToGlobsMap[currentRoot]
      }

      /*
       * These emitters are set up in watch.js, the main watcher. They
       * watch the root files (pages) themselves.
       */
      emitter.on('done', ([file]) => {
        const currentRoot = Object.keys(rootCounter).find(root => root === file)

        if (currentRoot) {
          const cache = rootCounter[currentRoot]

          /*
           * If source() hasn't been called again, it's been deleted
           * or commented out.
           */
          if (cache.callCount === cache.prevCallCount) {
            console.log('cleanup')
            cleanupOnRootRemoval(currentRoot)
            console.log(rootsToSourcesMap)
          } else {
            /*
             * Inc prev call count for this particular root file
             * so that it's ready for next render
             */
            rootCounter[currentRoot].prevCallCount =
              rootCounter[currentRoot].callCount
          }
        }
      })
      emitter.on('remove', ([file]) => {
        const currentRoot = Object.keys(rootCounter).find(root => root === file)
        if (currentRoot) cleanupOnRootRemoval(currentRoot)
      })
    }

    // init filewatcher for sourced files
    if (!watcher) {
      watcher = chokidar.watch(baseDir, {
        ignoreInitial: true
      })
      watcher.on('all', (event, filepath) => {
        if (fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory())
          return

        if (/add|change/.test(event)) {
          for (const r of Object.keys(rootsToGlobsMap)) {
            if (match.isMatch(filepath, rootsToGlobsMap[r])) {
              processNewSource(filepath, r)
            }
          }
        }

        const roots = Array.from(sourcesToRootsMap[filepath] || [])
        if (roots.length) buildFiles(roots, config)

        // if remove, remove last
        if (event === 'unlink') {
          for (const r of Object.keys(rootsToGlobsMap)) {
            if (match.isMatch(filepath, rootsToGlobsMap[r])) {
              sourcesToRootsMap[filepath].delete(r)
              rootsToSourcesMap[r].delete(filepath)
            }
          }
        }
      })
    }

    /*
     * Inc call count for this particular root file
     */
    ++rootCounter[root].callCount
  }

  /*
   * Outside watch mode, just read files and return
   */

  const results = files.map(fp => {
    const extension = path.extname(fp).split('.')[1]
    return extensions[extension](fp)
  })

  return {
    files,
    paths: results.reduce((paths, res) => {
      return paths.concat(Object.keys(res))
    }, []),
    sources: results.reduce((files, res) => {
      return Object.assign(files, res)
    }, {})
  }
}

module.exports = {
  createUrlFromFilepath,
  source
}
