/// <reference types="node" />
import type http from 'http'
import { Response } from 'lambda-types'
export declare function sendServerlessResponse(res: http.ServerResponse, response: Response): void
