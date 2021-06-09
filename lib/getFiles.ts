import fs from 'fs-extra'
import path from 'path'
import matched from 'matched'
import config from './types/config'

export const isDynamic = (file: string) => {
  return /export\s.+\sroute\s+\=/.test(fs.readFileSync(file, 'utf-8'))
}

export const isStatic = (file: string) => {
  return /export\s.+\sgetStaticPaths/.test(fs.readFileSync(file, 'utf-8'))
}

export const getFiles = (config: config) => {
  return []
    .concat(config.merged.files)
    .map(file => path.resolve(config.cwd, file)) // make absolute
    .map(glob => matched.sync(glob, { cwd: config.cwd }))
    .flat()
}
