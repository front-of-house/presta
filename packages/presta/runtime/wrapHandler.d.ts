import { Response as LambdaResponse } from 'lambda-types';
import type { PrestaFunctionFile, Event, Context } from '../core';
/**
 * This function wraps every Presta handler. Plugins wrap around this, so keep
 * in mind that some work is done here already and doesn't need to be
 * duplicated in other adapters and plugins.
 */
export declare function wrapHandler(file: PrestaFunctionFile): (event: Event, context: Context) => Promise<LambdaResponse>;
