const fs = require('fs-extra')
const path = require('path')

const {
  CWD,
  PRESTA_DIR,
  PRESTA_PAGES,
  PRESTA_WRAPPED_PAGES
} = require('./constants')
const { encodeFilename } = require('./encodeFilename')

// TODO make config optional
function createScript ({ sourceFile, configFilepath, runtimeFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';
import { Page } from '${sourceFile}';
${
  runtimeFilepath
    ? `import * as config from '${runtimeFilepath}'`
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

function createEntries ({
  filesArray,
  baseDir,
  configFilepath,
  runtimeFilepath
}) {
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES)

  return filesArray.map(file => {
    const sourceFile = path.resolve(CWD, file)
    const filename = sourceFile.replace(baseDir, '')
    const encoded = encodeFilename(filename)

    const generatedFile = path.join(PRESTA_WRAPPED_PAGES, filename)
    fs.outputFileSync(
      generatedFile,
      createScript({ sourceFile, configFilepath, runtimeFilepath })
    )

    return {
      id: encoded,
      sourceFile,
      generatedFile
    }
  })
}

module.exports = { createEntries }
