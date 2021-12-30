import fs from 'fs-extra'
import path from 'path'
import globSync from 'tiny-glob/sync'

import * as logger from './log'

export function isDynamic(file: string) {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file, 'utf-8'))
}

export function isStatic(file: string) {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file, 'utf-8'))
}

export function isPrestaFile(file: string) {
  return isStatic(file) || isDynamic(file)
}

export function getFiles(files: string[]): string[] {
  try {
    return ([] as string[])
      .concat(files)
      .map((file) => globSync(file))
      .flat()
      .map((file) => path.resolve(process.cwd(), file)) // make absolute
  } catch (e) {
    logger.error({
      label: 'paths',
      message: `no files found`,
      error: e as Error,
    })

    return []
  }
}
