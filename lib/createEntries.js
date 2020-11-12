import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES, PRESTA_FUNCTIONS } from './constants'
import { encodeFilename } from './encodeFilename'
import { debug } from './debug'
import { getFiles, isStatic, isDynamic } from './getFiles'

export function createStaticEntry ({ sourceFile, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';
import { Page } from '${sourceFile}';
${
  configFilepath
    ? `import * as config from '${configFilepath}'`
    : `const config = {}`
};

export { getPaths } from '${sourceFile}';

export function render (context) {
  return resolve(Page, context, config.render);
}

export function createDocument (context) {
  return config.createDocument ? config.createDocument(context) : document(context);
}
`
}

export function createDynamicEntryFile ({ sourceFiles, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}
${
  configFilepath
    ? `import * as config from '${configFilepath}'`
    : `const config = {}`
};

const pages = [
${sourceFiles.map((file, i) => `Template${i}`).join(',\n')}
]

function render (context) {
  return resolve(Page, context, config.render);
}

function createDocument (context) {
  return config.createDocument ? config.createDocument(context) : document(context);
}

export async function handler (ev, ctx) {
  return 'hello'
}
`
}

// takes same config as watch/build, from createConfigFromCLI
export function createStaticEntries ({
  pages, // absolute paths
  configFilepath
}) {
  const staticSourceFiles = getFiles(pages).filter(isStatic)

  fs.emptyDirSync(PRESTA_WRAPPED_PAGES)

  const staticEntries = staticSourceFiles.map(file => {
    const encoded = encodeFilename(file)
    const entryFile = path.join(PRESTA_WRAPPED_PAGES, file)

    fs.outputFileSync(
      entryFile,
      createStaticEntry({ sourceFile: file, configFilepath })
    )

    return {
      id: encoded,
      sourceFile: file,
      entryFile
    }
  })

  debug('staticEntries', staticEntries)

  return staticEntries
}

export function createDynamicEntry ({
  pages, // absolute paths
  configFilepath
}) {
  const dynamicSourceFiles = getFiles(pages).filter(isDynamic)
  const entryFile = path.join(PRESTA_FUNCTIONS, 'presta.js')

  fs.emptyDirSync(PRESTA_FUNCTIONS)

  fs.outputFileSync(
    entryFile,
    createDynamicEntryFile({ sourceFiles: dynamicSourceFiles, configFilepath })
  )

  return entryFile
}
