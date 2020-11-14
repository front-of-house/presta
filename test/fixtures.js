import fs from 'fs-extra'
import path from 'path'

let root = process.cwd()

export function getRoot() {
  return root
}

export function setRoot(r) {
  root = r
}

export function create (fixtures) {
  for (const { url, content } of Object.values(fixtures)) {
    fs.outputFileSync(path.join(root, url), content)
  }

  return function cleanup () {
    for (const { url } of Object.values(fixtures)) {
      fs.removeSync(path.join(root, url))
    }
  }
}
