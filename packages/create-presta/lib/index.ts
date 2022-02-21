import path from 'path'
import fs from 'fs-extra'
import merge from 'deepmerge'
import sort from 'sort-package-json'
import type { Body } from 'package-json-types'

export type Service = 'presta' | 'netlify' | 'vercel' | 'cloudflare_workers'
export type Language = 'ts' | 'js'
export type Config = {
  root: string
  service: Service
  language: Language
}

const templatesPath = path.join(__dirname, 'lib/templates')

export async function createPresta(config: Config) {
  const ts = config.language === 'ts'

  await fs.copy(ts ? path.join(templatesPath, '_ts') : path.join(templatesPath, '_js'), config.root)

  const basePkg = path.join(config.root, 'package.json')
  const baseConf = path.join(config.root, 'presta.config.js')
  const baseGitignore = path.join(config.root, 'gitignore')

  const service = {
    pkg: path.join(templatesPath, `${config.service}/package.json`),
    conf: path.join(templatesPath, `${config.service}/presta.config.js`),
    gitignore: path.join(templatesPath, `${config.service}/gitignore`),
  }

  const mergedPkg = sort(merge(require(service.pkg) as Body, require(basePkg) as Body))
  const mergedConf = fs.readFileSync(service.conf, 'utf8') + fs.readFileSync(baseConf, 'utf8')
  const mergedGitignore = fs.readFileSync(service.gitignore, 'utf8') + fs.readFileSync(baseGitignore, 'utf8')

  fs.writeFileSync(basePkg, JSON.stringify(mergedPkg, null, '  '), 'utf8')
  fs.writeFileSync(baseConf, mergedConf, 'utf8')
  fs.writeFileSync(path.join(config.root, './.gitignore'), mergedGitignore, 'utf8')
}
