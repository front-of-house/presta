import fs from 'fs-extra'

export function isStaticallyExportable (file) {
  return /export\s.+\sgetPaths/.test(fs.readFileSync(file))
}
