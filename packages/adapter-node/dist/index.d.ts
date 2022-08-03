import { PluginContext } from 'presta';
import { Options } from './types';
export declare function onPostBuild(ctx: PluginContext, options: Options): Promise<void>;
declare const _default: (options: Partial<Options> | undefined) => import("presta").Plugin;
export default _default;
