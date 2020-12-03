import fs from 'fs-extra'
import path from 'path'
import matched from 'matched'

import { CWD } from './constants'
import { ignoredFilesFilterer } from './ignore'

export function isDynamic (file) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file))
}

export function isStatic (file) {
  return /export\s.+\sgetPaths/.test(fs.readFileSync(file))
}

export function getFiles (...globs) {
  return globs
    .flat()
    .map(glob => matched.sync(glob))
    .flat()
    .map(file => path.relative(CWD, file)) // @see #14, make relative
    .filter(ignoredFilesFilterer)
    .map(file => path.resolve(CWD, file)) // make absolute again
}
