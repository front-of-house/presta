import fs from 'fs-extra'
import path from 'path'

import { CWD, PRESTA_WRAPPED_PAGES } from './constants'
import { encodeFilename } from './encodeFilename'
import { debug } from './debug'

export function createScript ({ sourceFile, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';
import { Page } from '${sourceFile}';
${
  configFilepath
    ? `import * as runtime from '${configFilepath}'`
    : `const runtime = {}`
};

export { getPaths } from '${sourceFile}';

export function render (context) {
  return resolve(Page, context, runtime.render);
}

export function createDocument (context) {
  return runtime.createDocument ? runtime.createDocument(context) : document(context);
}
`
}

export function createEntries ({
  filesArray, // absolute paths
  baseDir, // absolute path
  configFilepath
}) {
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES)

  return filesArray.map(file => {
    const sourceFile = path.resolve(CWD, file)
    const filename = sourceFile.replace(baseDir, '')
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
}
