import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES } from './constants'
import { encodeFilename } from './encodeFilename'
import { debug } from './debug'
import { getValidFilesArray } from './getValidFilesArray'

export function createScript ({ sourceFile, configFilepath }) {
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

// takes same config as watch/build, from createConfigFromCLI
export function createEntries ({
  pages, // absolute paths
  configFilepath
}) {
  const filesArray = getValidFilesArray(pages)

  fs.emptyDirSync(PRESTA_WRAPPED_PAGES)

  const entries = filesArray.map(file => {
    const sourceFile = path.resolve(CWD, file)
    const filename = sourceFile.replace(CWD, '')
    const encoded = encodeFilename(filename)

    const generatedFile = path.join(PRESTA_WRAPPED_PAGES, filename)

    debug('generatedFile', generatedFile)

    fs.outputFileSync(
      generatedFile,
      createScript({ sourceFile, configFilepath })
    )

    return {
      id: encoded,
      sourceFile,
      generatedFile
    }
  })

  debug('entries', entries)

  return entries
}
