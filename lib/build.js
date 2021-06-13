const fs = require('fs-extra')
const path = require('path')
const c = require('ansi-colors')

const { debug } = require('./debug')
const { createDynamicEntry } = require('./createDynamicEntry')
const { log, formatLog } = require('./log')
const { getFiles, isStatic, isDynamic } = require('./getFiles')
const { renderStaticEntries } = require('./renderStaticEntries')
const { timer } = require('./timer')
const { compile } = require('./compile')
const { OUTPUT_STATIC_DIR } = require('./constants')

async function build (config, options = {}) {
  debug('watch initialized with config', config)

  const totalTime = timer()
  const files = getFiles(config)
  const staticIds = files.filter(isStatic)
  const dynamicIds = files.filter(isDynamic)

  if (!staticIds.length && !dynamicIds.length) {
    log(`  ${c.gray('nothing to build')}\n`)
  } else {
    let staticTime = 0
    let staticFileAmount = 0
    let dynamicTime = 0
    let copyTime = 0

    const tasks = await Promise.allSettled([
      (async () => {
        if (staticIds.length) {
          const time = timer()

          const { allGeneratedFiles } = await renderStaticEntries(
            staticIds,
            config
          )

          staticTime = time()
          staticFileAmount = allGeneratedFiles.length
        }
      })(),
      (async () => {
        if (dynamicIds.length) {
          const time = timer()

          createDynamicEntry(dynamicIds, config)

          await compile(config)

          dynamicTime = time()

          formatLog({
            color: 'green',
            action: 'build',
            meta: '⚡︎' + dynamicTime,
            description: ''
          })
        }
      })(),
      (async () => {
        if (fs.existsSync(config.merged.assets)) {
          const time = timer()

          fs.copySync(
            config.merged.assets,
            path.join(config.merged.output, OUTPUT_STATIC_DIR)
          )

          copyTime = time()
        }
      })()
    ])

    // since we're building (not watch) if any task fails, exit with error
    if (tasks.find(task => task.status === 'rejected')) {
      // log out errors
      tasks
        .filter(task => task.status === 'rejected')
        .forEach(task =>
          log(
            `\n  ${c.red('error')}\n\n  > ${task.reason.stack || task.reason}\n`
          )
        )

      process.exit(1)
      return
    }

    log('')

    if (staticTime) {
      log(
        `  ${c.blue(`static`)} ${c.gray(
          `built ${staticFileAmount} files in ${staticTime}`
        )}`
      )
    }

    if (dynamicTime) {
      log(
        `  ${c.blue(`dynamic`)} ${c.gray(
          `compiled function in ${dynamicTime}`
        )}`
      )
    }

    if (copyTime) {
      log(`  ${c.blue(`copied`)} ${c.gray(`static assets in ${copyTime}`)}`)
    }

    if (staticTime || dynamicTime) {
      log('') // leave a 1-line buffer

      log(`  ${c.blue(`build complete`)} ${c.gray(`in ${totalTime()}`)}`)

      log('') // leave a 1-line buffer
    }
  }
}

module.exports = { build }
