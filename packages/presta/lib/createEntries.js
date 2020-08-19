const fs = require('fs-extra')
const path = require('path')

const { CWD, PRESTA_DIR, PRESTA_PAGES, PRESTA_WRAPPED_PAGES } = require('./constants')
const { encodeFilename } = require('./encodeFilename')

// TODO make config optional
function createScript({ sourceFile, configFilepath }) {
  return `import { render as resolve } from '@/render/load';
import { Page, getPaths as paths } from '${sourceFile}';
import * as config from '${configFilepath}';

export function getPaths() {
  return paths();
}

export function render (context) {
  return resolve(Page, context, config.render);
}

export function prepare (props) {
  return config.prepare(props)
}`
}

function createEntries({ filesArray, baseDir, configFilepath }) {
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES)

  return filesArray.map((file) => {
    const sourceFile = path.resolve(CWD, file);
    const filename = sourceFile.replace(baseDir, "");
    const encoded = encodeFilename(filename);

    const generatedFile = path.join(PRESTA_WRAPPED_PAGES, filename)
    fs.outputFileSync(generatedFile, createScript({ sourceFile, configFilepath }))

    return {
      id: encoded,
      sourceFile,
      generatedFile,
      compiledFile: path.join(PRESTA_PAGES, encoded + ".js"),
    };
  });
}

module.exports = { createEntries }
