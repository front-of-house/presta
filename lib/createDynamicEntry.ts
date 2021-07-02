import fs from 'fs-extra'
import path from 'path'

import { debug } from './debug'
import { serialize } from './config'

import type { Presta } from '../'

function template (sourceFiles: string[], config: Presta) {
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

export function createDynamicEntry (sourceFiles: string[], config: Presta) {
  const entryFile = config.dynamicEntryFilepath

  fs.outputFileSync(entryFile, template(sourceFiles, config))

  debug('created entry', entryFile)

  return entryFile
}
