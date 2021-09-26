import { wrapHandler } from 'presta';
import * as file from '/Users/ericbailey/Sites/sure-thing/presta/examples/markdown/index.js';
export const route = file.route
export const handler = wrapHandler(file)