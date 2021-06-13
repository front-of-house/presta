const fs = require('fs-extra')
const path = require('path')

const { debug } = require('./debug')
const { serialize } = require('./config')

function template (sourceFiles, config) {
  const presta = config.env === 'production' ? 'presta' : 'presta:internal'
  const configFilepath = Object.keys(config.configFile).length
    ? config.configFilepath
    : undefined

  return `import { createRouter, createHandler } from '${presta}/utils';

${
  configFilepath
    ? `import * as userConfig from '${configFilepath}'`
    : `const userConfig = {}`
}
${sourceFiles
  .map(
    (file, i) =>
      `import * as Template${i} from '${file.replace(/\\/g, '\\\\')}';`
  )
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
  const entryFile = config.dynamicEntryFilepath

  fs.outputFileSync(entryFile, template(sourceFiles, config))

  debug('created entry', entryFile)

  return entryFile
}

module.exports = { createDynamicEntry }
