export function stat ({ sourceFile, configFilepath }) {
  return `export * as source from '${sourceFile}';
${
  configFilepath
    ? `export * as config from '${configFilepath}'`
    : `export const config = {}`
}
`
}

export function dynamic ({ sourceFiles, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { createRouter } from 'presta/router';
import { createHandler } from 'presta/lib/handler';

import * as userConfig from '${configFilepath}'
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}

const pages = [
  ${sourceFiles.map((file, i) => `Template${i}`).join(',\n  ')}
];
export const router = createRouter(pages, userConfig);
export const handler = createHandler(router, userConfig);
export const config = userConfig;
`
}
