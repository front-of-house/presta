import fs from 'fs-extra'
import path from 'path'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { debug } from './debug'
import { serialize } from './config'

function template (sourceFiles, config) {
  return `import { render as resolve } from 'presta/load';
import { createRouter } from 'presta/router';
import { createHandler } from 'presta/lib/handler';

${
  config.configFilepath
    ? `import * as userConfig from '${config.configFilepath}'`
    : ``
}
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}

export const config = Object.assign({}, userConfig, ${serialize(config)});
export const pages = [
  ${sourceFiles.map((file, i) => `Template${i}`).join(',\n  ')}
];
export const router = createRouter(pages, config);
export const handler = createHandler(router, config);
`
}

export function createDynamicEntry (sourceFiles, config) {
  const entryFile = path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)

  fs.outputFileSync(entryFile, template(sourceFiles, config))

  debug('created entry', entryFile)

  return entryFile
}
