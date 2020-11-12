import path from 'path'
import matched from 'matched'

import { CWD } from './constants'
import { isStaticallyExportable } from './isStaticallyExportable'
import { ignoredFilesFilterer } from './ignore'

export function getValidFilesArray (...globs) {
  return globs
    .flat()
    .map(glob => matched.sync(glob))
    .flat()
    .map(file => path.relative(CWD, file)) // @see #14
    .filter(ignoredFilesFilterer)
    .filter(isStaticallyExportable)
}
