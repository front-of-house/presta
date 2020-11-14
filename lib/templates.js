export function stat ({ sourceFile, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';
import { Page } from '${sourceFile}';
${
  configFilepath
    ? `import * as config from '${configFilepath}'`
    : `const config = {}`
};

export { getPaths } from '${sourceFile}';

export function render (context) {
  return resolve(Page, context, config.render);
}

export function createDocument (context) {
  return config.createDocument ? config.createDocument(context) : document(context);
}
`
}

export function dynamic ({ sourceFiles, configFilepath }) {
  return `import { render as resolve } from 'presta/load';
import { document } from 'presta/document';
${sourceFiles
  .map((file, i) => `import * as Template${i} from '${file}';`)
  .join('\n')}
${
  configFilepath
    ? `import * as config from '${configFilepath}'`
    : `const config = {}`
};

const pages = [
${sourceFiles.map((file, i) => `Template${i}`).join(',\n')}
]

function render (context) {
  return resolve(Page, context, config.render);
}

function createDocument (context) {
  return config.createDocument ? config.createDocument(context) : document(context);
}

export async function handler (ev, ctx) {
  return 'hello'
}
`
}
