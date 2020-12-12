import fs from 'fs-extra'
import path from 'path'
import matched from 'matched'

export function isDynamic (file) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file))
}

export function isStatic (file) {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file))
}

export function getFiles ({ cwd, pages }) {
  return []
    .concat(pages)
    .map(glob => matched.sync(glob, { cwd }))
    .flat()
    .map(file => path.resolve(cwd, file)) // make absolute
}
