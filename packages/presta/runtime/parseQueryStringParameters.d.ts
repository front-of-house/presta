import { Params, MultiValueParams } from 'lambda-types';
export declare function parseQueryStringParameters(query: string): {
    queryStringParameters: Params;
    multiValueQueryStringParameters: MultiValueParams;
};
