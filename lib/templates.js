export function dynamic ({ sourceFiles, configFilepath }) {
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
