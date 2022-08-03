import { PluginContext } from 'presta';
export declare const vercelConfig: {
    build: {
        env: {
            ENABLE_FILE_SYSTEM_API: string;
        };
    };
};
export declare const routesManifest: {
    version: 3;
    basePath: string;
    pages404: false;
    dynamicRoutes: {
        page: string;
        regex: string;
    }[];
};
export declare function generateRoutes(ctx: PluginContext): Promise<void>;
export declare function mergeVercelConfig(): any;
export declare function onPostBuild(ctx: PluginContext): Promise<void>;
declare const _default: (options: unknown) => import("presta").Plugin;
export default _default;
