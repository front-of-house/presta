import fs from 'fs-extra'
import path from 'path'

export const default404 = fs.readFileSync(
  path.join(__dirname, './404.html'),
  'utf8'
)
