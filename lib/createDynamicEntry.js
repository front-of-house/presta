const fs = require('fs-extra')
const path = require('path')

const { debug } = require('./debug')
const { serialize } = require('./config')

function template (sourceFiles, config) {
  return `const { createRouter } = require(require.resolve('presta/lib/router'));
const { createHandler } = require(require.resolve('presta/lib/handler'));

${
  config.configFilepath
    ? `import * as userConfig from '${config.configFilepath}'`
    : `const userConfig = {}`
}
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}

export const config = Object.assign({}, userConfig, ${serialize(config)});
export const files = [
  ${sourceFiles.map((file, i) => `Template${i}`).join(',\n  ')}
];
export const router = createRouter(files, config);
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
