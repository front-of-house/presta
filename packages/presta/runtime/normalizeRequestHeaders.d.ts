/// <reference types="node" />
import type http from 'http';
import { Params, MultiValueParams } from 'lambda-types';
export declare function normalizeRequestHeaders(rawRequestHeaders: http.IncomingMessage['headers']): {
    headers: Params;
    multiValueHeaders: MultiValueParams;
};
