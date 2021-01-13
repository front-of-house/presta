const fs = require('fs-extra')
const path = require('path')

const { debug } = require('./debug')
const { serialize } = require('./config')

function template (sourceFiles, config) {
  return `import { render as resolve } from 'presta/load';
import { createRouter } from 'presta/lib/router';
import { createHandler } from 'presta/lib/handler';

${
  config.configFilepath
    ? `import * as userConfig from '${config.configFilepath}'`
    : ``
}
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}

export const config = Object.assign({}, userConfig || {}, ${serialize(config)});
export const pages = [
  ${sourceFiles.map((file, i) => `Template${i}`).join(',\n  ')}
];
export const router = createRouter(pages, config);
export const handler = createHandler(router, config);
`
}

function createDynamicEntry (sourceFiles, config) {
  const entryFile = path.join(config.dynamicEntryFilepath)

  fs.outputFileSync(entryFile, template(sourceFiles, config))

  debug('created entry', entryFile)

  return entryFile
}

module.exports = { createDynamicEntry }
