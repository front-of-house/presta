import fs from 'fs'
import { sync } from 'matched'
import fm from 'front-matter'

export function getFiles (...globs) {
  return globs
    .flat()
    .map(sync)
    .flat()
    .map(f => {
      const { attributes, body } = fm(fs.readFileSync(f, 'utf8'))
      return {
        ...attributes,
        content: body
      }
    })
}
