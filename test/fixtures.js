const fs = require('fs-extra')
const path = require('path')

let root = process.cwd()

function getRoot () {
  return root
}

function setRoot (r) {
  root = r
}

function create (files) {
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

module.exports = {
  getRoot,
  setRoot,
  create
}
