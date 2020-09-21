import fs from 'fs-extra'
import ignore from 'ignore'

const cwd = process.cwd()

let ignoreFile = ''
try {
  ignoreFile = fs.readFileSync(path.join(cwd, '.gitignore'), 'utf-8')
} catch (e) {}

export const ignoredFilesArray = ignoreFile.split(/\n/gm).filter(Boolean)
export const ignoredFilesFilterer = ignore()
  .add(ignoredFilesArray)
  .createFilter()
