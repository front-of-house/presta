export function stat ({ sourceFile, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';

import * as userConfig from '${configFilepath}'
import { Page } from '${sourceFile}';

export { getPaths } from '${sourceFile}';

export function render (context) {
  return resolve(Page, context, userConfig.render);
}

export function createDocument (context) {
  return userConfig.createDocument ? userConfig.createDocument(context) : document(context);
}
`
}

export function dynamic ({ sourceFiles, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { createRouter } from 'presta/router';
import { createHandler } from 'presta/handler';

import * as userConfig from '${configFilepath}'
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}

const pages = [
  ${sourceFiles.map((file, i) => `Template${i}`).join(',\n  ')}
];
export const router = createRouter(pages, userConfig);
export const handler = createHandler(router, userConfig);
`
}
