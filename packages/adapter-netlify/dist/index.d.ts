import { PluginContext, Manifest } from 'presta';
export declare type NetlifyConfig = {
    build: {
        publish: string;
        functions?: string;
    };
};
export declare type NetlifyRedirect = {
    from: string;
    to: string;
    status: number;
    force: boolean;
    query: {
        [param: string]: string;
    };
    conditions: {
        [param: string]: string;
    };
    signed: string | undefined;
};
export declare function getNetlifyConfig(configFilepath: string): Partial<NetlifyConfig> | undefined;
export declare function validateAndNormalizeNetlifyConfig(config?: Partial<NetlifyConfig>): NetlifyConfig;
export declare function toAbsolutePath(cwd: string, file?: string): string | undefined;
export declare function toRelativePath(cwd: string, filepath: string): string;
export declare function normalizeNetlifyRoute(route: string): string;
export declare function prestaRoutesToNetlifyRedirects(files: Manifest['functions']): NetlifyRedirect[];
export declare function generateRedirectsString(redirects: NetlifyRedirect[]): string;
export declare function getUserConfiguredRedirects(dir: string): Promise<NetlifyRedirect[]>;
export declare function onPostBuild(config: NetlifyConfig, ctx: PluginContext): Promise<void>;
declare const _default: (options: unknown) => import("presta").Plugin;
export default _default;
