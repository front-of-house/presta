import fs from 'fs-extra'
import path from 'path'

let root = process.cwd()

export function getRoot () {
  return root
}

export function setRoot (r) {
  root = r
}

export function create (files) {
  const outputFiles = {}

  for (const key of Object.keys(files)) {
    const { url, content } = files[key]
    const filepath = path.join(root, url)
    fs.outputFileSync(filepath, content)
    outputFiles[key] = filepath
  }

  return {
    cleanup () {
      for (const url of Object.values(outputFiles)) {
        try {
          fs.removeSync(url)
        } catch (e) {
          console.log('taco')
        }
      }
    },
    files: outputFiles
  }
}
