import fs from 'fs-extra'
import path from 'path'
import globSync from 'tiny-glob/sync'

import { Presta } from '..'

export function isDynamic(file: string) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file, 'utf-8'))
}

export function isStatic(file: string) {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file, 'utf-8'))
}

export function isPrestaFile(file: string) {
  return isStatic(file) || isDynamic(file)
}

export function getFiles(config: Presta): string[] {
  return ([] as string[])
    .concat(config.files)
    .map((file) => globSync(file, { cwd: config.cwd }))
    .flat()
    .map((file) => path.resolve(config.cwd, file)) // make absolute
}
