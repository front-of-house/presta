import { Response as LambdaResponse } from 'lambda-types';
import type { Response } from '../core';
export declare function normalizeResponse(response: Response | string): LambdaResponse;
