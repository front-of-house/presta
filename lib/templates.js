export function stat ({ sourceFile, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';

export * as source from '${sourceFile}';
${
  configFilepath
    ? `export * as config from '${configFilepath}'`
    : `export const config = {}`
}

export function render (context) {
  return resolve(Page, context, userConfig.render);
}

export function formatContent (context) {
  return userConfig.formatContent ? userConfig.formatContent(context) : document(context);
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
`
}
