const fs = require('fs-extra')
const path = require('path')

const { CWD, PRESTA_DIR, PRESTA_PAGES, PRESTA_WRAPPED_PAGES } = require('./constants')
const { encodeFilename } = require('./encodeFilename')

// TODO make config optional
function createScript({ sourceFile, configFilepath, runtimeFilepath }) {
  return `import { render as resolve } from '@presta/load';
import { Page, getPaths as paths } from '${sourceFile}';
${runtimeFilepath ? `import * as config from '${runtimeFilepath}'` : `const config = {}`};

function defaultRender (page, context) {
  return page(context);
}
function defaultPrepare ({ body = '', head = '' }) {
  return \`<!DOCTYPE html>
<html>
  <head>
    \${head}
  </head>
  <body>
    \${body}
  </body>
</html>\`
}

export function getPaths() {
  return paths();
}

export function render (context) {
  return resolve(Page, context, config.render || defaultRender);
}

export function prepare (props) {
  return (config.prepare || defaultPrepare)(props)
}`
}

function createEntries({ filesArray, baseDir, configFilepath, runtimeFilepath }) {
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES)

  return filesArray.map((file) => {
    const sourceFile = path.resolve(CWD, file);
    const filename = sourceFile.replace(baseDir, "");
    const encoded = encodeFilename(filename);

    const generatedFile = path.join(PRESTA_WRAPPED_PAGES, filename)
    fs.outputFileSync(generatedFile, createScript({ sourceFile, configFilepath, runtimeFilepath }))

    return {
      id: encoded,
      sourceFile,
      generatedFile,
      compiledFile: path.join(PRESTA_PAGES, encoded + ".js"),
    };
  });
}

module.exports = { createEntries }
