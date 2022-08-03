/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */
import type { Manifest } from 'presta';
export declare type Options = {
    port: number;
};
export declare type Context = {
    staticOutputDir: string;
    functionsOutputDir: string;
    manifest: Manifest;
};
