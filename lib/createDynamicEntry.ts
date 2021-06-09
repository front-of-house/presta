import config from "./types/config"

import fs from 'fs-extra'

import { debug } from './debug'
import { serialize } from './config'

const template = (sourceFiles: string[], config: config) => {
  const presta = config.env === 'production' ? 'presta' : 'presta:internal'
  const configFilepath = Object.keys(config.configFilePath).length
    ? config.configFilePath
    : undefined

  return `import { createRouter } from '${presta}/lib/router';
import { createHandler } from '${presta}/lib/handler';

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

export const createDynamicEntry = (sourceFiles: string[], config: config) => {
  const entryFile = config.dynamicEntryFilePath

  fs.outputFileSync(entryFile, template(sourceFiles, config))

  debug('created entry', entryFile)

  return entryFile
}
