import fs from 'fs-extra'
import path from 'path'
import matched from 'matched'

import { Presta } from '../'

export function isDynamic (file: string) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file, 'utf-8'))
}

export function isStatic (file: string) {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file, 'utf-8'))
}

export function isPrestaFile (file: string) {
  return isStatic(file) || isDynamic(file)
}

export function getFiles (config: Presta): string[] {
  return []
    .concat(config.merged.files)
    .map(file => path.resolve(config.cwd, file)) // make absolute
    .map(glob => matched.sync(glob, { cwd: config.cwd }))
    .flat()
}
