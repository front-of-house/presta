import fs from 'fs-extra'
import path from 'path'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { debug } from './debug'

function template ({ sourceFiles, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { createRouter } from 'presta/router';
import { createHandler } from 'presta/lib/handler';

${configFilepath ? `import * as userConfig from '${configFilepath}'` : ``}
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}

export const pages = [
  ${sourceFiles.map((file, i) => `Template${i}`).join(',\n  ')}
];
export const router = createRouter(pages, userConfig);
export const handler = createHandler(router, userConfig);
export const config = userConfig;
`
}

export function createDynamicEntry (sourceFiles, config) {
  const entryFile = path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)

  fs.outputFileSync(
    entryFile,
    template({ sourceFiles, configFilepath: config.configFilepath })
  )

  debug('created entry', entryFile)

  return entryFile
}
