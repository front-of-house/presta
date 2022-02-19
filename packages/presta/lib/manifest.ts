import fs from 'fs-extra'

import { Config } from './config'
import { StaticFilesMap } from './buildStaticFiles'

export type ManifestDynamicFile = {
  type: 'dynamic'
  src: string
  dest: string
  route: string
}

export type ManifestStaticFile = {
  type: 'static'
  src: string
  dest: string
}

export type ManifestFile = ManifestDynamicFile | ManifestStaticFile

export type Manifest = {
  files: ManifestFile[]
}

export function staticFilesMapToManifestFiles(staticFilesMap: StaticFilesMap): ManifestStaticFile[] {
  return Object.keys(staticFilesMap)
    .map((src) => {
      return staticFilesMap[src].map((dest) => ({
        type: 'static',
        src,
        dest,
      })) as ManifestStaticFile[]
    })
    .flat()
}

export function getDynamicFilesFromManifest(manifest: Manifest): ManifestDynamicFile[] {
  return manifest.files.filter((file) => file.type === 'dynamic') as ManifestDynamicFile[]
}

export function getStaticFilesFromManifest(manifest: Manifest): ManifestStaticFile[] {
  return manifest.files.filter((file) => file.type === 'static') as ManifestStaticFile[]
}

export function writeManifest(manifest: Manifest, config: Config): void {
  fs.outputFileSync(config.manifestFilepath, JSON.stringify(manifest, null, '  '), 'utf8')
}
